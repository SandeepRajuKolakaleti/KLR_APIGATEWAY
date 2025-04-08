import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '../../../models/dto/sub-category.dto';
import { SubCategoryI } from '../../../models/sub-category.interface';
import { RedisCacheService } from '../../../../redis/redis.service';

@Injectable()
export class SubCategoryService {
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

    async create(createdSubCategoryDto: CreateSubCategoryDto): Promise<Observable<SubCategoryI>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/sub-categories/create-subcategory', createdSubCategoryDto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllSubCategories(): Promise<Observable<SubCategoryI[]>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/sub-categories/getAll', { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
}

    async update(updatedSubCategoryDto: UpdateSubCategoryDto): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/sub-categories/update-subcategory', updatedSubCategoryDto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async findOne(id: number): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/sub-categories/subCategory/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async delete(id: number) {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/sub-categories/subCategory/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }
}
