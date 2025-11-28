import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Param, Delete, ParseFilePipe, FileTypeValidator, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { VendorService } from '../../service/vendor/vendor.service';
import { CreateVendorDto, UpdateVendorDto } from '../../models/dto/create-vendor.dto';
import { VendorI } from '../../models/vendor.interface';
import { SignedInUserInterceptor } from '../../service/signed-in-user.interceptor.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('vendors')
@UseInterceptors(SignedInUserInterceptor)
export class VendorController {
    constructor(private vendorService: VendorService) { }

    @UseGuards(JwtAuthGuard)
    @Post("create-vendor")
    @UseInterceptors(FileInterceptor('file'))
    async createVendor(@UploadedFile() file: Express.Multer.File, @Body() createdVendorDto: CreateVendorDto,@Req() request: Request): Promise<Observable<VendorI>> {
        const parsedDto: CreateVendorDto = {
            ...createdVendorDto,
            name: createdVendorDto.name,
            image: createdVendorDto.image,
            email: createdVendorDto.email,
            phonenumber: Number(createdVendorDto.phonenumber),
            address: createdVendorDto.address,
            password: createdVendorDto.password,
            userRole: createdVendorDto.userRole,
            permissionId: Number(createdVendorDto.permissionId),
            birthday: createdVendorDto.birthday,
            revenue: createdVendorDto.revenue,
            totalSales: createdVendorDto.totalSales,
        };
        return this.vendorService.createVendor(file, parsedDto, request.user);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadImgToBase64')
    async base64(@Body() img: any) {
        console.log(img);
        return this.vendorService.getImageUrlToBase64(img.url);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload/excel')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads', // Save file in 'uploads' folder
                filename: (req, file, cb) => {
                    const fileExt = extname(file.originalname);
                    const fileName = `upload-${Date.now()}${fileExt}`;
                    cb(null, fileName);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(xls|xlsx)$/)) {
                    return cb(new Error('Only Excel files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadExcel(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        await this.vendorService.readExcelFile(file, request.user);
        return { message: 'File processed successfully!' };
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllVendors(@Req() request: Request): Promise<Observable<VendorI[]>> {
        return this.vendorService.getAllVendors(request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-vendor')
    @UseInterceptors(FileInterceptor('file'))
    async updateVendor(@UploadedFile() file: Express.Multer.File, @Body() updatedVendorDto: UpdateVendorDto, @Req() request: Request): Promise<Observable<VendorI>> {
        return this.vendorService.updateVendor(file, updatedVendorDto, request.user); 
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('productsByVendor/:id')
    async getProductsByVendor(@Param('id') id: number, @Req() request: Request): Promise<any> {
      return this.vendorService.getProductsByVendor(id, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('vendor/:id')
    async info(@Param('id') id: number, @Req() request: Request): Promise<any> {
      return this.vendorService.findOne(id, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('vendor/:id')
    async delete(@Param('id') id: number, @Req() request: Request): Promise<any> {
      return this.vendorService.deleteVendor(id, request.user);
    }
}
