import { Injectable, NotFoundException } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AppConstants } from 'src/app.constants';
import { CreateApigateDto } from '../models/dto/CreateApigate.dto';
import { LoginApigateDto } from '../models/dto/LoginApigate.dto';
import { ApigateService } from '../service/apigate.service';
import { AuthService } from './../../auth/services/auth/auth.service';
import { RedisCacheService } from './../../redis/redis.service';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';



@Injectable()
export class UserService {
    userApiToken: any;
    localToken: any;
    tokenData: any;
    token: any;
    mailOptions: any;
    userPermission:any;
    constructor(
        private http: HttpService,
        private apigateService: ApigateService,
        private authService: AuthService,
        private redisCacheService: RedisCacheService
    ) {
    }

    getHeaders(tokens: any): any {
        const headersRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens}`,
        };
        return headersRequest;
    }

    async getUsers() {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.USER_SERVER_URL+ 'api/users', { headers: this.getHeaders(this.token) })
            .pipe(
                map(response => (response as any).data)
            );
    }

    createUser(createdUserDto: CreateApigateDto) {
        console.log(JSON.stringify(createdUserDto), 'service data');
        return this.http.post(process.env.USER_SERVER_URL+ 'api/users/register', createdUserDto)
            .pipe(
                map(response => (response as any).data)
            );
    }

    loginUser(loginUserDto: LoginApigateDto) {
        return this.http.post(process.env.USER_SERVER_URL+ 'api/users/login', loginUserDto)
            .pipe(
                map(response => (response as any).data)
            );
    }

    async findUserByEmail(email: String) {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.USER_SERVER_URL+ 'api/users/findByMail/' + email, { headers: this.getHeaders(this.token) })
            .pipe(map(response => (response as any).data));
    }

    async findUserById(id: String) {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.USER_SERVER_URL+ 'api/users/profile/' + id, { headers: this.getHeaders(this.token) })
            .pipe(map(response => (response as any).data));
    }

    async resetUserPassword(resetPassword: LoginApigateDto) {
        // this.token = await this.redisCacheService.get("localtoken");
        return this.http.post(process.env.USER_SERVER_URL+ 'api/users/resetPassword', resetPassword)
            .pipe(
                map(response => (response as any).data)
            );
    }

    async generateApiGateToken(loginUserDto: any) {
        try {
            const user = lastValueFrom(await this.authService.generateJwt(loginUserDto));
            if (!user) {
                throw new NotFoundException('User not found');
            }
            console.log("Return with Local Token:", user);
            return user.then((response) => { 
                console.log(response)
                loginUserDto.tokenStr = response;
                this.localToken = response;
                return this.authenticateApiToken(loginUserDto);
            });
            
        } catch (error) {
            console.error('Error generating API token:', error);
            throw error;
        }
    }
    

    async authenticateApiToken(loginUserDto: any) {
        var email = loginUserDto.email;
        return this.loginUser(loginUserDto).pipe(map(async response => {
            const parsedResponse = JSON.parse(JSON.stringify(response));
                this.userApiToken = parsedResponse.access_token;
                this.userPermission = parsedResponse.user_Permission;
                await this.redisCacheService.set("email", email);
                await this.redisCacheService.set("localtoken", this.localToken);
                await this.redisCacheService.set("phoneNo", loginUserDto.phonenumber);
                await this.redisCacheService.set("userApiToken", this.userApiToken);
                await this.redisCacheService.set("userPermission", this.userPermission);
                await this.redisCacheService.set("id", parsedResponse.id);

                // Data Base Token Updated logic
                // this.tokenData = {
                //     "localtoken": this.localToken,
                //     "email": email,
                //     "phoneNo": loginUserDto.phonenumber,
                //     "apitoken": this.apigateToken
                // }
                // this.apigateService.createToken(this.tokenData);

                //Return result as response
                // send confirmation mail
                // this.mailDto.from="klrtechnogroups@gmail.com";
                // this.mailDto.to="sandeepraju538@gmail.com";
                // this.mailDto.subject="Test Mail";
                // this.mailDto.body="Hi Dude "+loginUserDto.email+" You are Successfully Logged in";
                // this.mailOptions =  this.mailTemplate.userEmailTemplate(this.mailDto);

                var userData = {
                    access_token_local: this.localToken,
                    token_type: 'JWT',
                    user_permission:this.userPermission,
                    expires_in: AppConstants.app.jwt.expiryTime,
                    id: parsedResponse.id
                };

                return userData;
            })
        );
    }

}