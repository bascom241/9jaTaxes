// store/articleStore.ts
import { create } from "zustand"
import axiosInstance from "../src/lib/axios";
import type{ 
  IArticle, 
  ICategory, 
  IPagination, 
  IArticleFilters,
  IApiResponse,
  IArticleFormData,
} from "../src/types"

interface ArticleStore {
  // States
  articles: IArticle[];
  singleArticle: IArticle | null;
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  pagination: IPagination;

  // Article APIs
  fetchArticles: (params?: IArticleFilters) => Promise<void>;
  fetchSingleArticle: (articleId: string) => Promise<void>;
  createArticle: (articleData: IArticleFormData) => Promise<IApiResponse<IArticle>>;
  updateArticle: (articleId: string, articleData: Partial<IArticleFormData>) => Promise<IApiResponse<IArticle>>;
  deleteArticle: (articleId: string) => Promise<IApiResponse<null>>;
  fetchArticlesByCategory: (catId: string) => Promise<IApiResponse<any>>;

  // Category APIs
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<IApiResponse<ICategory>>;

  // Comment APIs
  addComment: (articleId: string, comment: string) => Promise<IApiResponse<IArticle>>;
  deleteComment: (articleId: string, commentId: string) => Promise<IApiResponse<IArticle>>;
  editComment: (articleId: string, commentId: string, comment: string) => Promise<IApiResponse<IArticle>>;

  // Utilities
  resetArticles: () => void;
  clearError: () => void;
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  // Initial States
  articles: [],
  singleArticle: null,
  categories: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    totalArticles: 0,
    limit: 10
  },

  // ========== ARTICLE APIs (base: /api/article) ==========
  
  // GET /api/article/all
  fetchArticles: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const queryParams = new URLSearchParams(params as any).toString()
      const response = await axiosInstance.get(`/article/all?${queryParams}`)
      
      set({ 
        articles: response.data.data,
        pagination: {
          page: response.data.page,
          totalPages: response.data.totalPages,
          totalArticles: response.data.totalArticles,
          limit: params.limit || 10
        },
        loading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch articles", 
        loading: false 
      })
    }
  },

  // GET /api/article/single-article/:articleId
  fetchSingleArticle: async (articleId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get(`/article/single-article/${articleId}`)
      set({ singleArticle: response.data.data, loading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch article", 
        loading: false 
      })
    }
  },

  // POST /api/article/create
  createArticle: async (articleData: IArticleFormData) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.post("/article/create", articleData)
      
      // Refresh list
      const { pagination } = get()
      await get().fetchArticles({ page: 1, limit: pagination.limit })
      
      set({ loading: false })
      return { success: true, data: response.data.data }
    } catch (error: any) {
        console.log(error)
      const errorMessage = error.response?.data?.message || "Failed to create article"
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  // PUT /api/article/update-article/:articleId
  updateArticle: async (articleId: string, articleData: Partial<IArticleFormData>) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.put(`/article/update-article/${articleId}`, articleData)
      
      // Refresh list
      const { pagination } = get()
      await get().fetchArticles({ page: pagination.page, limit: pagination.limit })
      
      set({ loading: false })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update article"
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  // DELETE /api/article/:articleId (You need to add this route)
  deleteArticle: async (articleId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.delete(`/article/${articleId}`)
      
      // Refresh list
      const { pagination } = get()
      await get().fetchArticles({ page: pagination.page, limit: pagination.limit })
      
      set({ loading: false })
      return { success: true, data: response.data }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete article"
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  // GET /api/article/get-article-category/:catId
  fetchArticlesByCategory: async (catId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get(`/article/get-article-category/${catId}`)
      set({ loading: false })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch articles by category"
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  // ========== CATEGORY APIs (base: /api/category) ==========
  
  // GET /api/category/all (You need to add this route)
  fetchCategories: async () => {
    try {
      const response = await axiosInstance.get("/category/all")
      set({ categories: response.data.data })
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  },

  // POST /api/category/create
  createCategory: async (name: string) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.post("/category/create", { name })
      await get().fetchCategories()
      set({ loading: false })
      return { success: true, data: response.data.data }
    } catch (error: any) {
        console.log(error)
      const errorMessage = error.response?.data?.message || "Failed to create category"
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  // ========== COMMENT APIs (base: /api/article) ==========
  
  // POST /api/article/comment/:articleId
  addComment: async (articleId: string, comment: string) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.post(`/article/comment/${articleId}`, { comment })
      
      const currentArticle = get().singleArticle
      if (currentArticle && currentArticle._id === articleId) {
        set({ singleArticle: response.data.data })
      }
      
      set({ loading: false })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to add comment"
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  // PUT /api/article/delete-comment/:articleId
  deleteComment: async (articleId: string, commentId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.put(`/article/delete-comment/${articleId}`, { commentId })
      
      const currentArticle = get().singleArticle
      if (currentArticle && currentArticle._id === articleId) {
        set({ singleArticle: response.data.data })
      }
      
      set({ loading: false })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete comment"
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  // PUT /api/article/update-comment/:articleId
  editComment: async (articleId: string, commentId: string, comment: string) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.put(`/article/update-comment/${articleId}`, {
        commentId,
        comment
      })
      
      const currentArticle = get().singleArticle
      if (currentArticle && currentArticle._id === articleId) {
        set({ singleArticle: response.data.data })
      }
      
      set({ loading: false })
      return { success: true, data: response.data.data }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to edit comment"
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  // ========== UTILITIES ==========
  resetArticles: () => set({ articles: [], singleArticle: null, error: null }),
  clearError: () => set({ error: null })
}))