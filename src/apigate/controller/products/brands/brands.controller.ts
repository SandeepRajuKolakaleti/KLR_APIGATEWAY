import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BrandI } from '../../../models/brand.interface';
import { CreateBrandDto, UpdateBrandDto } from '../../../models/dto/brand.dto';
import { BrandsService } from '../../../service/products/brands/brands.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignedInUserInterceptor } from '../../../service/signed-in-user.interceptor.service';
import { Request } from 'express';

@Controller('brands')
@UseInterceptors(SignedInUserInterceptor)
export class BrandsController {
    constructor(private brandsService: BrandsService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-brand")
    @UseInterceptors(FileInterceptor('file'))
    createCategory(@UploadedFile() file: Express.Multer.File, @Body() createdCategoryDto: CreateBrandDto, @Req() request: Request): Promise<Observable<BrandI>> {
        console.log(request.user);
        return this.brandsService.create(file, createdCategoryDto, request.user);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllBrands(@Req() request: Request) {
        console.log(request.user);
        return this.brandsService.getAllBrands(request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-brand')
    @UseInterceptors(FileInterceptor('file'))
    async updateCategory(@UploadedFile() file: Express.Multer.File, @Body() updatedBrandDto: UpdateBrandDto, @Req() request: Request): Promise<Observable<BrandI>> {
        console.log(request.user);
        return this.brandsService.update(file, updatedBrandDto, request.user);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('brand/:id')
    async info(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.brandsService.findOne(id, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('brand/:id')
    async deleteBrand(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.brandsService.delete(id, request.user);
    }
}
