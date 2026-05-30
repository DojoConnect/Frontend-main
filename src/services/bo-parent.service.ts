import { httpBackOfficeGet, httpBackOfficePost } from './http';

export interface ParentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'parent';
  status: 'active' | 'inactive' | 'suspended';
  gender?: string;
  dob?: string;
  city?: string;
  street?: string;
  createdAt: string;
  lastActivityAt?: string;
  parentId: string;
}

export interface ParentProfileResponse {
  data: ParentProfile;
}

export interface ParentChild {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  studentId: string;
  experienceLevel?: string;
  enrolledAt: string;
}

export interface ParentChildrenResponse {
  data: ParentChild[];
}

export interface ParentClass {
  enrollmentId: string;
  enrolledAt: string;
  enrollmentActive: number;
  classId: string;
  className: string;
  classLevel: string;
  classStatus: string;
  classPrice: string;
  subscriptionType: string;
  frequency: string;
  streetAddress: string;
  city: string;
}

export interface ParentClassesResponse {
  data: ParentClass[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface PaymentCard {
  id: string;
  userId: string;
  cardBrand: string;
  cardLast4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface SubscriptionResponse {
  data: {
    card: PaymentCard;
  };
}

export interface BillingHistoryEntry {
  id: string;
  referenceId: string;
  classId: string;
  className: string;
  studentName: string;
  amount: string;
  type: 'one_time' | 'recurring';
  status: 'successful' | 'failed' | 'pending';
  cardBrand: string;
  cardLast4: string;
  paidAt: string;
  createdAt: string;
}

export interface BillingHistoryResponse {
  data: BillingHistoryEntry[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  message: string;
  metaData?: Record<string, any>;
  createdAt: string;
}

export interface ActivitiesResponse {
  data: Activity[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

class BackOfficeParentService {
  /**
   * Get parent profile by user ID
   * @param userId The parent user ID
   * @returns Parent profile information
   */
  async getParentProfile(userId: string): Promise<ParentProfileResponse> {
    try {
      const response = await httpBackOfficeGet<ParentProfileResponse>(`/backoffice/parents/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch parent profile:', error);
      throw error;
    }
  }

  /**
   * Get children of a parent
   * @param userId The parent user ID
   * @returns List of children
   */
  async getParentChildren(userId: string): Promise<ParentChildrenResponse> {
    try {
      const response = await httpBackOfficeGet<ParentChildrenResponse>(`/backoffice/parents/${userId}/children`);
      return response;
    } catch (error) {
      console.error('Failed to fetch parent children:', error);
      throw error;
    }
  }

  /**
   * Export parent's children to CSV
   * @param userId The parent user ID
   * @returns CSV file blob
   */
  async exportParentChildren(userId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `https://apis.dojoconnect.app/api/backoffice/parents/${userId}/children/export`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to export children');
      return await response.blob();
    } catch (error) {
      console.error('Failed to export parent children:', error);
      throw error;
    }
  }

  /**
   * Get classes enrolled by parent's children
   * @param userId The parent user ID
   * @param params Pagination parameters
   * @returns Paginated list of classes
   */
  async getParentClasses(userId: string, params?: PaginationParams): Promise<ParentClassesResponse> {
    try {
      const response = await httpBackOfficeGet<ParentClassesResponse>(`/backoffice/parents/${userId}/classes`, {
        page: params?.page || 1,
        limit: params?.limit || 20,
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch parent classes:', error);
      throw error;
    }
  }

  /**
   * Export parent's classes to CSV
   * @param userId The parent user ID
   * @returns CSV file blob
   */
  async exportParentClasses(userId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `https://apis.dojoconnect.app/api/backoffice/parents/${userId}/classes/export`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to export classes');
      return await response.blob();
    } catch (error) {
      console.error('Failed to export parent classes:', error);
      throw error;
    }
  }

  /**
   * Get parent's subscription and payment card information
   * @param userId The parent user ID
   * @returns Subscription details with payment card
   */
  async getParentSubscription(userId: string): Promise<SubscriptionResponse> {
    try {
      const response = await httpBackOfficePost<SubscriptionResponse>(`/backoffice/parents/${userId}/subscription`, {});
      return response;
    } catch (error) {
      console.error('Failed to fetch parent subscription:', error);
      throw error;
    }
  }

  /**
   * Get billing history for parent
   * @param userId The parent user ID
   * @param params Pagination parameters
   * @returns Paginated list of billing history
   */
  async getParentBillingHistory(userId: string, params?: PaginationParams): Promise<BillingHistoryResponse> {
    try {
      const response = await httpBackOfficeGet<BillingHistoryResponse>(`/backoffice/parents/${userId}/billing-history`, {
        page: params?.page || 1,
        limit: params?.limit || 20,
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch parent billing history:', error);
      throw error;
    }
  }

  /**
   * Export parent's billing history to CSV
   * @param userId The parent user ID
   * @returns CSV file blob
   */
  async exportParentBillingHistory(userId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `https://apis.dojoconnect.app/api/backoffice/parents/${userId}/billing-history/export`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to export billing history');
      return await response.blob();
    } catch (error) {
      console.error('Failed to export parent billing history:', error);
      throw error;
    }
  }

  /**
   * Get activity history for parent
   * @param userId The parent user ID
   * @param params Pagination parameters
   * @returns Paginated list of activities
   */
  async getParentActivities(userId: string, params?: PaginationParams): Promise<ActivitiesResponse> {
    try {
      const response = await httpBackOfficeGet<ActivitiesResponse>(`/backoffice/parents/${userId}/activities`, {
        page: params?.page || 1,
        limit: params?.limit || 20,
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch parent activities:', error);
      throw error;
    }
  }

  /**
   * Export parent's activities to CSV
   * @param userId The parent user ID
   * @returns CSV file blob
   */
  async exportParentActivities(userId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `https://apis.dojoconnect.app/api/backoffice/parents/${userId}/activities/export`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dojoconnect_token') || ''}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to export activities');
      return await response.blob();
    } catch (error) {
      console.error('Failed to export parent activities:', error);
      throw error;
    }
  }
}

export const boParentService = new BackOfficeParentService();
