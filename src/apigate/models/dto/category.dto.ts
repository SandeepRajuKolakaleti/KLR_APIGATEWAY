import { IsBoolean, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateCategoryDto {

    @IsString()
    @Type(() => String)
    Name!: string;
    @IsString()
    @Type(() => String)
    ThumnailImage!: string;
    @IsString()
    @Type(() => String)
    Slug!: string;
    @IsString()
    @Type(() => String)
    Status!: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {
    @IsNumber()
    Id?: number;
}