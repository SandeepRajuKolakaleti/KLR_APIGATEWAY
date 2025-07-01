import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from "class-validator";

export class HighlightDto {
  @IsBoolean()
  NewArrival?: boolean;

  @IsBoolean()
  TopProduct?: boolean;

  @IsBoolean()
  BestProduct?: boolean;

  @IsBoolean()
  FeaturedProduct?: boolean;
}
export class SpecificationDto {
  @IsString()
  key?: string;

  @IsString()
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
    Category!: number;
    @IsNumber()
    SubCategory!: number;
    @IsNumber()
    ChildCategory!: number;
    @IsNumber()
    Brand!: number;
    @IsString()
    SKU!: string;
    @IsNumber()
    Price!: number;
    @IsNumber()
    OfferPrice!: number;
    @IsNumber()
    StockQuantity!: number;
    @IsNumber()
    Weight!: number;
    @IsString()
    ShortDescription!: string;
    @IsString()
    LongDescription!: string;
    @ValidateNested()
    @Type(() => HighlightDto)
    Highlight!: HighlightDto;
    @IsString()
    Status!: string;
    @IsString()
    SEOTitle!: string;
    @IsString()
    SEODescription!: string;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SpecificationDto)
    Specifications!: SpecificationDto[];
    @IsString()
    Vendor!: string;
}

export class UpdateProductDto extends CreateProductDto {
    @IsNumber()
    Id?: number;
}