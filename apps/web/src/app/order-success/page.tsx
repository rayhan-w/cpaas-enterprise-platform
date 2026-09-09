import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Truck, ShoppingBag, Clock, Phone, AlertCircle } from 'lucide-react';
import { dbService } from '@/lib/db-service';
import { formatPrice, formatDate } from '@/lib/formatters';

interface OrderSuccessProps {
  searchParams: Promise<{ orderNumber?: string; phone?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessProps) {
  const { orderNumber, phone } = await searchParams;

  let order = null;
  if (orderNumber && phone) {
    order = await dbService.getOrderByNumberAndPhone(orderNumber, phone);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      {/* Success Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EDE5E1] shadow-elevation-2 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#EAF3E9] text-[#7A9C78] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#7A9C78] block mb-1">
            Order Confirmed
          </span>
          <h1 className="section-title text-3xl sm:text-4xl text-[#1A1512]">
            Thank You for Shopping with Jawata Mart!
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B58] mt-2 max-w-md mx-auto leading-relaxed">
            We have received your order. A delivery confirmation SMS and invoice details will be dispatched to your phone.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="bg-[#F8F7F5] rounded-2xl p-6 border border-[#EDE5E1] max-w-md mx-auto text-left space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#9B8A86]">Order Reference:</span>
            <span className="font-mono font-bold text-sm text-[#1A1512]">
              {orderNumber || 'NUR-8291'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#9B8A86]">Customer Phone:</span>
            <span className="font-semibold text-[#1A1512]">{phone || '017XXXXXXXX'}</span>
          </div>

          {order && (
            <>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9B8A86]">Total Amount:</span>
                <span className="font-bold text-[#0D5435]">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9B8A86]">Payment Method:</span>
                <span className="font-semibold text-[#1A1512]">{order.paymentMethod}</span>
              </div>
            </>
          )}

          {/* Payment Status Alert */}
          <div className="pt-2 border-t border-[#EDE5E1]">
            {order?.paymentMethod === 'BKASH' || order?.paymentMethod === 'NAGAD' ? (
              <div className="flex items-start gap-2 text-xs bg-[#FFF8F0] p-3 rounded-xl border border-[#F4821F]/20 text-[#7D3800]">
                <Clock className="w-4 h-4 text-[#F4821F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Payment Status: Pending Verification</p>
                  <p className="text-[11px] text-[#7D3800]/80 mt-0.5">
                    Our accounts department is verifying your Transaction ID. Once verified, your order status will update to Confirmed automatically.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs bg-[#EAF3E9] p-3 rounded-xl border border-[#7A9C78]/20 text-[#2B7A47]">
                <CheckCircle2 className="w-4 h-4 text-[#7A9C78] shrink-0" />
                <span>Payment Status: Confirmed & Accepted</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {orderNumber && phone ? (
            <Link
              href={`/track-order?orderId=${orderNumber}&phone=${phone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1512] hover:bg-[#2B2424] text-white font-bold text-xs py-3.5 px-6 rounded-full transition-all shadow-md active:scale-95"
            >
              <Truck className="w-4 h-4 text-[#0D5435]" />
              <span>Track Live Delivery Status</span>
            </Link>
          ) : (
            <Link
              href="/track-order"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1512] hover:bg-[#2B2424] text-white font-bold text-xs py-3.5 px-6 rounded-full transition-all shadow-md active:scale-95"
            >
              <Truck className="w-4 h-4 text-[#0D5435]" />
              <span>Go to Order Tracker</span>
            </Link>
          )}

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#E7F2EC] text-[#1A1512] border border-[#EDE5E1] hover:border-[#0D5435] font-semibold text-xs py-3.5 px-6 rounded-full transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#0D5435]" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Hotline Support Footer */}
        <p className="text-xs text-[#9B8A86] pt-4">
          Need immediate assistance with your order? Call our hotline:{' '}
          <a href="tel:01700000000" className="text-[#0D5435] font-semibold hover:underline">
            01700-000000
          </a>
        </p>
      </div>
    </div>
  );
}
