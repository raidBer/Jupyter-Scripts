import api from "../utils/api";
import jwt from "../utils/jwt";
import jwt_decode from "jwt-decode";

class AuthService {
  async login(credentials) {
    const response = await api.post("/auth/authenticate", credentials);
    const responseData = response.data;

    jwt.saveToken(responseData.access_token);
    const decodedToken = jwt_decode(responseData.access_token);
    return decodedToken;
  }

  async logout() {
    await api.post("/logout");
    jwt.removeToken();
  }
}

export default new AuthService();
