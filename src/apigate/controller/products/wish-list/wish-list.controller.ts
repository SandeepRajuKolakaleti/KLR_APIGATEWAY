import {
  Controller,
  Post,
  Get,
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
import { WishListService } from '../../../service/products/wish-list/wish-list.service';
import { AddToWishlistDto } from '../../../models/dto/wish-list.dto';
import { SignedInUserInterceptor } from '../../../../apigate/service/signed-in-user.interceptor.service';

@Controller('wish-list')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SignedInUserInterceptor)
export class WishListController {
    constructor(private readonly wishListService: WishListService) {}
    @Post()
    addToWishlist(@Req() req: Request, @Body() addToWishlistDto: AddToWishlistDto) {
        const userId = (req.user as any).id;
        return this.wishListService.add(userId, addToWishlistDto);
    }

    @Get()
    getWishlist(@Req() req: Request,
        @Query("offset", new ParseIntPipe({ optional: true })) offset = 0,
        @Query("limit", new ParseIntPipe({ optional: true })) limit = 10,) {
        return this.wishListService.getAll((req.user as any).id, {
            offset: Number(offset),
            limit: Number(limit)
        });
    }

    @Delete(':id')
    removeFromWishlist(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.wishListService.remove((req.user as any).id, id);
    }
    
    @Delete()
    clearWishlist(@Req() req: Request) {
        return this.wishListService.clear((req.user as any).id);
    }

}
