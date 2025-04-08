import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';


@Injectable()
export class EmailService {
    
    constructor(
        private http: HttpService
    ) {
    }

    // getHeaders(tokens): any {
    //     const headersRequest = {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${tokens}`,
    //     };
    //     return headersRequest;
    // }

    

    sendEmail(template: EmailTemplate) {
        // step2 - check before user is valid or not (User microserive validation: step1) then only execute the below service
        return this.http.post(process.env.EMAIL_SERVER_URL+ 'api/email/send/', template)
            .pipe(
                map(response => (response as any).data)
            );
    }

    // getEmail(loginUserDto: LoginApigateDto) {
    //     return this.http.post(process.env.USER_SERVER_URL+ 'api/email', loginUserDto)
    //         .pipe(
    //             map(response => response.data,)
    //         );
    // }

}