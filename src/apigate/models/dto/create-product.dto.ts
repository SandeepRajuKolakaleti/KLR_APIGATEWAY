import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class HighlightDto {
  @IsBoolean()
  @IsOptional()
  NewArrival?: boolean;

  @IsBoolean()
  @IsOptional()
  TopProduct?: boolean;

  @IsBoolean()
  @IsOptional()
  BestProduct?: boolean;

  @IsBoolean()
  @IsOptional()
  FeaturedProduct?: boolean;
}

export class SpecificationDto {
  @IsString()
  @IsOptional()
  key?: string;

  @IsString()
  @IsOptional()
  specification?: string;
}

export class CreateProductDto {
  @IsString()
  Name!: string;

  @IsString()
  ThumnailImage!: string;

  @IsString()
  Slug!: string;

  @IsNumber()
  @Type(() => Number)
  Category!: number;

  @IsNumber()
  @Type(() => Number)
  SubCategory!: number;

  @IsNumber()
  @Type(() => Number)
  ChildCategory!: number;

  @IsNumber()
  @Type(() => Number)
  Brand!: number;

  @IsString()
  SKU!: string;

  @IsNumber()
  @Type(() => Number)
  Price!: number;

  @IsNumber()
  @Type(() => Number)
  OfferPrice!: number;

  @IsNumber()
  @Type(() => Number)
  StockQuantity!: number;

  @IsNumber()
  @Type(() => Number)
  Weight!: number;

  @IsString()
  ShortDescription!: string;

  @IsString()
  LongDescription!: string;

  @IsString()
  Highlight!: HighlightDto | string;

  @IsNumber()
  @Type(() => Number)
  Status!: number;

  @IsString()
  SEOTitle!: string;

  @IsString()
  SEODescription!: string;

  @IsString()
  Specifications!: SpecificationDto[] | string;

  @IsString()
  Vendor!: string;
}

export class UpdateProductDto extends CreateProductDto {
  @IsNumber()
  @Type(() => Number)
  Id?: number;
}