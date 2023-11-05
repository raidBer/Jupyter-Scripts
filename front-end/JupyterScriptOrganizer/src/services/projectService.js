import api from "../utils/api";

class ProjectService {
  async getProject(projectId) {
    const response = await api.get(`projects/${projectId}`);
    return response.data;
  }

  async getUserProjects(userId) {
    const response = await api.get(`projects/user/${userId}`);
    return response.data;
  }

  async createProject(newProjectBody) {
    await api.post("/projects/new", newProjectBody);
  }

  async deleteProject(projectId) {
    await api.delete(`projects/delete/${projectId}`);
  }
  async editProject(projectId, editProjectBody) {
    await api.put(`projects/edit/${projectId}`, editProjectBody);
  }
}

export default new ProjectService();
