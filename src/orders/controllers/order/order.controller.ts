import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateOrderDto, UpdateOrderDto } from '../../../orders/models/dto/order.dto';
import { OrderI } from '../../../orders/models/order.interface';
import { OrderService } from '../../../orders/services/order/order.service';
import { SignedInUserInterceptor } from '../../../apigate/service/signed-in-user.interceptor.service';
import { Request } from 'express';

@Controller('orders')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SignedInUserInterceptor)
export class OrderController {
    constructor(private orderService: OrderService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post("create-order")
    async createCategory(@Req() req: Request, @Body() createdOrderDto: CreateOrderDto): Promise<Observable<OrderI>> {
        return this.orderService.create(createdOrderDto, (req.user as any).id);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllOrders(@Req() req: Request, @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
            @Query("limit", new ParseIntPipe({ optional: true })) limit = 10): Promise<Observable<OrderI[]>> {
        return this.orderService.getAll( (req.user as any).id, {
            offset: Number(offset),
            limit: Number(limit)
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-order')
    async updateOrder(@Req() req: Request,@Body() updatedCategoryDto: UpdateOrderDto): Promise<Observable<OrderI>> {
        return this.orderService.update(updatedCategoryDto, (req.user as any).id);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('order/:id')
    async info(@Req() req: Request, @Param('id') id: number): Promise<any> {
        return this.orderService.findOne(id, (req.user as any).id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('vendor/:vendorId')
    getVendorOrders(
        @Req() req: Request,
        @Param('vendorId') vendorId: string,
        @Query('offset') offset?: number,
        @Query('limit') limit?: number
    ) {
        offset = offset ? Number(offset) : undefined;
        limit = limit ? Number(limit) : undefined;
        return this.orderService.getOrdersByVendorId(
            vendorId,
            offset,
            limit,
            (req.user as any).id
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete('order/:id')
    async deleteOrder(@Req() req: Request,@Param('id') id: number): Promise<any> {
        return this.orderService.delete(id, (req.user as any).id);
    }
}
