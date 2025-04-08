import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { ProductService } from '../../../service/products/product/product.service';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from '../../../models/dto/create-product.dto';
import { Observable } from 'rxjs';
import { ProductI } from '../../../models/product.interface';

@Controller('products')
export class ProductsController {

    constructor(private productService: ProductService) { }

    @UseGuards(JwtAuthGuard)
    @Post("create-product")
    createProduct(@Body() createdProductDto: CreateProductDto): Promise<Observable<ProductI>> {
        return this.productService.createProducts(createdProductDto);
        // test app constants - AppConstants.app.xyz
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
    async updateProduct(@Body() updatedProductDto: UpdateProductDto): Promise<Observable<ProductI>> {
        return this.productService.updateproduct(updatedProductDto);
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
}
