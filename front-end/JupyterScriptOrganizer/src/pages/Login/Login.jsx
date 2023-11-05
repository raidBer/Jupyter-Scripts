import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import { Navigate } from "react-router-dom";
import Header from "../../components/Layout/Header";

const Login = () => {
  const { setCurrentUser, currentUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const getCredentialsFromForm = () => {
    return { username: username, password: password };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const credentials = getCredentialsFromForm();
    try {
      const user = await authService.login(credentials);
      setCurrentUser(user);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return currentUser ? (
    <Navigate to="/" replace />
  ) : (
    <div className="relative h-screen w-screen">
      <div className="bg-traitementSeismique absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center"></div>
      <div className="absolute inset-0 backdrop-blur-[9px]"></div>
      <Header />
      <div className="relative z-10 flex h-full w-full justify-center">
        <div className="w-[450px] h-fit mt-40 rounded-lg border border-main bg-white px-6 py-10">
          <h2 className="mx-auto mb-5 w-fit text-3xl font-extrabold">Login</h2>
          {error && (
            <div className="rounded-lg bg-color1/20 px-10 py-2 text-center">
              The username or password is incorrect, Try again!
            </div>
          )}

          <form id="signup" className="flex flex-col" onSubmit={handleSubmit}>
            <label className="my-2">Username</label>
            <input
              className="mb-5 rounded border border-color4 px-2 py-1 outline-none"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
            />

            <label className="my-2">Password</label>
            <input
              className="mb-5 rounded border border-color4 px-2 py-1 outline-none"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />

            <button
              className="mx-auto mb-3 w-full rounded bg-color1 px-7 py-2 font-medium duration-150 hover:shadow-md hover:shadow-color1/30"
              disabled={loading}
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
