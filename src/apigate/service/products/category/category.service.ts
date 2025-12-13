import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CategoryI } from '../../../models/category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../models/dto/category.dto';
import { RedisCacheService } from '../../../../redis/redis.service';
import { Pagination } from './../../../../apigate/models/pagination.interface';

@Injectable()
export class CategoryService {
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

    async create(file: Express.Multer.File, createdCategoryDto: CreateCategoryDto, user: any): Promise<Observable<CategoryI>> {
        if (!file) {
            throw new Error('File is required');
        }
        await this.getToken(user);
        const blob = new Blob([file.buffer], { type: file.mimetype });
        const formData = new FormData();
        formData.append('ThumnailImage', createdCategoryDto.ThumnailImage);
        formData.append('Name', createdCategoryDto.Name);
        formData.append('Slug', createdCategoryDto.Slug);
        formData.append('Status', createdCategoryDto.Status.toString());
        formData.append('file', blob, file.originalname);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/categories/create-category', formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer '+ this.token
            }
        })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllCategories(user: any, pagination: Pagination): Promise<Observable<CategoryI[]>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/categories/getAll?offset='+ pagination.offset + '&limit='+ pagination.limit, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async update(file: Express.Multer.File, updatedCategoryDto: UpdateCategoryDto, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        this.token = await this.redisCacheService.get("localtoken");
        const formData = new FormData();
        if (updatedCategoryDto.Id) {
            formData.append('Id', String(updatedCategoryDto.Id));
        }
        formData.append('ThumnailImage', updatedCategoryDto.ThumnailImage);
        formData.append('Name', updatedCategoryDto.Name);
        formData.append('Slug', updatedCategoryDto.Slug);
        formData.append('Status', updatedCategoryDto.Status.toString());
        if (file) {
            const blob = new Blob([file.buffer], { type: file.mimetype });
            formData.append('file', blob, file.originalname);
        }
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/categories/update-category', formData, { 
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer '+ this.token
            }
         })
        .pipe(
            map(response => (response as any).data),
            catchError(error => {
                console.error('Error updating category:', error);
                return throwError(() => new Error('Failed to update category. Please try again later.'));
            })
        );
    }

    async findOne(id: number, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/categories/category/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async delete(id: number, user: any) {
        await this.getToken(user);
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/categories/category/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getToken(user: any) {
        let newLoginToken = await this.redisCacheService.get("userApiToken"+user.id);
        this.token = newLoginToken;
    }
}
