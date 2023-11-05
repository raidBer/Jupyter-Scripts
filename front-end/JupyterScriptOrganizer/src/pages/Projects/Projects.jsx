import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

import authService from "../../services/authService";
import userService from "../../services/userService";
import projectService from "../../services/projectService";

import { jupyterPath } from "../../utils/jupyterPath";
import useCurrentDate from "../../hooks/useCurrentDate";
import Header from "../../components/Layout/Header";

import { IoOpenOutline } from "react-icons/io5";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";

const Projects = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  const [showEditProjectForm, setShowEditProjectForm] = useState(false);
  const [projectIdToEdit, setProjectIdToEdit] = useState(-1);

  const [currentUserProjects, setCurrentUserProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projects = await projectService.getUserProjects(currentUser.id);
      setCurrentUserProjects(projects);
      setError("");
    } catch (err) {
      setError("failed to get Projects");
    }
  };

  const handleOpenLink = (path) => {
    window.open(jupyterPath + path, "_blank");
  };

  const handleNewProject = async () => {
    setShowNewProjectForm(true);
  };

  const handleEditProject = async (projectId) => {
    setProjectIdToEdit(projectId);
    setShowEditProjectForm(true);
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "are you sure you want to delete this project?"
    );
    if (confirmed) {
      try {
        await projectService.deleteProject(projectId);
        setCurrentUserProjects(
          currentUserProjects.filter((project) => project.id != projectId)
        );
        setError("");
      } catch (err) {
        setError("failed to delete project");
      }
    }
  };

  return (
    currentUser && (
      <>
        <Header />
        <div className="py-40 px-16">
          {showNewProjectForm && (
            <NewProjectForm
              setShowNewProjectForm={setShowNewProjectForm}
              setError={setError}
              fetchProjects={fetchProjects}
            />
          )}
          {showEditProjectForm && (
            <EditProjectForm
              setShowEditProjectForm={setShowEditProjectForm}
              setError={setError}
              fetchProjects={fetchProjects}
              projectIdToEdit={projectIdToEdit}
            />
          )}
          <div
            className={`${
              (showEditProjectForm || showNewProjectForm) &&
              "blur-[2px] duration-200"
            }`}
          >
            <section className="mb-12">
              <h2 className="mx-auto w-fit text-4xl font-extrabold mb-10">
                Your Projects
              </h2>
              {error && (
                <div className="rounded-lg w-fit mx-auto bg-color1/20 px-10 py-2 my-5 text-center">
                  {error}, try again later.
                </div>
              )}
              <ul className="px-10 text-xl">
                {currentUserProjects.map((project) => (
                  <li
                    className="flex items-center justify-between mb-4 py-5 px-8 border-l-8 border-l-color1 border-2"
                    key={project.id}
                  >
                    <span>{project.name}</span>
                    <div className="font-medium flex">
                      <button
                        className="mx-2 py-1 px-4 bg-white rounded-lg flex items-center"
                        onClick={() => handleOpenLink(project.path)}
                      >
                        <IoOpenOutline />
                        <span className="ml-1">Open</span>
                      </button>
                      <button
                        className="mx-2 px-4 py-1 text-color1 bg-white rounded-lg flex items-center"
                        onClick={() => handleEditProject(project.id)}
                        disabled={showNewProjectForm}
                      >
                        <AiOutlineEdit />
                        <span className="ml-1">Edit</span>
                      </button>
                      <button
                        className="mx-2 px-4 py-1 bg-white text-red-600 rounded-lg flex items-center"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <AiOutlineDelete />
                        <span className="ml-1">Delete</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <button
              className="mx-auto mb-3 w-fit rounded bg-color1 px-7 py-2 font-medium duration-150 flex items-center hover:shadow-md hover:shadow-color1/30"
              onClick={handleNewProject}
              disabled={showEditProjectForm}
            >
              <AiOutlinePlus />
              <span className="ml-3"> New project</span>
            </button>
          </div>
        </div>
      </>
    )
  );
};

const NewProjectForm = ({ setShowNewProjectForm, setError, fetchProjects }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [owners, setOwners] = useState([currentUser.id]);

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleOwnersChange = (event) => {
    const option = event.target.value;
    if (owners.includes(option)) {
      setOwners(owners.filter((selectedOption) => selectedOption !== option));
    } else {
      setOwners([...owners, option]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await userService.getAllUsers();
      const filteredUsers = fetchedUsers.filter(
        (user) => user.userId != currentUser.id
      );
      setUsers(filteredUsers);
    } catch (err) {
      setError("failed to get users");
      setShowNewProjectForm(false);
    }
  };

  const handleSubmit = async (event) => {
    const currentDate = useCurrentDate();
    event.preventDefault();
    const newProject = {
      project: {
        name: projectName,
        path: currentUser.sub + "/" + projectName,
        created: currentDate,
      },
      usersIds: owners,
    };
    try {
      await projectService.createProject(newProject);
      fetchProjects();
      setShowNewProjectForm(false);
    } catch (err) {
      setError("failed to create a project");
      setShowNewProjectForm(false);
    }
  };

  const handleCancel = () => {
    setShowNewProjectForm(false);
  };

  return (
    <div className="z-30 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-white shadow-xl px-10 pt-10 pb-6 rounded-xl">
      <form>
        <div className="text-3xl mx-auto w-fit font-bold mb-10">
          Create New Project
        </div>
        <label className="mr-3">Name</label>
        <input
          className="mb-7 rounded border border-color4 px-2 py-1 outline-none"
          type="text"
          onChange={handleProjectNameChange}
          required
        />

        <div className="mb-4">Select Users</div>
        <div className="flex flex-col mb-7 ml-3">
          {users.map((user) => (
            <label key={user.userId} className="mb-2">
              <input
                type="checkbox"
                value={user.userId}
                onChange={handleOwnersChange}
                className="mr-3"
              />
              {user.username}
            </label>
          ))}
        </div>
        <div className="flex items-center content-around">
          <button
            className="mr-2 mb-3 w-full rounded bg-color1 px-10 py-2 font-medium duration-150 hover:shadow-md hover:shadow-color1/30"
            type="submit"
            onClick={handleSubmit}
          >
            confirm
          </button>
          <button
            className="ml-2 mb-3 w-full rounded bg-color1 px-10 py-2 font-medium duration-150 hover:shadow-md hover:shadow-color1/30"
            onClick={handleCancel}
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const EditProjectForm = ({
  setShowEditProjectForm,
  setError,
  fetchProjects,
  projectIdToEdit,
}) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [owners, setOwners] = useState([currentUser.id]);

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleOwnersChange = (event) => {
    const option = parseInt(event.target.value);
    if (owners.includes(option)) {
      setOwners(owners.filter((selectedOption) => selectedOption !== option));
    } else {
      setOwners([...owners, option]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProject();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await userService.getAllUsers();
      const filteredUsers = fetchedUsers.filter(
        (user) => user.userId != currentUser.id
      );
      setUsers(filteredUsers);
      setError("");
    } catch (err) {
      setError("failed to get users");
      setShowEditProjectForm(false);
    }
  };

  const fetchProject = async () => {
    const fetchedProject = await projectService.getProject(projectIdToEdit);
    setProjectName(fetchedProject.name);
    setOwners(fetchedProject.ownersIds);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newProject = {
      name: projectName,
      ownersIds: owners,
    };
    try {
      await projectService.editProject(projectIdToEdit, newProject);
      fetchProjects();
      setError("");
      setShowEditProjectForm(false);
    } catch (err) {
      setError("failed to update the project");
      setShowEditProjectForm(false);
    }
  };

  const handleCancel = () => {
    setShowEditProjectForm(false);
  };

  return (
    <div className="z-30 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-white shadow-xl px-10 py-6 rounded-lg">
      <form>
        <div className="text-3xl mx-auto w-fit font-bold mb-10">
          Update Project
        </div>
        <label className="mr-3">Name </label>
        <input
          className="mb-7 rounded border border-color4 px-2 py-1 outline-none"
          type="text"
          value={projectName}
          onChange={handleProjectNameChange}
          required
        />

        <div className="mb-4">Select Users:</div>
        <div className="flex flex-col mb-7 ml-3">
          {users.map((user) => (
            <label key={user.userId} className="mb-2">
              <input
                type="checkbox"
                value={user.userId}
                onChange={handleOwnersChange}
                checked={owners.includes(user.userId)}
                className="mr-3"
              />
              {user.username}
            </label>
          ))}
        </div>
        <div className="flex items-center content-around">
          <button
            className="mr-2 mb-3 w-full rounded bg-color1 px-10 py-2 font-medium duration-150 hover:shadow-md hover:shadow-color1/30"
            type="submit"
            onClick={handleSubmit}
          >
            confirm
          </button>
          <button
            className="ml-2 mb-3 w-full rounded bg-color1 px-10 py-2 font-medium duration-150 hover:shadow-md hover:shadow-color1/30"
            onClick={handleCancel}
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Projects;
