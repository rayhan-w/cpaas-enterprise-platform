import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber()
  @Min(100, { message: 'Minimum recharge amount is INR ₹100' })
  amountInr: number;

  @IsOptional()
  @IsString()
  gateway?: string; // RAZORPAY or PHONEPE
}
