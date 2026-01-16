import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../../../redis/redis.service';
import { map } from 'rxjs';
import { PaymentGateway } from '../../../apigate/models/payment-gateway.enum';

@Injectable()
export class PaymentService {
    token!: string;
    constructor(
        private http: HttpService,
        private redisCacheService: RedisCacheService
    ) {}

    getHeaders(tokens: any): any {
        const headersRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens}`,
        };
        return headersRequest;
    }

    getFormDataHeaders(tokens: any): any {
        const headersRequest = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${tokens}`,
        };
        return headersRequest;
    }

    async createOrder(gateway: PaymentGateway, amount: number, userId: string): Promise<any> {
        await this.getToken(userId);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/payment/create-order', { gateway: gateway, amount: amount }, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async verifyPayment(gateway: PaymentGateway, payload: any, userId: string): Promise<any> {
        await this.getToken(userId);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/payment/verify', { gateway: gateway, ...payload }, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getToken(id: any) {
        let newLoginToken = await this.redisCacheService.get("userApiToken"+id);
        this.token = newLoginToken;
    }
}
