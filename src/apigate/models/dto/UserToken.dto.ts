import { IsEmail, IsNotEmpty } from "class-validator";

export class UserTokenDto {

    @IsEmail()
    email: any;

    @IsNotEmpty()
    localtoken: any;

    @IsNotEmpty()
    apigatetoken: any;
}