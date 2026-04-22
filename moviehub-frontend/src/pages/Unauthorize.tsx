// SUBEDI RABIN M25W0465
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] z-0" />

      <div className="relative z-10 text-center max-w-md">
        {/* Animated Icon/Graphic */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-600/10 border border-red-600/20">
          <span className="text-5xl text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            🔒
          </span>
        </div>

        {/* Text Content */}
        <h1 className="text-7xl font-black text-white tracking-tighter mb-4 italic">
          403
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-500 mb-10 leading-relaxed">
          It looks like you don't have the necessary permissions to view this content. This area is reserved for <span className="text-red-500 font-semibold">Authorized Personnel</span> only.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 active:scale-95"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-[10px] text-gray-700 uppercase tracking-[0.4em]">
          MovieHub Security Protocol
        </p>
      </div>
    </div>
  );
}