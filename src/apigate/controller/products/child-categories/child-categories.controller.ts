import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChildCategoryI } from '../../../models/child-category.interface';
import { CreateChildCategoryDto, UpdateChildCategoryDto } from '../../../models/dto/child-category.dto';
import { ChildCategoryService } from '../../../service/products/child-category/child-category.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('child-categories')
export class ChildCategoriesController {

    constructor(private childCategoryService: ChildCategoryService) {}

    @UseGuards(JwtAuthGuard)
    @Post("create-child-category")
    @UseInterceptors(FileInterceptor('file'))
    createChildCategory(@UploadedFile() file: Express.Multer.File, @Body() createdChildCategoryDto: CreateChildCategoryDto): Promise<Observable<ChildCategoryI>> {
        return this.childCategoryService.create(file, createdChildCategoryDto);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllChildCategories() {
        return this.childCategoryService.getAllChildCategories();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-child-category')
    @UseInterceptors(FileInterceptor('file'))
    async updateChildCategory(@UploadedFile() file: Express.Multer.File, @Body() updatedChildCategoryDto: UpdateChildCategoryDto): Promise<Observable<ChildCategoryI>> {
        return this.childCategoryService.update(file, updatedChildCategoryDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('child-category/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.childCategoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('child-category/:id')
    async deleteChildCategory(@Param('id') id: number): Promise<any> {
        return this.childCategoryService.delete(id);
    }
}
