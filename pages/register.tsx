"use client";

import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth";
import { useRouter } from "next/navigation"; // if using app router
// import { useRouter } from "next/router"; // if using pages router

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!role) {
      alert("Please select a role.");
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, role);
      alert("Registration successful! Please check your email to confirm.");
      router.push("/login");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="company">Company</option>
          <option value="vendor">Vendor</option>
          <option value="driver">Driver</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
