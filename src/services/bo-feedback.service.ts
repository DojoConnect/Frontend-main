import { httpBackOfficeGet } from './http';

export interface FeedbackItem {
  id: string;
  fullName?: string;
  userEmail?: string;
  role?: string;
  feedback?: string;
  createdAt?: string;
}

export interface ListFeedbackResponse {
  data: FeedbackItem[];
  meta?: {
    page?: number;
    limit?: number;
    totalCount?: number;
    totalPages?: number;
  };
}

export const boFeedbackService = {
  listFeedbacks: async (params: { page?: number; limit?: number; search?: string }) => {
    return httpBackOfficeGet<ListFeedbackResponse>('/backoffice/feedback', params);
  },
};

export default boFeedbackService;
