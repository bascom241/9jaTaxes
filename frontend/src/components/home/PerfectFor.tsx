import { GraduationCap, Laptop, Building2 } from "lucide-react";

const PerfectFor = () => {
  return (
    <div className="w-full  py-20 px-6 flex justify-center">
      
      <div className="w-full max-w-6xl border border-emerald-700/30 rounded-3xl p-14 bg-linear-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md">

        {/* Title */}
        <h2 className="text-center text-4xl font-semibold text-gray-200 mb-14">
          Perfect For...
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

          {/* Students */}
          <div className="flex flex-col items-center">
            <GraduationCap size={40} className="text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Students
            </h3>
            <p className="text-gray-400">
              Discover opportunities early
            </p>
          </div>

          {/* Freelancers */}
          <div className="flex flex-col items-center">
            <Laptop size={40} className="text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Freelancers
            </h3>
            <p className="text-gray-400">
              Grow your side hustle smart
            </p>
          </div>

          {/* Small Business */}
          <div className="flex flex-col items-center">
            <Building2 size={40} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Small Business Owners
            </h3>
            <p className="text-gray-400">
              Scale with confidence
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PerfectFor;