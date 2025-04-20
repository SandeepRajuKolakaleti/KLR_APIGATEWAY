import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CategoryI } from '../../../models/category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../models/dto/category.dto';
import { RedisCacheService } from '../../../../redis/redis.service';

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

    async create(file: Express.Multer.File, createdCategoryDto: CreateCategoryDto): Promise<Observable<CategoryI>> {
        this.token = await this.redisCacheService.get("localtoken");
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
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoidGVzdDEzQHRlc3QuY29tIiwicGFzc3dvcmQiOiJ0ZXN0NSJ9LCJpYXQiOjE3NDUxNDQ1MjAsImV4cCI6MTc0NTE0ODEyMH0.JJ73dqOUKd3Ski_9bwxNHGLvxyBYhKaYGDOMjx6-LgI'
            }
        })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllCategories(): Promise<Observable<CategoryI[]>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/categories/getAll', { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async update(updatedCategoryDto: UpdateCategoryDto): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/categories/update-category', updatedCategoryDto, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async findOne(id: number): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/categories/category/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async delete(id: number) {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/categories/category/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }
}
