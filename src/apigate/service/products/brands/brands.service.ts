import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BrandI } from '../../../models/brand.interface';
import { CreateBrandDto, UpdateBrandDto } from '../../../models/dto/brand.dto';
import { RedisCacheService } from '../../../../redis/redis.service';

@Injectable()
export class BrandsService {
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

    async create(createdBrandsDto: CreateBrandDto): Promise<Observable<BrandI>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/brands/create-brand', createdBrandsDto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllBrands(): Promise<Observable<BrandI[]>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/brands/getAll', { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async update(updatedBrandDto: UpdateBrandDto): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/brands/update-brand', updatedBrandDto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async findOne(id: number): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/brands/brand/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async delete(id: number) {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/brands/brand/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }
}
