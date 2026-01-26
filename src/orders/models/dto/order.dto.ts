import { IsArray, IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {

    @IsString()
    OrderDate!: Date;

    @IsNumber()
    TotalAmount!: number;

    @IsString()
    Status!: string;

    @IsNumber()
    isActive!: number;

    @IsString()
    TransactionId?: string;

    @IsString()
    PaymentMethod!: string;

    @IsBoolean()
    IsPaid!: boolean;

    @IsString()
    PaidAt!: Date;
    @IsString()
    ShippingAddress?: string;
    @IsString()
    BillingAddress?: string;

    @IsString()
    Notes!: string;

    @IsString()
    PhoneNumber!: string;

    @IsEmail()
    Email!: string;
    @IsArray()
    Items!: OrderItemDto[];
    @IsNumber()
    UserId!: number;
    @IsString()
    UserName?: string;
    
    @IsOptional()
    @IsNumber()
    DeliveryManId?: number;

}

export class UpdateOrderDto extends CreateOrderDto {
    @IsNumber()
    Id?: number;

    @IsString()
    OrderNumber!: string;
}

export class OrderItemDto {
    Id!: number;
    ProductId!: number;
    Quantity!: number;
    UnitPrice!: number;
    VendorId?: string;
}

// export class CustomerDto {
//     Id!: number;
//     Name!: string;
//     Email!: string;
//     Phone!: string;
//     Address!: string;
// }