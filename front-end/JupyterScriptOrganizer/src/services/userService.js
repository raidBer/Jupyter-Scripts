import api from "../utils/api";

class userService {
  async getAllUsers() {
    const response = await api.get("users");
    return response.data;
  }
}

export default new userService();
