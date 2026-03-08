import { Mail, Sparkles } from "lucide-react";

const Subscribe = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      
      <div className="bg-white max-w-5xl w-full rounded-xl p-10 text-center shadow-lg">

        {/* Icon */}
        <div className="w-16 h-16 bg-emerald-500 text-white flex items-center justify-center rounded-xl mx-auto mb-6">
          <Mail size={28} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Be the First to Know
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          Get launch updates, early access perks, and exclusive business insights delivered to your inbox
        </p>

        {/* Email Input */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="px-6 py-3 rounded-full border border-gray-300 w-full md:w-80 outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-medium transition">
            Subscribe
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-8">
          We respect your privacy. Updates only. Unsubscribe anytime.
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* Waitlist Section */}
        <p className="text-gray-600 mb-5">
          Want priority access and exclusive launch benefits?
        </p>

        <button className="flex items-center gap-2 mx-auto border border-emerald-500 text-emerald-500 px-6 py-3 rounded-full hover:bg-emerald-50 transition">
          <Sparkles size={18} />
          Join the Waitlist
        </button>

      </div>

    </div>
  );
};

export default Subscribe;