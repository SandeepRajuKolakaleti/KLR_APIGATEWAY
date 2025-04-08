import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { SMSTemplate } from '../models/sms-template.interface';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AWSService {
    
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

    

    sendSNSMessage(template: SMSTemplate) {
        // step2 - check before user is valid or not (User microserive validation: step1) then only execute the below service
        return this.http.post(process.env.AWS_SERVER_URL+ 'api/Aws/send/', template)
            .pipe(
                map(response => (response as any).data)
            );
    }

}