import { useEffect } from "react";
import { useNewsStore } from "../../store/newStore";

const News = () => {
  const { news, fetchNews } = useNewsStore();

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-gray-800">
          News & Policy Updates
        </h1>

        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Stay informed with the policy changes and announcements,
          and incentives available for you and your business
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto space-y-6">
        {news.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl p-6 shadow-sm border"
          >
            {/* Date */}
            <p className="text-sm text-gray-400">
              {new Date(item.createdAt).toDateString()}
            </p>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 mt-2">
              {item.title}
            </h2>

            {/* Content */}
            <p className="text-gray-600 mt-3 leading-relaxed">
              {item.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
                What Changed: {item.whatChanged}
              </span>

              <span className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full">
                Who It Affects: {item.whoItAffects}
              </span>
            </div>

            {/* Read More */}
            <p className="text-green-600 mt-4 text-sm font-medium cursor-pointer hover:underline">
              Read More →
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;