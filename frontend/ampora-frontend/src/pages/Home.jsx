export default function Home() {
  return (
    <div className="w-screen flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#FFEDF3] to-[#ADEED9] text-center pt-24 px-6">
      
      {/* HERO SECTION */}
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#043D3A] mb-4">
          Welcome to <span className="text-[#0ABAB5]">AMPORA ⚡</span>
        </h1>
        <p className="text-lg md:text-xl text-[#043D3A]/80 mb-10 leading-relaxed">
          Smart EV Trip Planner and Intelligent Charging System — helping you plan smarter,
          charge faster, and drive greener across Sri Lanka.
        </p>
        <a
          href="/trip-planner"
          className="bg-[#0ABAB5] hover:bg-[#56DFCF] text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-transform hover:scale-105"
        >
          ⚡ <span className="text-white">Get Started</span>
        </a>
      </div>

      {/* FEATURE CARDS */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        <div className="bg-white border border-[#ADEED9] rounded-2xl p-8 shadow-md hover:shadow-xl transition">
          <h3 className="text-2xl font-bold text-[#0ABAB5] mb-3">Plan Smarter</h3>
          <p className="text-[#043D3A]/80">
            AI-powered trip planning that calculates the best routes, charging stations,
            and travel time to optimize your EV experience.
          </p>
        </div>

        <div className="bg-white border border-[#ADEED9] rounded-2xl p-8 shadow-md hover:shadow-xl transition">
          <h3 className="text-2xl font-bold text-[#0ABAB5] mb-3">Charge Smarter</h3>
          <p className="text-[#043D3A]/80">
            Connect to IoT-based charging stations with real-time availability and
            RFID authentication for seamless usage.
          </p>
        </div>

        <div className="bg-white border border-[#ADEED9] rounded-2xl p-8 shadow-md hover:shadow-xl transition">
          <h3 className="text-2xl font-bold text-[#0ABAB5] mb-3">Drive Smarter</h3>
          <p className="text-[#043D3A]/80">
            AMPORA’s predictive analytics and ML models help you drive efficiently and
            reduce your environmental impact.
          </p>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="mt-20 bg-[#0ABAB5] text-white py-12 px-8 rounded-2xl shadow-lg max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">Join the EV Revolution ⚡</h2>
        <p className="text-lg text-[#FFEDF3] mb-6">
          Join thousands of EV drivers across Sri Lanka who plan their routes the smart way.
        </p>
        <a
          href="/register"
          className="bg-white text-[#0ABAB5] font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#56DFCF]/20 transition"
        >
          Get Started Free
        </a>
      </div>

      {/* FOOTER */}
      <footer className="mt-24 py-6 text-[#043D3A]/70 text-sm">
        <p>
          © {new Date().getFullYear()} <span className="text-[#0ABAB5] font-semibold">AMPORA</span> — Smart EV Trip Planner | Built by Team 11 ⚙️
        </p>
      </footer>
    </div>
  );
}
