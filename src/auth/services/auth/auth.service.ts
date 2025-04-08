import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { AppConstants } from '../../../app.constants';
import { ApigateI } from '../../../apigate/models/apigate.interface'; //src/user/models/user.interface
const bcrypt = require ('bcrypt');

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) {}

    generateJwt(user: ApigateI): Observable<string> {
        return from(this.jwtService.signAsync({user}, { expiresIn: AppConstants.app.jwt.expiryTime }));
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12));
    }

    comparePasswords(password: string, storedPasswordHash: string): Observable<any> {
        return from(bcrypt.compare(password, storedPasswordHash));
    }
}
