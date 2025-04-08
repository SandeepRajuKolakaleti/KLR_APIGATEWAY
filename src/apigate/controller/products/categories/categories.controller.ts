import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CategoryI } from '../../../models/category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../models/dto/category.dto';
import { CategoryService } from '../../../service/products/category/category.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
    constructor (private categoryService: CategoryService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-category")
    createCategory(@Body() createdCategoryDto: CreateCategoryDto): Promise<Observable<CategoryI>> {
        return this.categoryService.create(createdCategoryDto);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-category')
    async updateCategory(@Body() updatedCategoryDto: UpdateCategoryDto): Promise<Observable<CategoryI>> {
        return this.categoryService.update(updatedCategoryDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('category/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.categoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('category/:id')
    async deleteCategory(@Param('id') id: number): Promise<any> {
        return this.categoryService.delete(id);
    }
}
