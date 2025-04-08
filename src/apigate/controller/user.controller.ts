import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateApigateDto } from '../models/dto/CreateApigate.dto';
import { LoginApigateDto } from '../models/dto/LoginApigate.dto';
import { ApigateI } from '../models/apigate.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post("register")
    createUser(@Body() createdUserDto: CreateApigateDto): Observable<ApigateI> {
        return this.userService.createUser(createdUserDto);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllUsers() {
        return this.userService.getUsers();
    }

    @Post('login')
    @HttpCode(200)
    async loginUser(@Body() loginUserDto: LoginApigateDto): Promise<Observable<Object>> {
        return await this.userService.generateApiGateToken(loginUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('findByEmail/:email')
    async findByEmail(@Param('email') email: string): Promise<any> {
        return this.userService.findUserByEmail(email);
    }


    @Post("resetPassword")
    async resetUser(@Body() resetUser: LoginApigateDto): Promise<any> {
        return this.userService.resetUserPassword(resetUser);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile/:id')
    async profile(@Param('id') id: string): Promise<any> {
        return this.userService.findUserById(id);
    }

}
