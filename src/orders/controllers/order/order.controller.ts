import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateOrderDto, UpdateOrderDto } from '../../../orders/models/dto/order.dto';
import { OrderI } from '../../../orders/models/order.interface';
import { OrderService } from '../../../orders/services/order/order.service';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post("create-order")
    async createCategory(@Body() createdOrderDto: CreateOrderDto): Promise<Observable<OrderI>> {
        return this.orderService.create(createdOrderDto);
        // test app constants - AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get("getAll")
    async getAllOrders() {
        return this.orderService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-order')
    async updateOrder(@Body() updatedCategoryDto: UpdateOrderDto): Promise<Observable<OrderI>> {
        return this.orderService.update(updatedCategoryDto);
        // AppConstants.app.xyz
    }

    @UseGuards(JwtAuthGuard)
    @Get('order/:id')
    async info(@Param('id') id: number): Promise<any> {
        return this.orderService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('order/:id')
    async deleteOrder(@Param('id') id: number): Promise<any> {
        return this.orderService.delete(id);
    }
}
