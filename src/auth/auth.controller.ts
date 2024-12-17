import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto,CreateUserDto } from './dto';
import { log } from 'console';
import { AuthGuard } from '@nestjs/passport';
import { use } from 'passport';
import { User } from './entities/user.entity';
import { raw } from 'express';
import { RawHeaders,GetUser, Auth } from './decorators/index';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) { 
    return this.authService.create(createUserDto);
  } 

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) { 
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {

    console.log({request});
    console.log({user});
    return {
      ok: true, 
      message: 'This is a private route', 
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  @Get('private2')
  //@SetMetadata('roles',['admin','super-user'] )
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true, 
      user
    } 
  }


  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true, 
      user
    } 
  }
   
}
