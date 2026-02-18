import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const reference = query.get("reference");
  const successParam = query.get("success") === "true";

  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    if (!reference) {
      setMessage("❌ No payment reference found.");
      return;
    }

    if (successParam) {
      setMessage("🎉 Payment successful! Subscription activated.");
      setTimeout(() => navigate("/dashboard"), 3000);
    } else {
      setMessage("❌ Payment verification failed.");
    }
  }, [reference, successParam, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        {message.includes("failed") && (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/payment")}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;
