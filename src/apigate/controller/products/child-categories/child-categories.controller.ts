import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChildCategoryI } from '../../../models/child-category.interface';
import { CreateChildCategoryDto, UpdateChildCategoryDto } from '../../../models/dto/child-category.dto';
import { ChildCategoryService } from '../../../service/products/child-category/child-category.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignedInUserInterceptor } from '../../../service/signed-in-user.interceptor.service';
import { Request } from 'express';

@Controller('child-categories')
@UseInterceptors(SignedInUserInterceptor)
export class ChildCategoriesController {

    constructor(private childCategoryService: ChildCategoryService) {}

    @UseGuards(JwtAuthGuard)
    @Post("create-child-category")
    @UseInterceptors(FileInterceptor('file'))
    createChildCategory(@UploadedFile() file: Express.Multer.File, @Body() createdChildCategoryDto: CreateChildCategoryDto, @Req() request: Request): Promise<Observable<ChildCategoryI>> {
       console.log(request.user);
        return this.childCategoryService.create(file, createdChildCategoryDto, request.user);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllChildCategories(@Req() request: Request) {
        console.log(request.user);
        return this.childCategoryService.getAllChildCategories(request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-child-category')
    @UseInterceptors(FileInterceptor('file'))
    async updateChildCategory(@UploadedFile() file: Express.Multer.File, @Body() updatedChildCategoryDto: UpdateChildCategoryDto, @Req() request: Request): Promise<Observable<ChildCategoryI>> {
        console.log(request.user);
        return this.childCategoryService.update(file, updatedChildCategoryDto, request.user);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('child-category/:id')
    async info(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.childCategoryService.findOne(id, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('child-category/:id')
    async deleteChildCategory(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.childCategoryService.delete(id, request.user);
    }
}
