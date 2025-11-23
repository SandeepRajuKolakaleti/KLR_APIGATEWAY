import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Param, Delete, ParseFilePipe, FileTypeValidator, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { VendorService } from '../../service/vendor/vendor.service';
import { CreateVendorDto, UpdateVendorDto } from '../../models/dto/create-vendor.dto';
import { VendorI } from '../../models/vendor.interface';

@Controller('vendors')
export class VendorController {
    constructor(private vendorService: VendorService) { }

    @Post("create-vendor")
    @UseInterceptors(FileInterceptor('file'))
    async createVendor(@UploadedFile() file: Express.Multer.File, @Body() createdVendorDto: CreateVendorDto,@Req() request: Request): Promise<Observable<VendorI>> {
        const parsedDto: CreateVendorDto = {
            ...createdVendorDto,
            Name: createdVendorDto.Name,
            ThumnailImage: createdVendorDto.ThumnailImage,
            Email: createdVendorDto.Email,
            PhoneNumber: Number(createdVendorDto.PhoneNumber),
            Address: createdVendorDto.Address,
        };
        return this.vendorService.createVendor(file, parsedDto);
        // test app constants - AppConstants.app.xyz
    }

    @Post('uploadImgToBase64')
    async base64(@Body() img: any) {
        console.log(img);
        return this.vendorService.getImageUrlToBase64(img.url);
    }

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
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        await this.vendorService.readExcelFile(file);
        return { message: 'File processed successfully!' };
    }

    @Get("getAll")
    async getAllVendors() {
        return this.vendorService.getAllVendors();
    }

    @Post('update-vendor')
     @UseInterceptors(FileInterceptor('file'))
    async updateVendor(@UploadedFile() file: Express.Multer.File, @Body() updatedVendorDto: UpdateVendorDto, @Req() request: Request): Promise<Observable<VendorI>> {
        return this.vendorService.updateVendor(file, updatedVendorDto); 
        // AppConstants.app.xyz
    }

    @Get('productsByVendor/:id')
    async getProductsByVendor(@Param('id') id: number): Promise<any> {
      return this.vendorService.getProductsByVendor(id);
    }

    @Get('vendor/:id')
    async info(@Param('id') id: number): Promise<any> {
      return this.vendorService.findOne(id);
    }

    @Delete('vendor/:id')
    async delete(@Param('id') id: number): Promise<any> {
      return this.vendorService.deleteVendor(id);
    }
}
