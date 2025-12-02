import { Body, Controller, Get, HttpCode, Param, Post, UseGuards, UploadedFile, UseInterceptors, Req, Query, ParseIntPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateApigateDto, UpdateUserDto } from '../models/dto/CreateApigate.dto';
import { LoginApigateDto } from '../models/dto/LoginApigate.dto';
import { ApigateI } from '../models/apigate.interface';
// import { CreateUserDto } from '../models/dto/CreateUser.dto';
// import { LoginUserDto } from '../models/dto/LoginUser.dto';
// import { UserI } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignedInUserInterceptor } from '../service/signed-in-user.interceptor.service';

@Controller('users')
@UseInterceptors(SignedInUserInterceptor)
export class UserController {
    constructor(private userService: UserService) { }

    @Post("register")
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file: Express.Multer.File, @Body() createUserDto: CreateApigateDto): Promise<Observable<ApigateI>> {
      console.log(file);
      if (file) {
        createUserDto.image = file.originalname;
      }
      return this.userService.createUser(file, createUserDto);
      // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllUsers(@Req() request: Request,
      @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
      @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,) {
      return this.userService.getUsers({
        offset: Number(offset),
        limit: Number(limit)
      });
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

    @Post('update')
    @UseInterceptors(FileInterceptor('file'))
    async update(@UploadedFile() file: Express.Multer.File, @Body() updateUserDto: UpdateUserDto): Promise<Observable<ApigateI>> {
      console.log(file);
      if (file) {
        updateUserDto.image = file.originalname;
      }
      return this.userService.update(file, updateUserDto);
      // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadImgToBase64')
    async base64(@Body() img: any, @Req() request: any): Promise<any> {
      console.log(img);
      if(img === undefined || img === '') {
        return Error('No image provided');
      }
      return this.userService.getImageUrlToBase64(img, request.user);
    }

}
