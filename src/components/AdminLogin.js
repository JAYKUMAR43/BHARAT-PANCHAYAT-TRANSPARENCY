import React, { useState } from "react";
import { adminLogin } from "../api";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await adminLogin({ email, password });
    if (res.access_token) {
      localStorage.setItem("admin_token", res.access_token);
      if (onLogin) onLogin();
      alert("Logged in");
    } else {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
