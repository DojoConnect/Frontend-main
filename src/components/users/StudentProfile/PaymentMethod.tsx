import React from "react";

export default function PaymentMethod({ method }: { method: any }) {
  const cardBrand = method?.cardBrand || method?.brand || method?.cardType || '';
  const last4 = method?.cardLast4 || method?.last4 || '';
  const expiry = method?.expiry || (
    method?.expMonth && method?.expYear
      ? `${String(method.expMonth).padStart(2, '0')}/${String(method.expYear).slice(-2)}`
      : ''
  );

  if (!method || (!cardBrand && !last4)) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-gray-800 text-base">Payment method</span>
        </div>
        <div className="bg-white rounded-md border border-gray-200 p-6 text-center text-gray-400 text-sm">
          No payment method found.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-800 text-base">Payment method</span>
      </div>
      <div className="bg-white rounded-md border border-gray-200 p-6 flex items-center gap-4">
        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
          <svg width="28" height="20" fill="none" viewBox="0 0 28 20">
            <rect width="28" height="20" rx="3" fill="#E5E7EB"/>
            <rect y="5" width="28" height="6" fill="#9CA3AF"/>
          </svg>
        </div>
        <div>
          <div className="font-semibold text-black text-sm">{cardBrand}</div>
          {last4 && <div className="text-gray-700 text-sm">**** **** **** {last4}</div>}
          {expiry && <div className="text-xs text-gray-500 mt-0.5">Expires {expiry}</div>}
        </div>
      </div>
    </div>
  );
}
