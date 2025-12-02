import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BrandI } from '../../../models/brand.interface';
import { CreateBrandDto, UpdateBrandDto } from '../../../models/dto/brand.dto';
import { RedisCacheService } from '../../../../redis/redis.service';
import { Pagination } from 'src/apigate/models/pagination.interface';

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

    async create(file: Express.Multer.File, createdBrandsDto: CreateBrandDto, user: any): Promise<Observable<BrandI>> {
        await this.getToken(user);
        const blob = new Blob([file.buffer], { type: file.mimetype });
        const formData = new FormData();
        formData.append('ThumnailImage', createdBrandsDto.ThumnailImage);
        formData.append('Name', createdBrandsDto.Name);
        formData.append('Slug', createdBrandsDto.Slug);
        formData.append('Status', createdBrandsDto.Status.toString());
        formData.append('file', blob, file.originalname);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/brands/create-brand', formData, { 
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer '+ this.token
            }
        })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllBrands(user: any, pagination: Pagination): Promise<Observable<BrandI[]>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/brands/getAll?offset='+ pagination.offset + '&limit='+ pagination.limit, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async update(file: Express.Multer.File, updatedBrandDto: UpdateBrandDto, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        const formData = new FormData();
        if (updatedBrandDto.Id) {
            formData.append('Id', String(updatedBrandDto.Id));
        }
        formData.append('ThumnailImage', updatedBrandDto.ThumnailImage);
        formData.append('Name', updatedBrandDto.Name);
        formData.append('Slug', updatedBrandDto.Slug);
        formData.append('Status', updatedBrandDto.Status.toString());
        if (file) {
            const blob = new Blob([file.buffer], { type: file.mimetype });
            formData.append('file', blob, file.originalname);
        }
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/brands/update-brand', formData, { 
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer '+ this.token
            }
         })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async findOne(id: number, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/brands/brand/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async delete(id: number, user: any) {
        await this.getToken(user);
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/brands/brand/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getToken(user: any) {
        let newLoginToken = await this.redisCacheService.get("userApiToken"+user.id);
        this.token = newLoginToken;
    }
}
