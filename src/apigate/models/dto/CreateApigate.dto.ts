import { IsString } from "class-validator";
import { LoginApigateDto } from "./LoginApigate.dto";


export class CreateApigateDto extends LoginApigateDto {

    @IsString()
    name: string | undefined; 
    
}