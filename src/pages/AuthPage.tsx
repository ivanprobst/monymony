// Import: libs
import * as React from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthPage() {
  // Init
  const auth = getAuth();

  // State
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  // Handler
  const handleInputUpdate = function (
    event: React.FormEvent<HTMLInputElement>,
  ) {
    setLoginData({
      ...loginData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  // Handler
  const handleLogin = function (event: React.FormEvent) {
    event.preventDefault();

    signInWithEmailAndPassword(auth, loginData.email, loginData.password).catch(
      // TODO: handle login error
      (err) => console.error(err),
    );
  };

  // Handler
  const handleSignup = function (event: React.FormEvent) {
    event.preventDefault();

    createUserWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password,
    ).catch(
      // TODO: handle signup error
      (err) => console.error(err),
    );
  };

  // Render
  return (
    <div className="text-center">
      <h2 className="pb-4 text-xl">Welcome to Mony mony</h2>
      <p className="pb-4">Please log in or create a new account.</p>

      <form className="inline-block w-72">
        <input
          className="w-full mb-4 shadow"
          name="email"
          type="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleInputUpdate}
          required
        />
        <input
          className="w-full mb-4 shadow"
          name="password"
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleInputUpdate}
          required
        />

        <button
          disabled={loginData.email === "" || loginData.password === ""}
          onClick={handleLogin}
          className="w-full mb-4 p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Log in
        </button>

        <button
          disabled={loginData.email === "" || loginData.password === ""}
          onClick={handleSignup}
          className="w-full mb-4 p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
