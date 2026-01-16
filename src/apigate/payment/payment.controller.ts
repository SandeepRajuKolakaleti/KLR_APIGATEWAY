import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { PaymentService } from '../service/payment/payment.service';
import { SignedInUserInterceptor } from '../service/signed-in-user.interceptor.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { PaymentGateway } from '../models/payment-gateway.enum';

@Controller('payment')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SignedInUserInterceptor)
export class PaymentController {
    constructor(private paymentService: PaymentService) {}
    @Post('create-order')
    createOrder(@Req() req: Request,@Body() body: { gateway: PaymentGateway; amount: number }) {
        return this.paymentService.createOrder(body.gateway, body.amount, (req.user as any).id);
    }

    @Post('verify')
    verifyPayment(@Body() body: { gateway: PaymentGateway; amount: number }, @Req() req: Request) {
        const isValid = this.paymentService.verifyPayment(body.gateway, body, (req.user as any).id);

        if (!isValid) {
        return { success: false, message: 'Invalid signature' };
        }

        // 👉 Save order to DB here
        return { success: true };
    }
}
