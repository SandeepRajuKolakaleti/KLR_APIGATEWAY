import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BrandI } from '../../../models/brand.interface';
import { CreateBrandDto, UpdateBrandDto } from '../../../models/dto/brand.dto';
import { BrandsService } from '../../../service/products/brands/brands.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('brands')
export class BrandsController {
    constructor(private brandsService: BrandsService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-brand")
    @UseInterceptors(FileInterceptor('file'))
    createCategory(@UploadedFile() file: Express.Multer.File, @Body() createdCategoryDto: CreateBrandDto): Promise<Observable<BrandI>> {
        return this.brandsService.create(file, createdCategoryDto);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllBrands() {
        return this.brandsService.getAllBrands();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-brand')
    @UseInterceptors(FileInterceptor('file'))
    async updateCategory(@UploadedFile() file: Express.Multer.File, @Body() updatedBrandDto: UpdateBrandDto): Promise<Observable<BrandI>> {
        return this.brandsService.update(file, updatedBrandDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('brand/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.brandsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('brand/:id')
    async deleteBrand(@Param('id') id: number): Promise<any> {
        return this.brandsService.delete(id);
    }
}
