import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginApigateDto {

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    password!: string;

    phonenumber?:Number;

    tokenStr?:string;



}