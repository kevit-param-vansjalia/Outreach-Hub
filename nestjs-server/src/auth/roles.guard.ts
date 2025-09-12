import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles specified → allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // set by JwtAuthGuard

    if (!user || !user.sub) {
      return false; // JwtAuthGuard should normally catch this
    }

    // Try to extract workspaceId from multiple places
    let workspaceId =
      request.body?.workspaceId ||
      request.params?.workspaceId ||
      request.query?.workspaceId; // ✅ now handles query

    if (!workspaceId) {
      throw new ForbiddenException('Workspace context is required for this action.');
    }

    // Validate user and role for this workspace
    const dbUser = await this.userModel
      .findById(user.sub)
      .select('workspaces')
      .lean();

    if (!dbUser) {
      throw new ForbiddenException('User not found.');
    }

    if (!dbUser.workspaces || !Array.isArray(dbUser.workspaces)) {
      dbUser.workspaces = [];
    }

    const workspaceInfo = dbUser.workspaces.find(
      (w) =>
        w &&
        w.workspaceId &&
        w.workspaceId.toString() === workspaceId,
    );

    if (
      !workspaceInfo ||
      !workspaceInfo.role ||
      !requiredRoles.includes(workspaceInfo.role)
    ) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }

    return true;
  }
}
