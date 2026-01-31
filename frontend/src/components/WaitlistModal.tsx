import { X } from "lucide-react";
import { useWaitlist } from "../../store/useWaitlist";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const WaitlistModal = ({ open, onClose }: Props) => {
  const { joinWaitlist, loading } = useWaitlist();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    interest: "",
  });

  const [showCongrats, setShowCongrats] = useState(false);

  if (!open && !showCongrats) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await joinWaitlist(form);
    if (success) {
      setForm({ fullName: "", email: "", interest: "" });
      setShowCongrats(true);
    }
  };

  const closeCongrats = () => {
    setShowCongrats(false);
    onClose();
  };

  // Loader component for button
  const ButtonContent = () => {
    return loading ? (
      <div className="flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>Joining...</span>
      </div>
    ) : (
      "Join Waitlist"
    );
  };

  return (
    <>
      {/* Waitlist Form Modal */}
      {!showCongrats && open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Join the Waitlist
            </h2>
            <p className="text-gray-500 mb-6">
              Be first to experience TaxWise at launch 🚀
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                name="interest"
                placeholder="Tax topics you're interested in (optional)"
                value={form.interest}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex justify-center"
              >
                <ButtonContent />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative text-center">
            <button
              onClick={closeCongrats}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100"
            >
              <X size={18} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🎉 Congratulations!
            </h2>
            <p className="text-gray-500 mb-6">
              You’ve successfully joined the TaxWise waitlist. Stay tuned for updates!
            </p>
            <button
              onClick={closeCongrats}
              className="bg-green-800 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WaitlistModal;
