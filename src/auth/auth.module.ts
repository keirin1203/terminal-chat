import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule} from '@nestjs/jwt';
import 'dotenv/config'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPERATION_TIME
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [
    JwtModule,
    AuthModule
  ]
})
export class AuthModule {
}
