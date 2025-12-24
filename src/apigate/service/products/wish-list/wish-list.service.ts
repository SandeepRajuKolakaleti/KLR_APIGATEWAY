import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddToWishlistDto } from '../../../models/dto/wish-list.dto';
import { HttpService } from '@nestjs/axios';
import { RedisCacheService } from '../../../../redis/redis.service';
import { map } from 'rxjs';
import { Pagination } from '../../../../apigate/models/pagination.interface';

@Injectable()
export class WishListService {
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

    async add(userId: number, dto: AddToWishlistDto) {
        await this.getToken(userId);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/wish-list', dto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAll(userId: number, pagination: Pagination) {
         await this.getToken(userId);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/wish-list?offset='+ pagination.offset + '&limit='+ pagination.limit, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async remove(userId: number, wishlistItemId: number) {
        await this.getToken(userId);
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/wish-list/'+ wishlistItemId, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async clear(userId: number) {
        await this.getToken(userId);
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/wish-list', { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getToken(id: any) {
        let newLoginToken = await this.redisCacheService.get("userApiToken"+id);
        this.token = newLoginToken;
    }
}
