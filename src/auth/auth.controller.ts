import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./create-user.dto";
import {AuthService} from "./auth.service";
import {AuthGuard} from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    constructor(private AuthService: AuthService) {
    }

    @Post('login')
    login(@Body() userDto: CreateUserDto){
        return this.AuthService.login(userDto)
    }

    @Post('registration')
    registration(@Body() userDto: CreateUserDto){
        return this.AuthService.registration(userDto)
    }

}
