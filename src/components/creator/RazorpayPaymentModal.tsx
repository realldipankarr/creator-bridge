import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  AlertTriangle,
  Lock,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import type { CreatorProfile, RazorpayOrderResponse } from '../../types.ts';
import { createPaymentOrder, verifyPayment } from '../../lib/api.ts';

interface RazorpayPaymentModalProps {
  profile: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (updatedProfile: CreatorProfile) => void;
}

export const RazorpayPaymentModal: React.FC<RazorpayPaymentModalProps> = ({
  profile,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [order, setOrder] = useState<RazorpayOrderResponse | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [guardError, setGuardError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('creator@oksbi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');

  useEffect(() => {
    if (isOpen) {
      initiateOrder();
    } else {
      setOrder(null);
      setGuardError(null);
      setStep('checkout');
      setIsProcessing(false);
    }
  }, [isOpen, profile.id]);

  const initiateOrder = async () => {
    setLoadingOrder(true);
    setGuardError(null);
    try {
      // Calls server route POST /api/payment/create-order
      // Backend validates applicationStatus === 'Approved'
      const orderData = await createPaymentOrder(profile.userId, profile.id);
      setOrder(orderData);
    } catch (err: any) {
      setGuardError(err.message || 'Server-side payment guard rejected order creation.');
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!order) return;
    setIsProcessing(true);
    setStep('processing');

    try {
      // Simulate realistic payment gateway processing latency
      await new Promise((res) => setTimeout(res, 1200));

      const fakePaymentId = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase();

      // Call server verification endpoint POST /api/payment/verify
      const result = await verifyPayment(profile.userId, fakePaymentId, order.orderId);

      setStep('success');
      await new Promise((res) => setTimeout(res, 900));
      onPaymentSuccess(result.profile);
    } catch (err: any) {
      setGuardError(err.message || 'Payment verification failed on server.');
      setStep('checkout');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="payment-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
      onClick={() => {
        if (!isProcessing) onClose();
      }}
    >
      <div
        id="razorpay-checkout-modal"
        className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] px-5 py-4 flex items-center justify-between border-b border-blue-900/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs tracking-wider">
              RZP
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                Razorpay Trusted Checkout
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              </p>
              <p className="text-[11px] text-blue-200/70">Creator Bridge Technologies</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              id="btn-close-payment-modal"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Close payment checkout"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Loading order state */}
        {loadingOrder && (
          <div className="p-8 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-300 font-medium">
              Verifying Approval & Generating Secure Order...
            </p>
            <p className="text-xs text-slate-500">Communicating with /api/payment/create-order</p>
          </div>
        )}

        {/* Guard Error State (When Server Blocked the order) */}
        {!loadingOrder && guardError && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-red-200">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Server Payment Guard Blocked Order</span>
              </div>
              <p className="text-xs leading-relaxed">{guardError}</p>
            </div>

            <p className="text-xs text-slate-400 text-center">
              The backend verified that this application is not in 'Approved' state. Payment activation is inaccessible.
            </p>

            <button
              id="btn-dismiss-guard-error"
              onClick={onClose}
              className="w-full py-3 min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center justify-center"
            >
              Close Window
            </button>
          </div>
        )}

        {/* Normal Order Checkout Flow */}
        {!loadingOrder && !guardError && order && (
          <div className="overflow-y-auto flex-1">
            {step === 'processing' && (
              <div className="p-10 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
                <h3 className="text-base font-bold text-slate-100">
                  Processing Razorpay Payment
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Authorizing transaction of ₹49.00 and recording server confirmation for {profile.fullName}...
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-emerald-400">
                  Payment Verified!
                </h3>
                <p className="text-xs text-slate-300">
                  Creator Account Activated. Loading your Dashboard...
                </p>
              </div>
            )}

            {step === 'checkout' && (
              <div className="p-5 space-y-5">
                {/* Order Details Header */}
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                      Platform Activation Fee
                    </span>
                    <p className="text-sm font-bold text-slate-100 mt-0.5">
                      One-Time Profile Verification
                    </p>
                    <p className="text-[11px] text-slate-400">Order ID: {order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-50">₹49.00</span>
                    <span className="block text-[10px] text-slate-400">Incl. GST</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Select Payment Mode</p>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'upi'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-medium">UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs font-medium">Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'netbanking'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span className="text-xs font-medium">Net Banking</span>
                    </button>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="pt-2">
                      <label className="block text-[11px] text-slate-400 mb-1">
                        UPI VPA / ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="pt-2 space-y-2 text-xs">
                      <input
                        type="text"
                        disabled
                        value="•••• •••• •••• 4242 (Test Card)"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          disabled
                          value="12 / 28"
                          className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                        />
                        <input
                          type="text"
                          disabled
                          value="CVV •••"
                          className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="pt-2">
                      <select
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs"
                      >
                        <option>HDFC Bank (Net Banking)</option>
                        <option>State Bank of India</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2 space-y-2">
                  <button
                    id="btn-complete-razorpay-test"
                    onClick={handleSimulatePayment}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    <span>Pay ₹49.00 (Complete Verification)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>256-Bit SSL End-to-End Encrypted via Razorpay</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
