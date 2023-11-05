import { createContext, useState, useEffect } from "react";
import jwt from "../utils/jwt";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = jwt.getToken();
    if (token) {
      const decodedToken = jwt_decode(token);
      setCurrentUser(decodedToken);
    }
    setLoading(false);
  }, []);

  const value = { currentUser, setCurrentUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
