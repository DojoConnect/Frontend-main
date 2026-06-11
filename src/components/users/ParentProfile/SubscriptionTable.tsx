import React from "react";
import Pagination from '@/components/users/Pagination';

interface SubscriptionHistory {
  id: string | number;
  invoice: string;
  amount: string;
  date: string;
  status: string;
}

interface SubscriptionHistoryTableProps {
  data: SubscriptionHistory[];
  currentPage?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

export default function SubscriptionHistoryTable({ data, currentPage = 1, rowsPerPage = 20, totalRows = 0, onPageChange, loading = false }: SubscriptionHistoryTableProps) {
  if (loading) {
    return <div className="flex items-center justify-center py-16 bg-white rounded-lg border">Loading...</div>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left text-black font-semibold">Invoice</th>
            <th className="px-4 py-3 text-left text-black font-semibold">Amount</th>
            <th className="px-4 py-3 text-left text-black font-semibold">Date</th>
            <th className="px-4 py-3 text-left text-black font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 text-gray-500">{row.invoice}</td>
              <td className="px-4 py-3 text-gray-500">{row.amount}</td>
              <td className="px-4 py-3 text-gray-500">{row.date}</td>
              <td className="px-4 py-3 flex items-center text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
                {row.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <Pagination
          totalRows={totalRows || data.length}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={(p) => onPageChange && onPageChange(p)}
        />
      </div>
    </div>
  );
}