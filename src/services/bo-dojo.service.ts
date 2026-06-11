import { httpBackOfficeGet } from './http';
import { resolveImageUrl } from '@/lib/imageUrl';

// Pagination params
interface PaginationParams {
  page?: number;
  limit?: number;
}

// Dojo Profile Response
interface DojoProfile {
  id: string;
  name: string;
  tagline: string;
  tag: string;
  streetAddress: string;
  city: string;
  status: 'active' | 'inactive';
  stripeOnboardingComplete: boolean;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerStatus: 'active' | 'inactive';
  ownerId: string;
  ownerCreatedAt: string;
  subscriptionBillingStatus: string;
  subscriptionStripeStatus: string;
}

interface DojoProfileResponse {
  data: DojoProfile;
}

// Dojo Stats Response
interface DojoStats {
  instructorCount: number;
  activeStudentCount: number;
  activeClassCount: number;
  avgAttendanceRate: number;
}

interface DojoStatsResponse {
  data: DojoStats;
}

// Instructor in Dojo
interface DojoInstructor {
  instructorId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive';
  gender: string;
  dob: string;
  lastActivityAt: string;
  assignedAt: string;
}

interface InstructorsListResponse {
  data: DojoInstructor[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Class in Dojo
interface DojoClass {
  id: string;
  name: string;
  level: string;
  status: 'active' | 'inactive';
  capacity: number;
  description: string;
  subscriptionType: string;
  price: string;
  frequency: string;
  streetAddress: string;
  city: string;
  enrolledStudents: number;
  instructorName?: string;
  createdAt: string;
}

interface ClassesListResponse {
  data: DojoClass[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Parent in Dojo
interface DojoParent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive';
  parentId: string;
  childrenCount: number;
  createdAt: string;
}

interface ParentsListResponse {
  data: DojoParent[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Student in Dojo
interface DojoStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive';
  dob: string;
  studentId: string;
  experienceLevel: string;
  parentName: string;
  parentEmail: string;
  createdAt: string;
}

interface StudentsListResponse {
  data: DojoStudent[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Schedule Entry
interface ScheduleEntry {
  classId: string;
  className: string;
  classLevel: string;
  classStatus: 'active' | 'inactive';
  scheduleId: string;
  weekday: string;
  startTime: string;
  endTime: string;
  initialClassDate: string;
  frequency: string;
  streetAddress: string;
  city: string;
}

interface ScheduleResponse {
  data: ScheduleEntry[];
}

// Subscription info
interface SubscriptionInfo {
  id: string;
  dojoId: string;
  stripeSubscriptionId: string;
  billingStatus: string;
  stripeSubStatus: string;
  plan: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface PaymentCard {
  cardBrand: string;
  cardLast4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface SubscriptionResponse {
  data: {
    subscription: SubscriptionInfo;
    card: PaymentCard;
  };
}

// Billing History Entry
interface BillingHistoryEntry {
  id: string;
  amount: string;
  currency: string;
  status: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
}

interface BillingHistoryResponse {
  data: BillingHistoryEntry[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// Activity Entry
interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  details?: Record<string, any>;
}

interface ActivitiesListResponse {
  data: Activity[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

class BackOfficeDojoService {
  /**
   * Get dojo profile details
   * GET /backoffice/dojos/:dojoId
   */
  async getDojoProfile(dojoId: string): Promise<DojoProfile> {
    // Try a sequence of possible endpoints / host variants to be tolerant of deployment differences
    const hostCandidate = process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api';
    const hostNoApi = hostCandidate.replace(/\/api\/?$/, '');

    const attempts = [
      `/backoffice/dojos/${dojoId}`,
      `/dojos/${dojoId}`,
      `${hostNoApi}/backoffice/dojos/${dojoId}`,
      `${hostNoApi}/dojos/${dojoId}`,
      `https://apis.dojoconnect.app/backoffice/dojos/${dojoId}`,
      `https://apis.dojoconnect.app/dojos/${dojoId}`,
    ];

    for (const path of attempts) {
      try {
        const resp = await httpBackOfficeGet<DojoProfileResponse>(path as any);
        if (resp && resp.data) return resp.data;
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // try next candidate
          continue;
        }
        // For other errors, log and continue to allow best-effort
        console.debug(`Dojo fetch attempt failed for ${path}:`, err?.message || err);
        continue;
      }
    }

    // If none succeeded, return null so callers can handle gracefully
    console.debug(`Dojo ${dojoId} not found on any tried endpoints.`);
    return null as any;
  }

  /**
   * Get dojo statistics
   * GET /backoffice/dojos/:dojoId/stats
   */
  async getDojoStats(dojoId: string): Promise<DojoStats> {
    try {
      const response = await httpBackOfficeGet<DojoStatsResponse>(
        `/backoffice/dojos/${dojoId}/stats`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch stats for dojo ${dojoId}:`, error);
      throw error;
    }
  }

  /**
   * Get dojo instructors (paginated)
   * GET /backoffice/dojos/:dojoId/instructors
   */
  async getDojoInstructors(
    dojoId: string,
    params?: PaginationParams
  ): Promise<InstructorsListResponse> {
    try {
      const response = await httpBackOfficeGet<InstructorsListResponse>(
        `/backoffice/dojos/${dojoId}/instructors`,
        params
      );
      if (response && response.data && Array.isArray(response.data)) {
        const mapped = response.data.map((i: any) => ({ ...i, avatarUrl: i.avatarUrl || i.avatar || resolveImageUrl(i) || null }));
        return { ...response, data: mapped };
      }
      return response;
    } catch (error) {
      console.error(`Failed to fetch instructors for dojo ${dojoId}:`, error);
      throw error;
    }
  }

  /**
   * Export dojo instructors as CSV
   * GET /backoffice/dojos/:dojoId/instructors/export
   */
  async exportDojoInstructors(dojoId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api'}/backoffice/dojos/${dojoId}/instructors/export`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(
        `Failed to export instructors for dojo ${dojoId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get dojo classes (paginated)
   * GET /backoffice/dojos/:dojoId/classes
   */
  async getDojoClasses(
    dojoId: string,
    params?: PaginationParams
  ): Promise<ClassesListResponse> {
    try {
      const response = await httpBackOfficeGet<ClassesListResponse>(
        `/backoffice/dojos/${dojoId}/classes`,
        params
      );
      if (response && response.data && Array.isArray(response.data)) {
        const mapped = response.data.map((c: any) => ({ ...c, imageUrl: c.imageUrl || c.image || resolveImageUrl(c) || null }));
        return { ...response, data: mapped };
      }
      return response;
    } catch (error) {
      console.error(`Failed to fetch classes for dojo ${dojoId}:`, error);
      throw error;
    }
  }

  /**
   * Get dojo parents (paginated)
   * GET /backoffice/dojos/:dojoId/parents
   */
  async getDojoParents(
    dojoId: string,
    params?: PaginationParams
  ): Promise<ParentsListResponse> {
    try {
      const response = await httpBackOfficeGet<ParentsListResponse>(
        `/backoffice/dojos/${dojoId}/parents`,
        params
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch parents for dojo ${dojoId}:`, error);
      throw error;
    }
  }

  /**
   * Get dojo students (paginated)
   * GET /backoffice/dojos/:dojoId/students
   */
  async getDojoStudents(
    dojoId: string,
    params?: PaginationParams
  ): Promise<StudentsListResponse> {
    try {
      const response = await httpBackOfficeGet<StudentsListResponse>(
        `/backoffice/dojos/${dojoId}/students`,
        params
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch students for dojo ${dojoId}:`, error);
      throw error;
    }
  }

  /**
   * Get dojo class schedule
   * GET /backoffice/dojos/:dojoId/schedule
   */
  async getDojoSchedule(dojoId: string): Promise<ScheduleEntry[]> {
    try {
      const response = await httpBackOfficeGet<ScheduleResponse>(
        `/backoffice/dojos/${dojoId}/schedule`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch schedule for dojo ${dojoId}:`, error);
      throw error;
    }
  }

  /**
   * Get dojo subscription info
   * GET /backoffice/dojos/:dojoId/subscription
   */
  async getDojoSubscription(
    dojoId: string
  ): Promise<{ subscription: SubscriptionInfo; card: PaymentCard }> {
    try {
      const response = await httpBackOfficeGet<SubscriptionResponse>(
        `/backoffice/dojos/${dojoId}/subscription`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch subscription for dojo ${dojoId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get dojo billing history (paginated)
   * GET /backoffice/dojos/:dojoId/billing-history
   */
  async getDojoBillingHistory(
    dojoId: string,
    params?: PaginationParams
  ): Promise<BillingHistoryResponse> {
    try {
      const response = await httpBackOfficeGet<BillingHistoryResponse>(
        `/backoffice/dojos/${dojoId}/billing-history`,
        params
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to fetch billing history for dojo ${dojoId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get dojo activities (paginated)
   * GET /backoffice/dojos/:dojoId/activities
   */
  async getDojoActivities(
    dojoId: string,
    params?: PaginationParams
  ): Promise<ActivitiesListResponse> {
    try {
      const response = await httpBackOfficeGet<ActivitiesListResponse>(
        `/backoffice/dojos/${dojoId}/activities`,
        params
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch activities for dojo ${dojoId}:`, error);
      throw error;
    }
  }
}

export const boDojoService = new BackOfficeDojoService();
