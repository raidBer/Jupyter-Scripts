import { useState } from "react";
import logoEnageo from "../../assets/logoEnageo.png";
import userIcon from "../../assets/userIcon.png";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import { AiOutlineLogout } from "react-icons/ai";

const Header = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (err) {
      console.log("failed to logout");
    }
  };

  return (
    <div className="px-20 text-2xl font-extrabold fixed flex justify-between items-center top-0 left-0 h-20 shadow-lg bg-white w-[100vw] ">
      <div className="flex items-center">
        <img src={logoEnageo} className="h-16 w-16" alt="logo ENAGEO" />
        {currentUser ? (
          <span className="ml-4">Jupyter Notebooks</span>
        ) : (
          <div className="ml-4">ENAGEO</div>
        )}
      </div>

      {currentUser ? (
        <div
          className="flex items-center hover:cursor-pointer relative"
          onClick={() => {
            setShowLogoutButton(!showLogoutButton);
          }}
        >
          <img src={userIcon} className="h-10 w-10 mr-2" />
          {currentUser.sub}
          {currentUser && showLogoutButton && (
            <button
              className="w-fit absolute duration-300 top-20 right-0 rounded bg-white text-black px-7 py-2 font-medium flex items-center hover:shadow-md"
              onClick={handleLogout}
            >
              <AiOutlineLogout />
              <span className="ml-1">Logout</span>
            </button>
          )}
        </div>
      ) : (
        <span>Jupyter Notebooks</span>
      )}
    </div>
  );
};

export default Header;
