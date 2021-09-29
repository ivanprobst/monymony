// Import: libs
import * as React from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Import: components and models

export default function AuthPage() {
  // Init
  const auth = getAuth();

  // State
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  // Helper
  const handleFormUpdate = function (event: React.FormEvent<HTMLInputElement>) {
    setLoginData({
      ...loginData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  // Helper
  const processLogin = function (event: React.FormEvent) {
    event.preventDefault();

    signInWithEmailAndPassword(auth, loginData.email, loginData.password).catch(
      (err) => console.error(err),
    );
  };

  // Helper
  const processSignup = function (event: React.FormEvent) {
    event.preventDefault();

    createUserWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password,
    ).catch((err) => console.error(err));
  };

  return (
    <form className="p-2">
      <input
        className="block mb-4 shadow text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="email"
        type="email"
        placeholder="Email"
        value={loginData.email}
        onChange={handleFormUpdate}
        required
      />
      <input
        className="block mb-4 shadow text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="password"
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={handleFormUpdate}
        required
      />

      <button
        disabled={loginData.email === "" || loginData.password === ""}
        onClick={processLogin}
        className="block p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Login
      </button>
      <button
        disabled={loginData.email === "" || loginData.password === ""}
        onClick={processSignup}
        className="block p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sign up
      </button>
    </form>
  );
}
