import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { ProductService } from '../../../service/products/product/product.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from '../../../models/dto/create-product.dto';
import { Observable } from 'rxjs';
import { ProductI } from '../../../models/product.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('products')
export class ProductsController {

    constructor(private productService: ProductService) { }

    @Post('create-product')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async createProduct(@UploadedFile() file: Express.Multer.File, @Body() createdProductDto: CreateProductDto,@Req() request: Request): Promise<any> {
        // console.log(file, createdProductDto, request.body);
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
            Highlight: typeof createdProductDto.Highlight === 'string' ? JSON.parse(createdProductDto.Highlight): createdProductDto.Highlight,
            Specifications: typeof createdProductDto.Specifications === 'string'
            ? JSON.parse(createdProductDto.Specifications)
            : createdProductDto.Specifications,
        };
        return this.productService.createProducts(file, parsedDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload/excel')
    async uploadExcel(@UploadedFile() file: any) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        await this.productService.readExcelFile(file);
        return { message: 'File processed successfully!' };
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-product')
    @UseInterceptors(FileInterceptor('file'))
    async updateProduct(@UploadedFile() file: Express.Multer.File, @Body() updatedProductDto: UpdateProductDto, @Req() request: Request): Promise<Observable<ProductI>> {
        // console.log(file, updatedProductDto, request.body);
        return this.productService.updateproduct(file, updatedProductDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('product/:id')
    async info(@Param('id') id: number): Promise<any> {
      return this.productService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('product/:id')
    async delete(@Param('id') id: number): Promise<any> {
      return this.productService.deleteProduct(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadImgToBase64')
    async base64(@Body() img: any) {
        console.log(img);
        return this.productService.getImageUrlToBase64(img);
    }
}
