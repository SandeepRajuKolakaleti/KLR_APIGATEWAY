import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../../../../redis/redis.service';
import { map, Observable } from 'rxjs';
import { CreateProductDto, UpdateProductDto } from '../../../models/dto/create-product.dto';
import { ProductI } from '../../../models/product.interface';
import { Pagination } from 'src/apigate/models/pagination.interface';
@Injectable()
export class ProductService {
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

    getFormDataHeaders(tokens: any): any {
        const headersRequest = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${tokens}`,
        };
        return headersRequest;
    }

    async createProducts(file: Express.Multer.File, createProductDto: CreateProductDto, user: any): Promise<Observable<ProductI>> {
        await this.getToken(user);
        // convert Node Buffer to Uint8Array to satisfy BlobPart typing
        const uint8Array = new Uint8Array(file.buffer);
        const blob = new Blob([uint8Array], { type: file.mimetype });
        const formData = new FormData();
        formData.append('file', blob, file.originalname);
        Object.entries(createProductDto).forEach(([key, value]) => {
            if (key === 'Highlight' || key === 'Specifications') {
                formData.append(key, JSON.stringify(value));
            } else  {
                formData.append(key, String(value));
            }
        });
        console.log(formData);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/products/create-product', formData, { headers: this.getFormDataHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async readExcelFile(file: Express.Multer.File, user: any): Promise<any> {
        await this.getToken(user);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/products/upload/excel', file, { headers: this.getFormDataHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllProducts(user: any, pagination: Pagination): Promise<Observable<ProductI[]>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/products/getAll?offset='+ pagination.offset + '&limit='+ pagination.limit, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async updateproduct(file: Express.Multer.File, updatedProductDto: UpdateProductDto, user: any): Promise<Observable<ProductI>> {
        await this.getToken(user);
        const formData = new FormData();
        if (file) {
            // convert Node Buffer to Uint8Array to satisfy BlobPart typing
            const uint8Array = new Uint8Array(file.buffer);
            const blob = new Blob([uint8Array], { type: file.mimetype });
            formData.append('file', blob, file.originalname);
        }
        Object.entries(updatedProductDto).forEach(([key, value]) => {
            if (key === 'Highlight' || key === 'Specifications') {
                formData.append(key, JSON.stringify(value));
            } else  {
                formData.append(key, String(value));
            }
        });
        console.log("formData :", formData);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/products/update-product', formData, { headers: this.getFormDataHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async findOne(id: number, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/products/product/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async deleteProduct(id: number, user: any) {
        await this.getToken(user);
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/products/product/'+ id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getImageUrlToBase64(payload: any, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/products/uploadImgToBase64', payload, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getToken(user: any) {
        let newLoginToken = await this.redisCacheService.get("userApiToken"+user.id);
        this.token = newLoginToken;
    }

}
