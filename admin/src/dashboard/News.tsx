import { useState } from "react";
import {useAdminNewsStore} from "../../store/useNews"
const News = () => {
  const { createNews, loading } = useAdminNewsStore();

  const [form, setForm] = useState({
    title: "",
    content: "",
    whatChanged: "",
    whoItAffects: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await createNews(form);

    setForm({
      title: "",
      content: "",
      whatChanged: "",
      whoItAffects: "",
    });
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-semibold mb-6">Post News Update</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-xl"
      >
        <input
          value={form.title}
          placeholder="News Title"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="bg-[#111] border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        />

        <textarea
          value={form.content}
          placeholder="Full Content"
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
          className="bg-[#111] border border-gray-700 p-3 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-white"
        />

        <input
          value={form.whatChanged}
          placeholder="What Changed"
          onChange={(e) =>
            setForm({ ...form, whatChanged: e.target.value })
          }
          className="bg-[#111] border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        />

        <input
          value={form.whoItAffects}
          placeholder="Who It Affects"
          onChange={(e) =>
            setForm({ ...form, whoItAffects: e.target.value })
          }
          className="bg-[#111] border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        />

        <button
          disabled={loading}
          className="bg-white text-black font-semibold py-3 rounded-lg hover:opacity-90 transition"
        >
          {loading ? "Posting..." : "Post News"}
        </button>
      </form>
    </div>
  );
};

export default News;