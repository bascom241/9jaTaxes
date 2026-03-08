import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center gap-6">

      {/* Launch badge */}
      <section>
        <button className="bg-[#08464a] border border-green-400 rounded-full flex items-center gap-2 px-4 py-2">
          <Sparkles className="text-green-400" size={18} />
          <p className="text-green-400 text-sm md:text-base">Launching soon</p>
        </button>
      </section>

      {/* Headline */}
      <section className="max-w-5xl">
        <h1 className="text-white font-semibold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Grow Your Small business into a
        </h1>

        <h1 className="text-green-400 font-semibold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2">
          compliant <span className="text-white">,</span> profitable{" "}
          <span className="text-white">and</span> scalable
        </h1>

        <h1 className="text-white font-semibold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2">
          venture
        </h1>
      </section>

      {/* Description */}
      <section className="max-w-3xl">
        <p className="text-gray-300 text-base sm:text-lg md:text-xl">
          Get access to everything you need to grow your small business —
          funding opportunities, policy clarity, community support and
          AI-powered tax guidance.
        </p>
      </section>

      {/* CTA */}
      <section>
        <button className="bg-green-400 hover:bg-green-500 transition border border-green-400 rounded-full flex items-center gap-2 px-6 py-3">
          <Sparkles className="text-white" size={18} />
          <p className="text-white font-medium">Join the Waitlist</p>
        </button>
      </section>

      {/* Footer text */}
      <p className="text-gray-400 text-sm sm:text-base">
        🇳🇬 Built specifically for Nigerian youth aged 17-35
      </p>

    </main>
  );
};

export default Hero;