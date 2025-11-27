import { Injectable } from '@nestjs/common';
import { CreateVendorDto, UpdateVendorDto } from '../../models/dto/create-vendor.dto';
import { map, Observable} from 'rxjs';
import { VendorI } from '../../models/vendor.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { RedisCacheService } from 'src/redis/redis.service';

@Injectable()
export class VendorService {
    token!: string;
    constructor(
        private configService: ConfigService,
        private http: HttpService,
        private redisCacheService: RedisCacheService
    ) {
    }

    async getImageUrlToBase64(s3Key: any) {
        return this.http.post(process.env.PRODUCT_SERVER_URL+'api/vendors/uploadImgToBase64', { url: s3Key })
        .pipe(
        map(response => { 
            const base64 = Buffer.from(response.data, 'binary').toString('base64');
            const contentType = response.headers['content-type'];
            return `data:${contentType};base64,${base64}`;
        }));
    }

    async readExcelFile(file: Express.Multer.File, user: any): Promise<any> {
        await this.getToken(user);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/products/upload/excel', file, { headers: this.getFormDataHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async createVendor(file: Express.Multer.File, createVendorDto: CreateVendorDto, user: any): Promise<Observable<VendorI>> {
        await this.getToken(user);
        // convert Node Buffer to Uint8Array to satisfy BlobPart typing
        const uint8Array = new Uint8Array(file.buffer);
        const blob = new Blob([uint8Array], { type: file.mimetype });
        const formData = new FormData();
        formData.append('file', blob, file.originalname);
        Object.entries(createVendorDto).forEach(([key, value]) => {
            if (key === 'Highlight' || key === 'Specifications') {
                formData.append(key, JSON.stringify(value));
            } else  {
                formData.append(key, String(value));
            }
        });
        console.log(formData);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/vendors/create-vendor', formData, { headers: this.getFormDataHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async updateVendor(file: Express.Multer.File, updatedVendorDto: UpdateVendorDto, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        const formData = new FormData();
        if (file) {
            // convert Node Buffer to Uint8Array to satisfy BlobPart typing
            const uint8Array = new Uint8Array(file.buffer);
            const blob = new Blob([uint8Array], { type: file.mimetype });
            formData.append('file', blob, file.originalname);
        }
        updatedVendorDto.PhoneNumber = Number(updatedVendorDto.PhoneNumber);
        Object.entries(updatedVendorDto).forEach(([key, value]) => {
            if (key === 'PhoneNumber')
                formData.append(key, value);
            else
            formData.append(key, String(value));
        });
        console.log("formData :", formData);
        return this.http.post(process.env.PRODUCT_SERVER_URL+ 'api/vendors/update-vendor', formData, { headers: this.getFormDataHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getAllVendors(user: any): Promise<Observable<VendorI[]>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/vendors/getAll', { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getProductsByVendor(Id: number, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/vendors/productsByVendor/'+Id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async findOne(Id: number, user: any): Promise<Observable<any>> {
        await this.getToken(user);
        return this.http.get(process.env.PRODUCT_SERVER_URL+ 'api/vendors/vendor/'+ Id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async deleteVendor(Id: number, user: any) {
        await this.getToken(user);
        return this.http.delete(process.env.PRODUCT_SERVER_URL+ 'api/vendors/vendor/'+ Id, { headers: this.getHeaders(this.token) })
        .pipe(
            map(response => (response as any).data)
        );
    }

    async getToken(user: any) {
        let newLoginToken = await this.redisCacheService.get("userApiToken"+user.id);
        this.token = newLoginToken;
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
}
