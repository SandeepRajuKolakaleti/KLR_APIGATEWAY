import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ChildCategoryI } from '../../../models/child-category.interface';
import { CreateChildCategoryDto, UpdateChildCategoryDto } from '../../../models/dto/child-category.dto';
import { RedisCacheService } from '../../../../redis/redis.service';

@Injectable()
export class ChildCategoryService {
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

    async create(createdSubCategoryDto: CreateChildCategoryDto): Promise<Observable<ChildCategoryI>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/create-category', createdSubCategoryDto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllChildCategories(): Promise<Observable<ChildCategoryI[]>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/getAll', { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async update(updatedChildCategoryDto: UpdateChildCategoryDto): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/update-child-category', updatedChildCategoryDto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async findOne(id: number): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/child-category/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async delete(id: number) {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/child-category/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }
}
