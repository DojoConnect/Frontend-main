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
  async getDojosRevenue(): Promise<DojosRevenueResponse> {
    try {
      const response = await httpBackOfficePost<DojosRevenueResponse>('/backoffice/dashboard/dojos/revenue', {});
      return response;
    } catch (error) {
      console.error('Failed to fetch dojos revenue:', error);
      throw error;
    }
  }
}

export const boDashboardService = new BackOfficeDashboardService();
