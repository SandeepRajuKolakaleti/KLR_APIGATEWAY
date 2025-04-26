import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '../../../models/dto/sub-category.dto';
import { SubCategoryI } from '../../../models/sub-category.interface';
import { SubCategoryService } from '../../../service/products/sub-category/sub-category.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('sub-categories')
export class SubCategoriesController {
    constructor(private subCategoryService: SubCategoryService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-subcategory")
    @UseInterceptors(FileInterceptor('file'))
    createSubCategory(@UploadedFile() file: Express.Multer.File, @Body() createdSubCategoryDto: CreateSubCategoryDto): Promise<Observable<SubCategoryI>> {
        return this.subCategoryService.create(file, createdSubCategoryDto);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllSubCategories() {
        return this.subCategoryService.getAllSubCategories();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-subcategory')
    @UseInterceptors(FileInterceptor('file'))
    async updateSubCategory(@UploadedFile() file: Express.Multer.File, @Body() updatedSubCategoryDto: UpdateSubCategoryDto): Promise<Observable<SubCategoryI>> {
        return this.subCategoryService.update(file, updatedSubCategoryDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('subCategory/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.subCategoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('subCategory/:id')
    async deleteSubCategory(@Param('id') id: number): Promise<any> {
        return this.subCategoryService.delete(id);
    }
}
