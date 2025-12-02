import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ChildCategoryI } from '../../../models/child-category.interface';
import { CreateChildCategoryDto, UpdateChildCategoryDto } from '../../../models/dto/child-category.dto';
import { RedisCacheService } from '../../../../redis/redis.service';
import { Pagination } from 'src/apigate/models/pagination.interface';

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

    async create(file: Express.Multer.File, createdSubCategoryDto: CreateChildCategoryDto, user: any): Promise<Observable<ChildCategoryI>> {
        await this.getToken(user);
        const blob = new Blob([file.buffer], { type: file.mimetype });
        const formData = new FormData();
        formData.append('ThumnailImage', createdSubCategoryDto.ThumnailImage);
        formData.append('Name', createdSubCategoryDto.Name);
        formData.append('Slug', createdSubCategoryDto.Slug);
        formData.append('Status', createdSubCategoryDto.Status.toString());
        formData.append('file', blob, file.originalname);
        formData.append('Category', createdSubCategoryDto.Category.toString());
        formData.append('SubCategory', createdSubCategoryDto.SubCategory.toString());
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/create-child-category', formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer '+ this.token
            }
        })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllChildCategories(user: any, pagination: Pagination): Promise<Observable<ChildCategoryI[]>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/getAll?offset='+ pagination.offset + '&limit='+ pagination.limit, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async update(file: Express.Multer.File, updatedChildCategoryDto: UpdateChildCategoryDto, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        const formData = new FormData();
        formData.append('Id', (updatedChildCategoryDto.Id as any).toString());
        formData.append('ThumnailImage', updatedChildCategoryDto.ThumnailImage);
        formData.append('Name', updatedChildCategoryDto.Name);
        formData.append('Slug', updatedChildCategoryDto.Slug);
        formData.append('Status', updatedChildCategoryDto.Status.toString());
        formData.append('Category', updatedChildCategoryDto.Category.toString());
        formData.append('SubCategory', updatedChildCategoryDto.SubCategory.toString());
        if (file) {
            const blob = new Blob([file.buffer], { type: file.mimetype });
            formData.append('file', blob, file.originalname);
        }
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/update-child-category', formData, {
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
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/child-category/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async delete(id: number, user: any) {
        await this.getToken(user);
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/child-categories/child-category/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getToken(user: any) {
        let newLoginToken = await this.redisCacheService.get("userApiToken"+user.id);
        this.token = newLoginToken;
    }
}
