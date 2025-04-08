import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '../../../models/dto/sub-category.dto';
import { SubCategoryI } from '../../../models/sub-category.interface';
import { SubCategoryService } from '../../../service/products/sub-category/sub-category.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';

@Controller('sub-categories')
export class SubCategoriesController {
    constructor(private subCategoryService: SubCategoryService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-subcategory")
    createSubCategory(@Body() createdSubCategoryDto: CreateSubCategoryDto): Promise<Observable<SubCategoryI>> {
        return this.subCategoryService.create(createdSubCategoryDto);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllSubCategories() {
        return this.subCategoryService.getAllSubCategories();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-subcategory')
    async updateSubCategory(@Body() updatedSubCategoryDto: UpdateSubCategoryDto): Promise<Observable<SubCategoryI>> {
        return this.subCategoryService.update(updatedSubCategoryDto);
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
