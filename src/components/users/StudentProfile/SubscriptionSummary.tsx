import React from "react";

export default function SubscriptionSummary({ summary }: { summary: any }) {
  if (!summary) return null;

  const status = summary.status || '';
  const periodEnd = summary.currentPeriodEnd || summary.current_period_end || null;
  const periodStart = summary.currentPeriodStart || summary.current_period_start || null;
  const now = Date.now();
  const endMs = periodEnd ? new Date(periodEnd).getTime() : 0;
  const startMs = periodStart ? new Date(periodStart).getTime() : 0;
  const progressPercent = startMs && endMs && endMs > startMs
    ? Math.min(100, Math.round(((now - startMs) / (endMs - startMs)) * 100))
    : 0;

  const nextPaymentDate = periodEnd
    ? new Date(periodEnd).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const planName = summary.subscriptionType || summary.className || summary.planName || '';
  const planCost = summary.classPrice ? `$${summary.classPrice}` : (summary.planCost || '');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-800 text-base">Current plan summary</span>
      </div>
      <div className="bg-white rounded-md border border-gray-200 p-6">
        {(planName || planCost) && (
          <div className="flex flex-wrap gap-6 mb-5">
            {planName && (
              <div>
                <div className="text-gray-500 text-xs">Plan Name</div>
                <div className="text-black text-base font-bold">{planName}</div>
              </div>
            )}
            {planCost && (
              <div>
                <div className="text-gray-500 text-xs">Plan Cost</div>
                <div className="text-black text-base font-bold">{planCost}</div>
              </div>
            )}
          </div>
        )}
        {status && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              status === 'active' ? 'bg-green-100 text-green-700'
              : status === 'cancelled' || status === 'canceled' ? 'bg-red-100 text-red-600'
              : 'bg-yellow-100 text-yellow-700'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        )}
        {nextPaymentDate && (
          <div className="text-gray-700 text-sm mb-4">
            Next renewal on <span className="font-semibold">{nextPaymentDate}</span>
          </div>
        )}
        {progressPercent > 0 && (
          <div className="w-full">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-2 bg-blue-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">{progressPercent}% of billing cycle used</div>
          </div>
        )}
      </div>
    </div>
  );
}
