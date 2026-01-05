import { FiCheck } from "react-icons/fi";

const glass =
  "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

const plans = [
  {
    name: "Basic",
    price: "LKR 1,999/mo",
    features: ["Standard map access", "Station search", "Single vehicle"],
    cta: "Choose Basic",
    popular: false,
  },
  {
    name: "Premium",
    price: "LKR 4,999/mo",
    features: [
      "Smart routing",
      "Multi-vehicle",
      "Booking priority",
      "Energy analytics",
    ],
    cta: "Get Premium",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Fleet tools",
      "Admin console",
      "Custom billing",
      "Priority support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function SubscriptionPlans() {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white text-gray-900">
      <div className="mx-auto w-11/12 max-w-6xl py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700 text-center">
          Plans & Subscription
        </h1>
        <p className="text-center text-emerald-900/70 mt-2">
          Pick the plan that fits your EV lifestyle.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`${glass} rounded-3xl p-6 border ${
                p.popular ? "border-emerald-400" : "border-emerald-200/60"
              }`}
            >
              {p.popular && (
                <div className="mb-3 inline-block px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-extrabold text-emerald-800">
                {p.name}
              </h3>
              <div className="text-3xl font-extrabold text-emerald-700 mt-2">
                {p.price}
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <FiCheck className="text-emerald-600" /> {f}
                  </li>
                ))}
              </ul>

              <button className="mt-6 w-full px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
