import { useEffect } from "react";

const Community = () => {

  useEffect(() => {
    const whatsappLink = "https://chat.whatsapp.com/YOUR_INVITE_CODE"; // replace this
    window.location.href = whatsappLink;
  }, []);

  return (
    <div>
      <p>Redirecting you to our WhatsApp community...</p>
    </div>
  );
};

export default Community;