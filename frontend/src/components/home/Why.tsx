import { Sparkles, Radar, BookOpen } from "lucide-react";

const Why = () => {

  const boxes = [
    {
      icon: <Sparkles />,
      title: "Grants & Opportunities",
      content:
        "Discover relevant grants, hackathons, competitions, and funding opportunities curated specifically for Nigerian entrepreneurs and creatives."
    },
    {
      icon: <Radar />,
      title: "Expansion & Relocation Insights",
      content:
        "Get guidance on expanding your business to new markets or relocating operations with policy insights and regulatory requirements."
    },
    {
      icon: <BookOpen />,
      title: "Business Resources",
      content:
        "Access curated resources, guides, and tools designed to help you navigate business registration, compliance, and growth strategies."
    }
  ];

  return (
    <main className="flex flex-col gap-10 items-center py-20 px-6">

      <section className="flex flex-col gap-4 max-w-3xl text-center">
        <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold">
          Why <span className="text-green-400">9jataxes?</span>
        </h1>

        <p className="text-gray-300 text-sm md:text-lg">
          We help you make informed business decisions and make strategies that support business growth
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">

        {boxes.map((b, i) => (
          <div
            key={i}
            className="bg-[#1b2e42] flex flex-col gap-4 rounded-2xl border border-gray-700 p-6"
          >
            <span className="bg-green-500 w-12 h-12 flex items-center justify-center rounded-xl text-white">
              {b.icon}
            </span>

            <p className="text-lg md:text-xl font-semibold text-gray-100">
              {b.title}
            </p>

            <p className="text-gray-300 text-sm md:text-base">
              {b.content}
            </p>
          </div>
        ))}

      </section>
    </main>
  );
};

export default Why;