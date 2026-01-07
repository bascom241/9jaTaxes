import { create } from "zustand"
import axiosInstance from "../src/lib/axios"
import toast from "react-hot-toast"

interface ArticleComment {
    userId: {
        _id: string
        name: string
    }
    _id: string
    comment: string
    name: string
}

interface RecomendedArticleData {
    _id: string
    title: string
    articleCategory: string
    timeTaken: number
}

interface RecommendedCategory {
    _id: string
    name: string
    slug: string
    createdAt: string
    updatedAt: string
    articles: RecomendedArticleData[]
}

interface ArticleData {
    articleSummary: {
        main: string
        length: number
    },
    _id: string
    title: string
    description: string
    content: string
    timeTaken: number  // in seconds
    articleCategory: {
        _id: string,
        name: string
    }
    comments: ArticleComment[]
    createdAt: string
    updatedAt: string
}

interface Article {
    page: number
    totalPages: number
    totalArticles: number
    data: ArticleData[]
}

interface ParamType {
    page?: number
    limit?: number
    sortBy?: string
    order?: string
    search?: string,
    catId?: string | null,
}

interface ArticleInterface {
    getAllArticles: (params?: ParamType) => Promise<Article>
    articleContainer: Article | null
    getSingleArticle: (id: string) => Promise<ArticleData>
    singleArticleContainer: ArticleData | null
    fetchingSingleData: boolean
    getRecommendedArticles: (id: string | undefined) => Promise<RecommendedCategory>
    fetchingRecomendedArticle?: boolean
    recomendedArticleContainer: RecommendedCategory | null
    addComment: (articleId: string | undefined, comment: string) => Promise<ArticleData>
    deletingComment: boolean
    deleteComment: (articleId: string | undefined, commentId: string) => Promise<ArticleData>
    updateComment: (articleId: string | undefined, commentId: string, comment: string) => Promise<ArticleData>
}

export const useArticle = create<ArticleInterface>((set, get) => ({
    fetchingRecomendedArticle: false,
    recomendedArticleContainer: null,
    articleContainer: null,
    singleArticleContainer: null,
    fetchingSingleData: false,
    deletingComment: false,
    getAllArticles: async (params = {}) => {

        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc",
            search = "",
            catId = null,
        } = params

        const queryParams: ParamType = {
            page,
            limit,
            sortBy,
            order,
        };

        if (search) {
            queryParams.search = search
        }
        if (catId) {
            queryParams.catId = catId;
        }
        try {
            const response = await axiosInstance.get("/article/all",
                {
                    params: queryParams
                }
            );

            console.log(response)
            set({ articleContainer: response.data })
            return response.data
        } catch (error) {
            toast.error("Failed to fetch Articles")
            console.log(error)
        }
    },

    getSingleArticle: async (id) => {
        set({ fetchingSingleData: true })
        try {
            const response = await axiosInstance.get(`/article/single-article/${id}`);
            console.log(response.data.data)
            set({ singleArticleContainer: response.data.data, fetchingSingleData: false })
            return response.data;
        } catch (error) {
            console.log(error)
            toast.error("Failed to fecth Data")
            set({ fetchingSingleData: false })
        }
    },
    getRecommendedArticles: async (id) => {
        set({ fetchingRecomendedArticle: true })
        try {
            const response = await axiosInstance.get(`/article/get-article-category/${id}`);
            console.log(response)
            set({ fetchingRecomendedArticle: false })
            set({ recomendedArticleContainer: response.data.data })
            return response.data
        } catch (error) {
            set({ fetchingRecomendedArticle: false })
            console.log(error)
        }
    },
    addComment: async (articleId, comment) => {
        console.log(comment)
        try {
            const response = await axiosInstance.post(`/article/comment/${articleId}`, { comment: comment });
            console.log(response.data.data)
            get().getSingleArticle(articleId as string)
            set({ singleArticleContainer: response.data.data })
            get().getRecommendedArticles(get().singleArticleContainer?.articleCategory?._id)
            toast.success("comment added");
            return response.data.data;
        } catch (error) {
            console.log(error)
        }
    },
    deleteComment: async (articleId, commentId) => {
        set({ deletingComment: true })
        try {
            const response = await axiosInstance.put(`/article/delete-comment/${articleId}`, { commentId:commentId })
            get().getSingleArticle(articleId as string)
            set({ singleArticleContainer: response.data.data })
            get().getRecommendedArticles(get().singleArticleContainer?.articleCategory?._id)
            toast.success("Comment deleted")
            return response.data.data
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        }
    },
    updateComment: async (articleId, commentId, comment) => {
        try {
            const response = await axiosInstance.put(`/article/update-comment/${articleId}`, { commentId:commentId, comment:comment })
            set({ singleArticleContainer: response.data.data })
            get().getSingleArticle(articleId as string)
            get().getRecommendedArticles(get().singleArticleContainer?.articleCategory?._id)
            toast.success("Comment updated")
            return response.data.data
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        }
    }
}))