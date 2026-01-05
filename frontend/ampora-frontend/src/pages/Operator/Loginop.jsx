import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OperatorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    // SIMPLE BEGINNER LOGIN
    if (email === "operator@gmail.com" && password === "1234") {
      localStorage.setItem("operatorAuth", "true"); // save login
      navigate("/operator"); // redirect to dashboard
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-emerald-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Operator Login
        </h2>

        <div>
          <label className="text-sm">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operator@gmail.com"
          />
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="1234"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
