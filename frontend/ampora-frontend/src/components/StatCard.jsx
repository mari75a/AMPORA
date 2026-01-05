export default function StatCard({ title, value, color, icon }) {
  return (
    <div
      className="relative bg-white/70 backdrop-blur-md border border-[#ADEED9] rounded-2xl p-6 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
      style={{ "--theme-color": color }}
    >
     
      {icon && (
        <div
          className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      )}

      
      <h3 className="text-lg font-semibold text-[#043D3A]/80 mb-2">{title}</h3>

     
      <p
        className="text-3xl font-bold tracking-tight"
        style={{ color: color }}
      >
        {value}
      </p>

     
      <div
        className="mt-3 h-[3px] rounded-full"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}
