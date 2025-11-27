import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '../../../models/dto/sub-category.dto';
import { SubCategoryI } from '../../../models/sub-category.interface';
import { SubCategoryService } from '../../../service/products/sub-category/sub-category.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignedInUserInterceptor } from '../../../service/signed-in-user.interceptor.service';
import { Request } from 'express';

@Controller('sub-categories')
@UseInterceptors(SignedInUserInterceptor)
export class SubCategoriesController {
    constructor(private subCategoryService: SubCategoryService) {}
    @UseGuards(JwtAuthGuard)
    @Post("create-subcategory")
    @UseInterceptors(FileInterceptor('file'))
    createSubCategory(@UploadedFile() file: Express.Multer.File, @Body() createdSubCategoryDto: CreateSubCategoryDto, @Req() request: Request): Promise<Observable<SubCategoryI>> {
        console.log(request.user);
        return this.subCategoryService.create(file, createdSubCategoryDto, request.user);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllSubCategories(@Req() request: Request) {
        console.log(request.user);
        return this.subCategoryService.getAllSubCategories(request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-subcategory')
    @UseInterceptors(FileInterceptor('file'))
    async updateSubCategory(@UploadedFile() file: Express.Multer.File, @Body() updatedSubCategoryDto: UpdateSubCategoryDto, @Req() request: Request): Promise<Observable<SubCategoryI>> {
        console.log(request.user);
        return this.subCategoryService.update(file, updatedSubCategoryDto, request.user);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('subCategory/:id')
    async info(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.subCategoryService.findOne(id, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('category/:id')
    async category(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.subCategoryService.findOneByCategory(id, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('subCategory/:id')
    async deleteSubCategory(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.subCategoryService.delete(id, request.user);
    }
}
