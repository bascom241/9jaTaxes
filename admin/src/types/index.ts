// types/index.ts
export interface IArticle {
  _id: string;
  title: string;
  description: string;
  content: string;
  timeTaken: number;
  articleCategory: ICategory | string;
  articleSummary: {
    main: string;
    length: number;
  };
  comments: IComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  userId: IUser | string;
  comment: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
}

export interface IPagination {
  page: number;
  totalPages: number;
  totalArticles: number;
  limit: number;
}

export interface IArticleFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
  catId?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IArticleFormData {
  title: string;
  description: string;
  content: string;
  articleCategory: string;
}

export interface ICommentFormData {
  comment: string;
  commentId?: string;
}