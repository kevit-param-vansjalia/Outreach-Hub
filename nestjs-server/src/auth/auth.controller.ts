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

  // ---------------- LOGIN ----------------
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  // ---------------- REGISTER ----------------
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.register(email, password);
  }

  // ---------------- REFRESH TOKEN ----------------
  // @UseGuards(RefreshAuthGuard) // Guard is removed as we now take token from body
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
