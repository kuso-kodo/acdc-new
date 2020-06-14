import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ description: '登录' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ description: '注册' })
  @Post('user/register')
  async register(@Body() loginDto: LoginDto) {
    this.userService.register(loginDto.username, loginDto.password);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: '查看用户信息' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    return req.user;
  }
}
