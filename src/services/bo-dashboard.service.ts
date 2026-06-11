import { httpBackOfficeGet, httpBackOfficePost } from './http';

export interface DojoRevenueBreakdown {
  dojoId: string;
  dojoName: string;
  revenue: string;
  percentage: number;
}

export interface DashboardStats {
  activeDojos: number;
  activeClasses: number;
  activeSubscriptions: number;
  totalRevenue: string;
  grossTransactionVolume: string;
  completedOnboarding: number;
  incompleteOnboarding: number;
  avgRevenuePerDojo: string;
  dojoEngagementIndex: string;
  totalUsers: number;
  dojoRevenueBreakdown: DojoRevenueBreakdown[];
}

export interface DashboardStatsResponse {
  data: DashboardStats;
}

export interface DojoRevenue {
  dojoId: string;
  dojoName: string;
  revenue: string;
  percentage: number;
}

export interface DojosRevenueResponse {
  data: DojoRevenue[];
}

class BackOfficeDashboardService {
  /**
   * Get dashboard statistics including active dojos, classes, subscriptions, and revenue metrics
   * @returns Dashboard statistics and metrics
   */
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    try {
      const response = await httpBackOfficeGet<DashboardStatsResponse>('/backoffice/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get dojos revenue breakdown for dashboard
   * @returns List of dojos with their revenue and percentage
   */
  async getDojosRevenue(payload: any = {}): Promise<DojosRevenueResponse> {
    try {
      // Some backends accept POST with payload, others expect GET — try POST first, then fallback to GET
      try {
        const response = await httpBackOfficePost<DojosRevenueResponse>('/backoffice/dashboard/dojos/revenue', payload);
        return response;
      } catch (postErr) {
        console.warn('POST /backoffice/dashboard/dojos/revenue failed, trying GET fallback', postErr);
        // Try GET fallback with query params
        const params = payload || {};
        const getResp = await httpBackOfficeGet<DojosRevenueResponse>('/backoffice/dashboard/dojos/revenue', params);
        return getResp;
      }
    } catch (error) {
      console.error('Failed to fetch dojos revenue:', error);
      throw error;
    }
  }

  /**
   * Get overall revenue summary
   */
  async getRevenueSummary(): Promise<{ data: any }> {
    try {
      const response = await httpBackOfficeGet<{ data: any }>('/backoffice/revenue');
      return response;
    } catch (error) {
      console.error('Failed to fetch revenue summary:', error);
      throw error;
    }
  }

  /**
   * Get payment history (paginated)
   */
  async getPaymentHistory(page = 1, limit = 20): Promise<{ data: any[]; meta?: any }> {
    try {
      const resp = await httpBackOfficeGet<{ data: any[]; meta?: any }>(`/backoffice/revenue/payment-history`, { page, limit });
      return resp;
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      throw error;
    }
  }

  /**
   * Export payment history as CSV (returns Blob)
   */
  async exportPaymentHistory(): Promise<Blob> {
    try {
      const response = await fetch(`https://apis.dojoconnect.app/api/backoffice/revenue/payment-history/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
        },
      });
      if (!response.ok) throw new Error('Failed to export payment history');
      return await response.blob();
    } catch (error) {
      console.error('Failed to export payment history:', error);
      throw error;
    }
  }
}

export const boDashboardService = new BackOfficeDashboardService();
