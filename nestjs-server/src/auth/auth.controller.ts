import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ---------------- LOGIN (For Main Project) ----------------
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  // ---------------- NEW: ADMIN LOGIN (For Admin Portal) ----------------
  // This new endpoint handles the admin-specific login logic.
  @Post('admin/login')
  async adminLogin(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    // Calls the adminLogin method in your service which includes the isAdmin check
    return this.authService.adminLogin(email, password);
  }

  // ---------------- REGISTER ----------------
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.register(email, password);
  }

  // ---------------- REFRESH TOKEN ----------------
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }

  // ---------------- TEST ROUTE (Protected) ----------------
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async profile(@Req() req: any) {
    return { user: req.user };
  }
}
