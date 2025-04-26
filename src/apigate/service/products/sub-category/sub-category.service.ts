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

    async create(file: Express.Multer.File, createdSubCategoryDto: CreateSubCategoryDto): Promise<Observable<SubCategoryI>> {
        this.token = await this.redisCacheService.get("localtoken");
        const blob = new Blob([file.buffer], { type: file.mimetype });
        const formData = new FormData();
        formData.append('ThumnailImage', createdSubCategoryDto.ThumnailImage);
        formData.append('Name', createdSubCategoryDto.Name);
        formData.append('Slug', createdSubCategoryDto.Slug);
        formData.append('Status', createdSubCategoryDto.Status.toString());
        formData.append('file', blob, file.originalname);
        formData.append('Category', createdSubCategoryDto.Category.toString());
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/create-subcategory', formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer '+ this.token
            }
        })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllSubCategories(): Promise<Observable<SubCategoryI[]>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/getAll', { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
}

    async update(file: Express.Multer.File, updatedSubCategoryDto: UpdateSubCategoryDto): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        const formData = new FormData();
        formData.append('Id', (updatedSubCategoryDto.Id as any).toString());
        formData.append('ThumnailImage', updatedSubCategoryDto.ThumnailImage);
        formData.append('Name', updatedSubCategoryDto.Name);
        formData.append('Slug', updatedSubCategoryDto.Slug);
        formData.append('Status', updatedSubCategoryDto.Status.toString());
        formData.append('Category', updatedSubCategoryDto.Category.toString());
        if (file) {
            const blob = new Blob([file.buffer], { type: file.mimetype });
            formData.append('file', blob, file.originalname);
        }
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/update-subcategory', formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer '+ this.token
            }
        })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async findOne(id: number): Promise<Observable<any>> {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/subCategory/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async delete(id: number) {
        this.token = await this.redisCacheService.get("localtoken");
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/subCategory/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }
}
