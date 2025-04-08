import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateApigateDto } from '../models/dto/CreateApigate.dto';
import { LoginApigateDto } from '../models/dto/LoginApigate.dto';
import { ApigateEntity } from '../models/apigate.entity';
import { UserTokenEntity } from '../models/user.token';

import { ApigateI } from '../models/apigate.interface';
import { TokenI } from '../models/token.interface';

import { UserTokenDto } from '../models/dto/UserToken.dto';




@Injectable()
export class ApigateService {

    constructor(
        // @InjectRepository(ApigateEntity)
        // private apigateRepository: Repository<ApigateEntity>,
        // @InjectRepository(UserTokenEntity)
        // private userTokenRepository:Repository<UserTokenEntity>,
        // private authService: AuthService
    ) { }

    // create(createdUserDto: CreateApigateDto): Observable<ApigateI> {
    //     return this.mailExists(createdUserDto.email).pipe(
    //         switchMap((exists: boolean) => {
    //             if (!exists) {
    //                 return this.authService.hashPassword(createdUserDto.password).pipe(
    //                     switchMap((passwordHash: string) => {
    //                         // Overwrite the user password with the hash, to store it in the db
    //                         createdUserDto.password = passwordHash;
    //                         return from(this.apigateRepository.save(createdUserDto)).pipe(
    //                             map((savedUser: ApigateI) => {
    //                                 const { password, ...user } = savedUser;
    //                                 return user;
    //                             })
    //                         )
    //                     })
    //                 )
    //             } else {
    //                 throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    //             }
    //         })
    //     )
    // }

    // createToken(userTokenDto: UserTokenDto){
    //     return from(this.userTokenRepository.save(userTokenDto)).pipe(
    //         map((savedToken: TokenI) => {
    //             const { localtoken,apitoken, ...tokens } = savedToken;
    //             return tokens;
    //         })
    //     )
    // }

    // login(loginUserDto: LoginApigateDto): Observable<string> {
    //     return this.findUserByEmail(loginUserDto.email).pipe(
    //         switchMap((user: ApigateI) => {
    //             if (user) {
    //                 return this.validatePassword(loginUserDto.password, user.password).pipe(
    //                     switchMap((passwordsMatches: boolean) => {
    //                         if (passwordsMatches) {
    //                             return this.findOne(user.id).pipe(switchMap((user: ApigateI) => this.authService.generateJwt(user))
    //                             )
    //                         } else {
    //                             throw new HttpException('Login was not Successfulll', HttpStatus.UNAUTHORIZED);
    //                         }
    //                     })
    //                 )
    //             } else {
    //                 throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    //             }
    //         }
    //         )
    //     )
    // }

    // findAll(): Observable<ApigateI[]> {
    //     return from(this.apigateRepository.find());
    // }

    // findOne(id: number): Observable<ApigateI> {
    //     return from(this.apigateRepository.findOne({ id }));
    // }

    //  findUserByEmail(email: string): Observable<ApigateI> {
    //     return from(this.apigateRepository.findOne({ email }, { select: ['id', 'email', 'name', 'password'] }));
    // }

    // private validatePassword(password: string, storedPasswordHash: string): Observable<boolean> {
    //     return this.authService.comparePasswords(password, storedPasswordHash);
    // }

    // private mailExists(email: string): Observable<boolean> {
    //     return from(this.apigateRepository.findOne({ email })).pipe(
    //         map((user: ApigateI) => {
    //             if (user) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         })
    //     )
    // }
    // private tokenExists(email: string): Observable<boolean> {
    //     return from(this.userTokenRepository.findOne({ email })).pipe(
    //         map((token: TokenI) => {
    //             if (token) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         })
    //     )
    // }

}
