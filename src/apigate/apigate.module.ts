import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { ApigateService } from './service/apigate.service';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../auth/auth.module';
import { RedisCacheModule } from './../redis/redis.module';
import { ProductsController } from './controller/products/product/product.controller';
import { CategoriesController } from './controller/products/categories/categories.controller';
import { SubCategoriesController } from './controller/products/sub-categories/sub-categories.controller';
import { ChildCategoriesController } from './controller/products/child-categories/child-categories.controller';
import { BrandsController } from './controller/products/brands/brands.controller';
import { ProductService } from './service/products/product/product.service';
import { CategoryService } from './service/products/category/category.service';
import { SubCategoryService } from './service/products/sub-category/sub-category.service';
import { ChildCategoryService } from './service/products/child-category/child-category.service';
import { BrandsService } from './service/products/brands/brands.service';
import { VendorController } from './controller/vendors/vendor.controller';
import { VendorService } from './service/vendor/vendor.service';


@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([]),
    AuthModule,
    RedisCacheModule,
  ],
  providers: [ApigateService,UserService, ProductService, CategoryService,SubCategoryService, ChildCategoryService, BrandsService, VendorService],
  controllers: [UserController, ProductsController, CategoriesController, SubCategoriesController, ChildCategoriesController, BrandsController, VendorController]
})
export class ApigateModule {}
