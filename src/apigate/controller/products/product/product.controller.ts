import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Req, Query, ParseIntPipe } from '@nestjs/common';
import { ProductService } from '../../../service/products/product/product.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from '../../../models/dto/create-product.dto';
import { Observable } from 'rxjs';
import { ProductI } from '../../../models/product.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { UserService } from 'src/apigate/service/user.service';
import { SignedInUserInterceptor } from '../../../service/signed-in-user.interceptor.service';

@Controller('products')
@UseInterceptors(SignedInUserInterceptor)
export class ProductsController {

    constructor(private productService: ProductService, private userService: UserService) { }

    @Post('create-product')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async createProduct(@UploadedFile() file: Express.Multer.File, @Body() createdProductDto: CreateProductDto, @Req() request: Request): Promise<any> {
        // console.log(file, createdProductDto, request.user);
        const parsedDto: CreateProductDto = {
            ...createdProductDto,
            Category: Number(createdProductDto.Category),
            SubCategory: Number(createdProductDto.SubCategory),
            ChildCategory: Number(createdProductDto.ChildCategory),
            Brand: Number(createdProductDto.Brand),
            Price: Number(createdProductDto.Price),
            OfferPrice: Number(createdProductDto.OfferPrice),
            StockQuantity: Number(createdProductDto.StockQuantity),
            Weight: Number(createdProductDto.Weight),
            Highlight: createdProductDto.Highlight,
            Specifications: createdProductDto.Specifications,
        };
        return this.productService.createProducts(file, parsedDto, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload/excel')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExcel(@UploadedFile() file: Express.Multer.File, @Req() request: Request): Promise<any> {
        console.log(file);
        if (!file) {
            throw new Error('No file uploaded');
        }
        await this.productService.readExcelFile(file, request.user);
        return { message: 'File processed successfully!' };
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllProducts(@Req() request: Request, 
        @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
        @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,) {
        console.log(request.user);
        return this.productService.getAllProducts(request.user, {
            offset: Number(offset),
            limit: Number(limit)
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-product')
    @UseInterceptors(FileInterceptor('file'))
    async updateProduct(@UploadedFile() file: Express.Multer.File, @Body() updatedProductDto: UpdateProductDto, @Req() request: Request): Promise<Observable<ProductI>> {
        console.log(file, updatedProductDto, request.user);
        return this.productService.updateproduct(file, updatedProductDto, request.user);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('product/:id')
    async info(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.productService.findOne(id, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('product/:id')
    async delete(@Param('id') id: number, @Req() request: Request): Promise<any> {
        console.log(request.user);
        return this.productService.deleteProduct(id, request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadImgToBase64')
    async base64(@Body() img: any, @Req() request: Request): Promise<any> {
        console.log(img);
        return this.productService.getImageUrlToBase64(img, request.user);
    }
}
