import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { User, UserDocument } from '../schemas/user.schema';
import { RefreshToken, RefreshTokenDocument } from '../schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  // ✅ 1. Login: validate + issue tokens
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.generateTokens(user);

    // save refresh token
    await this.saveRefreshToken(user._id as Types.ObjectId, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: `Welcome ${user.email}`,
    };
  }

  // ✅ 2. Validate user credentials
  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  // ✅ 3. Generate access & refresh tokens
  async generateTokens(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // ✅ 4. Save refresh token in DB
  async saveRefreshToken(userId: Types.ObjectId, token: string, expiresIn = 7) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);

    const refreshToken = new this.refreshTokenModel({
      userId,
      token,
      expiresAt,
    });

    await refreshToken.save();
    return refreshToken;
  }

  // ✅ 5. Refresh tokens using stored refresh token
  async refreshTokens(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

      const storedToken = await this.refreshTokenModel.findOne({ token }).exec();
      if (!storedToken) throw new UnauthorizedException('Refresh token not found');
      if (storedToken.expiresAt < new Date()) {
        await storedToken.deleteOne();
        throw new UnauthorizedException('Refresh token expired');
      }

      const user = await this.userModel.findById(payload.sub).exec();
      if (!user) throw new UnauthorizedException('User not found');

      // generate new tokens
      const tokens = await this.generateTokens(user);

      // replace old refresh token
      await storedToken.deleteOne();
      await this.saveRefreshToken(user._id as Types.ObjectId, tokens.refreshToken);

      return tokens;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // ✅ 6. Logout (remove refresh token)
  async removeRefreshToken(token: string) {
    await this.refreshTokenModel.deleteOne({ token }).exec();
  }
}
