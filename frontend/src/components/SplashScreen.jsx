import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signin"); // change if needed
    }, 7000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col items-center overflow-hidden">

      {/* ================= VIDEO ================= */}
      <div className="w-full flex items-center justify-center bg-white pt-10">
        <video
          src="/foodyy-animation.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="max-w-[900px] w-full"
        />
      </div>

      {/* ================= HERO ================= */}
      <section className="relative w-full flex flex-col items-center text-center px-4 mt-10">

        {/* Floating Burger */}
        <img
          src="/burger.png"
          alt="burger"
          className="
            hidden md:block
            absolute
            left-[-60px] top-[-40px]
            w-40 md:w-56 lg:w-72
            animate-float
            pointer-events-none
          "
        />

        {/* Floating Pizza */}
        <img
          src="/pizza.png"
          alt="pizza"
          className="
            hidden md:block
            absolute
            right-[-60px] top-10
            w-40 md:w-56 lg:w-72
            animate-float-slow
            pointer-events-none
          "
        />

        <h1 className="text-4xl md:text-5xl font-bold text-[#ff4d5a] leading-tight">
          Better food for <br /> more people
        </h1>

        <p className="mt-4 max-w-xl text-gray-600 text-base md:text-lg">
          For over a decade, we’ve enabled our customers to discover new tastes,
          delivered right to their doorstep
        </p>
      </section>

      {/* ================= STATS ================= */}
      <div className="mt-14 w-full flex justify-center px-4 mb-20">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-8 sm:gap-14 px-8 py-6">

          <div className="flex items-center gap-4">
            <span className="text-3xl">🏪</span>
            <div>
              <h2 className="text-2xl font-bold">3,00,000+</h2>
              <p className="text-sm text-gray-500">restaurants</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl">📍</span>
            <div>
              <h2 className="text-2xl font-bold">800+</h2>
              <p className="text-sm text-gray-500">cities</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl">📦</span>
            <div>
              <h2 className="text-2xl font-bold">3 billion+</h2>
              <p className="text-sm text-gray-500">orders delivered</p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
          100% { transform: translateY(0px); }
        }
        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: floatSlow 7s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export default SplashScreen;
