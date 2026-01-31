import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Sparkles, Clock, ArrowLeft, Share2, Bookmark, Check,
  Link as LinkIcon, Twitter, Linkedin,  Heart, MessageCircle as MessageIcon,
   Trash2, Edit
} from "lucide-react";
import { useArticle } from "../../store/useArticleStore";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import type { JSX } from "react";

const ArticleDetail = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { user } = useAuthStore();

  const {
    fetchingSingleData,
    singleArticleContainer,
    getSingleArticle,
    getRecommendedArticles,
    recomendedArticleContainer,
    addComment,
    deleteComment,
    updateComment
  } = useArticle();

  const [isSaved, setIsSaved] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [commentInput, setCommentInput] = useState("");

  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (singleArticleContainer) {
      getRecommendedArticles(singleArticleContainer?.articleCategory?._id);
      // Initialize local comments from article data

    }
  }, [singleArticleContainer]);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch article
  useEffect(() => {
    if (articleId) {
      getSingleArticle(articleId);
      const savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "[]");
      setIsSaved(savedArticles.includes(articleId));
      // Load liked comments from localStorage
      const liked = JSON.parse(localStorage.getItem(`likedComments_${articleId}`) || "[]");
      setLikedComments(new Set(liked));
    }
  }, [articleId]);

  // Save / Remove article
  const handleSaveArticle = () => {
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "[]");
    const updatedArticles = isSaved
      ? savedArticles.filter((id: string) => id !== articleId)
      : [...savedArticles, articleId!];

    localStorage.setItem("savedArticles", JSON.stringify(updatedArticles));
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Article removed from saved" : "Article saved successfully");
  };


  // Share article
  const shareVia = async (method: "copy" | "twitter" | "linkedin") => {
    const url = window.location.href;
    const title = singleArticleContainer?.title || "Check out this article";

    try {
      switch (method) {
        case "copy":
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
          break;
        case "twitter":
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
          break;
        case "linkedin":
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
          break;
      }
      setShowShareOptions(false);
    } catch {
      toast.error("Failed to share article");
    }
  };

  // Comment Functions (Local State Only)
  const handleAddComment = () => {

    console.log(user)
    if (!commentInput.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (user === null) {
      toast.error("Please login to comment");
      return;
    }

    addComment(articleId, commentInput)
    setCommentInput("");
    scrollToComments();
  };

  const handleEditComment = (commentId: string) => {
    if (!editText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    updateComment(articleId, commentId, editText)
    setEditingCommentId(null)
  
    
  };

  const handleDeleteComment = (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    deleteComment(articleId, commentId)
  };

  const handleLikeComment = (commentId: string) => {
    const newLiked = new Set(likedComments);
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
      toast("Like removed");
    } else {
      newLiked.add(commentId);
      toast("Liked!");
    }
    setLikedComments(newLiked);
    localStorage.setItem(`likedComments_${articleId}`, JSON.stringify([...newLiked]));
  };

  const scrollToComments = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Render content
  const renderContent = (content: string) => {
    if (!content) return null;

    const paragraphs = content.split("\n").filter(p => p.trim());
    const elements: JSX.Element[] = [];
    let currentList: JSX.Element[] = [];

    paragraphs.forEach((p, index) => {
      const headingMatch = p.match(/^#+\s/);
      if (headingMatch) {
        if (currentList.length) {
          elements.push(<ul key={`ul-${index}`} className="ml-6 mb-6 space-y-2">{currentList}</ul>);
          currentList = [];
        }
        const level = headingMatch[0].trim().length;
        const HeadingTag = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements;
        elements.push(
          <HeadingTag
            key={index}
            className={`font-bold text-gray-900 ${level === 1 ? "text-2xl md:text-3xl mt-8 mb-4"
              : level === 2 ? "text-xl md:text-2xl mt-6 mb-3"
                : "text-lg md:text-xl mt-4 mb-2"
              }`}
          >
            {p.replace(/^#+\s/, "")}
          </HeadingTag>
        );
        return;
      }

      if (p.match(/^\s*[-*•]\s/)) {
        currentList.push(
          <li key={index} className="relative pl-6 mb-2 text-gray-700">
            <div className="absolute left-0 top-3 w-1.5 h-1.5 rounded-full bg-green-600"></div>
            {p.replace(/^\s*[-*•]\s/, "")}
          </li>
        );
        return;
      }

      if (currentList.length) {
        elements.push(<ul key={`ul-${index}`} className="ml-6 mb-6 space-y-2">{currentList}</ul>);
        currentList = [];
      }
      elements.push(
        <p key={index} className="mb-6 text-gray-700 leading-relaxed">
          {p}
        </p>
      );
    });

    if (currentList.length) elements.push(<ul key="last-ul" className="ml-6 mb-6 space-y-2">{currentList}</ul>);
    return elements;
  };

  // Loading state
  if (fetchingSingleData || !singleArticleContainer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  const article = singleArticleContainer;

  return (
    <div className="min-h-screen mt-16 bg-white">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-100">
        <div
          className="h-full bg-green-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN CONTENT */}
        <article className="lg:col-span-2">
          {/* Article Content */}
          <div className="bg-white rounded-xl border border-gray-200">
            {/* Hero Section */}
            <div className="p-6 md:p-8 border-b border-gray-200">
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 mb-6"
              >
                <ArrowLeft size={18} />
                Back to Articles
              </Link>

              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                  {article?.articleCategory?.name}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">{article.timeTaken} min read</span>
                </div>
              </div>

              {/* Title & Description */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              <p className="text-gray-600 mb-6">
                {article.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-green-500 hover:bg-green-50"
                  >
                    <Share2 size={16} />
                    <span className="text-sm">Share</span>
                  </button>
                  {showShareOptions && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-45">
                      <button
                        onClick={() => shareVia("copy")}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 text-left text-sm"
                      >
                        <LinkIcon size={16} className="text-gray-600" />
                        Copy Link
                      </button>
                      <button
                        onClick={() => shareVia("twitter")}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 text-left text-sm"
                      >
                        <Twitter size={16} className="text-gray-600" />
                        Twitter
                      </button>
                      <button
                        onClick={() => shareVia("linkedin")}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 text-left text-sm"
                      >
                        <Linkedin size={16} className="text-gray-600" />
                        LinkedIn
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSaveArticle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isSaved
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-300 hover:border-green-500 hover:bg-green-50"
                    }`}
                >
                  {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
                  <span className="text-sm">{isSaved ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">{renderContent(article.content)}</div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="p-6 md:p-8 border-t border-gray-200">
              <div className="max-w-3xl mx-auto">
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-green-600" size={20} />
                    <h3 className="font-semibold text-gray-900">What This Means For You</h3>
                  </div>
                  <p className="text-gray-700">
                    {article?.articleSummary?.main}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200">
              <div className="p-6 md:p-8">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Comments ({singleArticleContainer?.comments.length})
                  </h3>

                  {/* Add Comment */}
                  <div className="mb-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium shrink-0">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          rows={4}
                        />
                        <button
                          onClick={handleAddComment}
                          disabled={!commentInput.trim()}
                          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {singleArticleContainer?.comments.map((comment) => (
                      <div key={comment._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-medium">
                              {comment?.userId.name.charAt(0) || "U"}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {comment.userId.name || "Anonymous"}
                              </h4>
                              {/* <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </p> */}
                            </div>
                          </div>

                          {user?._id === comment.userId._id && (
                            <div className="flex gap-2">
                              {editingCommentId === comment._id ? (
                                <>
                                  <button
                                    onClick={() => handleEditComment(comment._id)}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(null);
                                      setEditText("");
                                    }}
                                    className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingCommentId(comment._id);
                                      setEditText(comment.comment);
                                    }}
                                    className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {editingCommentId === comment._id ? (
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-700 mb-3">{comment.comment}</p>
                        )}

                        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleLikeComment(comment._id)}
                            className={`flex items-center gap-2 ${likedComments.has(comment._id) ? 'text-green-600' : 'text-gray-500'
                              }`}
                          >
                            <Heart size={16} className={likedComments.has(comment._id) ? 'fill-current' : ''} />
                            <span className="text-sm">
                              {likedComments.has(comment._id) ? 'Liked' : 'Like'}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {singleArticleContainer.comments.length === 0 && (
                      <div className="text-center py-8">
                        <MessageIcon className="mx-auto text-gray-400 mb-3" size={32} />
                        <h4 className="text-lg font-medium text-gray-700 mb-2">No comments yet</h4>
                        <p className="text-gray-500">Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>

                  <div ref={commentsEndRef} />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Recommended Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Recommended Articles */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recommended Articles</h3>
              <div className="space-y-4">
                {recomendedArticleContainer?.articles?.map((recArticle, i) => (
                  <Link
                    key={recArticle._id}
                    to={`/article/${recArticle._id}`}
                    className="group block"
                  >
                    <div className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-medium shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-green-700 line-clamp-2">
                            {recArticle.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock size={12} />
                              {recArticle.timeTaken} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to="/learn"
                className="block w-full mt-6 py-3 text-center border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                View All Articles
              </Link>
            </div>

            {/* Reading Stats */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-green-600" size={20} />
                <h4 className="font-semibold text-gray-900">Reading Progress</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium text-green-700">{Math.round(scrollProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>~{article.timeTaken} minutes total</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageIcon className="text-green-600" size={20} />
                <h4 className="font-semibold text-gray-900">Community Activity</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Comments</span>
                  <span className="font-medium text-green-700">{singleArticleContainer?.comments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Comments</span>
                  <span className="font-medium text-green-700">
                    {singleArticleContainer?.comments.filter(c => c.userId?._id === user?._id).length}
                  </span>
                </div>
                <button
                  onClick={scrollToComments}
                  className="w-full mt-4 py-2 border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors"
                >
                  Join Discussion
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticleDetail;