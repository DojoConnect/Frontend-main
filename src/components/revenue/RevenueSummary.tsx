'use client';
import React, { useEffect, useState } from "react";
import { ReadMoreIcon, IconA, IconB, IconC, IconD, IconE, IconF } from './revenueData';
import { FaArrowUp } from "react-icons/fa";
import { boDashboardService } from '../../services/bo-dashboard.service';

// Small green badge used by dashboard metric cards
const GreenBadge = ({ value }: { value: string | number }) => (
  <span className="ml-auto rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
    {value ?? "0%"}
  </span>
);

type RevenueSummaryProps = {
  filter: string;
  customRange?: { start?: string; end?: string };
};

function mapApiToCards(api: any) {
  // Map API fields to your card UI
  return [
    {
      label: 'Total Revenue',
      value: api.totalRevenue ? `£${api.totalRevenue}` : '£0',
      status: api.revenueChange ? `${api.revenueChange}` : (api.revenue_change ? `${api.revenue_change}` : ''),
      icon: <IconE />,
    },
    {
      label: 'Avg. Revenue per Dojo',
      value: api.avgRevenuePerDojo ? `£${api.avgRevenuePerDojo}` : (api.avg_revenue_per_dojo ? `£${api.avg_revenue_per_dojo}` : '£0'),
      status: api.avgRevenueChange ? `${api.avgRevenueChange}` : (api.avg_revenue_change ? `${api.avg_revenue_change}` : ''),
      icon: <IconE />,
    },
    {
      label: 'Gross Transaction Vol.',
      value: api.grossTransactionVolume ? `£${api.grossTransactionVolume}` : (api.gross_transaction_volume ? `£${api.gross_transaction_volume}` : '£0'),
      status: api.grossTransactionChange ? `${api.grossTransactionChange}` : (api.gross_transaction_change ? `${api.gross_transaction_change}` : ''),
      icon: <IconF />,
      chartImg: '/chart.svg',
    },
    {
      label: 'Total Dojo Owners',
      value: api.totalDojoOwners ?? api.total_dojo_owners ?? '0',
      status: api.activeDojoOwners ? `${api.activeDojoOwners} active` : (api.active_dojo_owners ? `${api.active_dojo_owners} active` : ''),
      icon: <IconA />,
    },
    {
      label: 'Active Subscriptions',
      value: api.activeSubscriptions ?? api.active_subscriptions ?? '0',
      status: api.activeSubscriptionsPercent ? `${api.activeSubscriptionsPercent} of total` : (api.active_subscriptions_percent ? `${api.active_subscriptions_percent} of total` : ''),
      icon: <IconB />,
    },
    {
      label: 'Canceled Subscriptions',
      value: api.cancelledSubscriptions ?? api.canceled_subscriptions ?? '0',
      status: api.cancelledSubscriptionsPercent ? `${api.cancelledSubscriptionsPercent} of ${api.totalDojoOwners || api.total_dojo_owners}` : (api.canceled_subscriptions_percent ? `${api.canceled_subscriptions_percent} of ${api.total_dojo_owners}` : ''),
      icon: <IconC />,
    },
  ];
}

export default function RevenueSummary({ filter, customRange }: RevenueSummaryProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dojos, setDojos] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let payload: any = {};
    let period =
      filter === "all"
        ? "all"
        : filter === "today"
        ? "today"
        : filter === "week"
        ? "this_week"
        : filter === "month"
        ? "this_month"
        : "custom";
    payload.period = period;
    if (period === "custom" && customRange?.start && customRange?.end) {
      payload.start_date = customRange.start;
      payload.end_date = customRange.end;
    }
    // Defensive: Remove undefined values
    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });

    // Use backoffice dashboard revenue summary (avoids external metrics CORS issues)
    boDashboardService
      .getRevenueSummary()
      .then((resp) => {
        const data = resp.data || {};
        setStats(mapApiToCards(data));
      })
      .catch((err) => {
        setStats([]);
        setError(err.message || 'Failed to fetch revenue summary');
      })
      .finally(() => setLoading(false));

    // (removed dojos breakdown fetch per UX request)
  }, [filter, customRange]);

  return (
    <div className="bg-[#FFFFFF] p-4 gap-4 rounded-xl" style={{ border: '1px solid #ECE4E4' }}>
      <h1 className="text-base font-semibold mb-4 text-[#475367]">Metrics</h1>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {stats.map(({ label, value, status, icon, chartImg }) => (
            <div key={label} className="bg-gray-50 flex flex-col rounded-lg p-4 h-[130px] shadow-sm relative w-full">
              <div className="flex items-center mb-2">
                <span style={{ border: "1px solid #FCC2C3" }} className="h-8 w-8 rounded-full bg-[#FFE5E5] flex items-center justify-center">
                  {icon}
                </span>
              </div>
              <div className="text-lg text-[#0F1828] font-semibold mb-2">{value ?? 0}</div>
              <div className="flex items-center justify-between mt-auto w-full">
                <span className="text-xs text-gray-600">{label}</span>
                {status ? <GreenBadge value={status} /> : null}
              </div>
              <button
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => setOpenModal(label)}
                aria-label="Open details"
              >
                <ReadMoreIcon />
              </button>
            </div>
          ))}
        </div>

        {/* Dojos revenue breakdown removed */}
    </div>
  );
}