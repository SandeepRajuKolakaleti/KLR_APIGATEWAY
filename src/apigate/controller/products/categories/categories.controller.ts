import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CategoryI } from '../../../models/category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../models/dto/category.dto';
import { CategoryService } from '../../../service/products/category/category.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignedInUserInterceptor } from '../../../service/signed-in-user.interceptor.service';
import { Request } from 'express';
@Controller('categories')
@UseInterceptors(SignedInUserInterceptor)
export class CategoriesController {
    constructor (private categoryService: CategoryService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-category")
    @UseInterceptors(FileInterceptor('file'))
    async createCategory(@UploadedFile() file: Express.Multer.File, @Body() createdCategoryDto: CreateCategoryDto, @Req() request: Request): Promise<Observable<CategoryI>> {
        console.log(request.user);
        return this.categoryService.create(file, createdCategoryDto, request.user);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllCategories(@Req() request: Request,
        @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
        @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,) {
        console.log(request.user);
        return this.categoryService.getAllCategories(request.user, {
            offset: Number(offset),
            limit: Number(limit)
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-category')
    @UseInterceptors(FileInterceptor('file'))
    async updateCategory(@UploadedFile() file: Express.Multer.File, @Body() updatedCategoryDto: UpdateCategoryDto, @Req() request: Request): Promise<Observable<CategoryI>> {
        console.log(request.user);
        return this.categoryService.update(file, updatedCategoryDto, request.user);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('category/:id')
    async info(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.categoryService.findOne(id, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('category/:id')
    async deleteCategory(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.categoryService.delete(id, request.user);
    }
}
