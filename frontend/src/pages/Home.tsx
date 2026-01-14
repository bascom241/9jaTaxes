import Chat from "../components/chats/Chat";
import { SocketProvider } from "../context/SocketContext";

const Home = () => {
  return (
    <SocketProvider>
      <main className="mt-24 flex flex-col md:flex-row w-full  bg-gray-100">
        {/* Chat takes full width on mobile, fixed sidebar on desktop */}
        <Chat />
      </main>
    </SocketProvider>
  );
};

export default Home;
