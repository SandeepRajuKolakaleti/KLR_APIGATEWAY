import {
  Injectable
} from '@nestjs/common';
import { AddToCartDto, UpdateCartDto } from '../../../models/dto/add-to-cart.dto';
import { HttpService } from '@nestjs/axios';
import { RedisCacheService } from '../../../../redis/redis.service';
import { map } from 'rxjs';
import { Pagination } from '../../../../apigate/models/pagination.interface';

@Injectable()
export class AddToCartService {
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

    async addToCart(userId: number, dto: AddToCartDto) {
        await this.getToken(userId);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/add-to-cart', dto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getCart(userId: number, pagination: Pagination) {
        await this.getToken(userId);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/add-to-cart?offset='+ pagination.offset + '&limit='+ pagination.limit, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async updateQuantity(
        userId: number,
        cartItemId: number,
        dto: UpdateCartDto,
    ) {
        await this.getToken(userId);
        return this.http.patch(process.env.PRODUCT_SERVER_URL+ 'api/add-to-cart/'+ cartItemId, dto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async removeItem(userId: number, cartItemId: number) {
        await this.getToken(userId);
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/add-to-cart/'+ cartItemId, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async clearCart(userId: number) {
        await this.getToken(userId);
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/add-to-cart', { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getToken(id: any) {
        let newLoginToken = await this.redisCacheService.get("userApiToken"+id);
        this.token = newLoginToken;
    }
}
