import { IsNumber, IsOptional, IsString } from "class-validator";
import { LoginApigateDto } from "./LoginApigate.dto";
import { Type } from "class-transformer";


export class CreateApigateDto extends LoginApigateDto {

    @IsString()
    name!: string;

    @IsString()
    userRole!: string;

    @IsOptional()
    @IsString()
    image?: string;
    	
	@IsString()
    @IsOptional()
    address?:string;
	
	@IsString()
    @IsOptional()
    birthday?:string;
    
}

export class UpdateUserDto extends CreateApigateDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    Id?: number;
}