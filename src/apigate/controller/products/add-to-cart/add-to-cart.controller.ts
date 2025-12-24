import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { AddToCartService } from '../../../service/products/add-to-cart/add-to-cart.service';
import { AddToCartDto, UpdateCartDto } from '../../../models/dto/add-to-cart.dto';
import { SignedInUserInterceptor } from '../../../../apigate/service/signed-in-user.interceptor.service';

@Controller('add-to-cart')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SignedInUserInterceptor)
export class AddToCartController {
    constructor(private readonly cartService: AddToCartService) {}
    @Post()
    addToCart(@Req() req: Request, @Body() dto: AddToCartDto) {
        const userId = (req.user as any).id;
        return this.cartService.addToCart(userId, dto);
    }

    @Get()
    getCart(@Req() req: Request,
    @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,) {
        return this.cartService.getCart((req.user as any).id, {
            offset: Number(offset),
            limit: Number(limit)
        });
    }
    
    @Patch(':id')
    updateQuantity(
        @Req() req: Request,
        @Param('id', ParseIntPipe) cartItemId: number,
        @Body() dto: UpdateCartDto,
    ) {
        return this.cartService.updateQuantity(
        (req.user as any).id,
        cartItemId,
        dto,
        );
    }
    
    @Delete(':id')
    removeItem(
        @Req() req: Request,
        @Param('id', ParseIntPipe) cartItemId: number,
    ) {
        return this.cartService.removeItem((req.user as any).id, cartItemId);
    }
    
    @Delete()
    clearCart(@Req() req: Request) {
        return this.cartService.clearCart((req.user as any).id);
    }
}

