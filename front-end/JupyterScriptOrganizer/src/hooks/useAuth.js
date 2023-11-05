import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  if (AuthContext) {
    return useContext(AuthContext);
  } else {
    throw new Error("AuthProvider is required");
  }
};

export default useAuth;
