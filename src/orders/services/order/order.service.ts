import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CreateOrderDto, UpdateOrderDto } from '../../../orders/models/dto/order.dto';
import { RedisCacheService } from '../../../redis/redis.service';

@Injectable()
export class OrderService {
    token!: string;
    constructor(
        private http: HttpService,
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

    async create(createdOrderDto: CreateOrderDto, userId: string) {
        await this.getToken(userId);
        return this.http.post(process.env.ORDER_SERVER_URL+ 'api/orders/create-order', createdOrderDto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAll(userId: string) {
        await this.getToken(userId);
        return this.http.get(process.env.ORDER_SERVER_URL+ 'api/orders/getAll', { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async update(updatedOrderDto: UpdateOrderDto, userId: string): Promise<Observable<any>> {
        await this.getToken(userId);
        return this.http.post(process.env.ORDER_SERVER_URL+ 'api/orders/update-order', updatedOrderDto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async findOne(Id: number, userId: string): Promise<Observable<any>> {
        await this.getToken(userId);
        return this.http.get(process.env.ORDER_SERVER_URL+ 'api/orders/order/'+ Id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async delete(Id: number, userId: string) {
        await this.getToken(userId);
        return this.http.delete(process.env.ORDER_SERVER_URL+ 'api/orders/order/'+ Id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getToken(id: any) {
        let newLoginToken = await this.redisCacheService.get("userApiToken"+id);
        this.token = newLoginToken;
    }
}
