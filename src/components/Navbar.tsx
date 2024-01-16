import toast from "react-hot-toast";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const logout = () => {
    localStorage.removeItem(storageKey);
    toast.success("logged out successfully!", {
      position: "bottom-center",
      duration: 1500,
      style: {
        backgroundColor: "black",
        color: "white",
        width: "fit-content",
      },
    });
    setTimeout(() => {
      location.replace(pathname);
    }, 2000);
  };

  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20 bg-[#ececec]  px-3 py-5 rounded-md">
      <ul className="flex items-center justify-between">
        <li className="text-indigo-400 hover:text-indigo-600 duration-200 font-semibold text-lg">
          <NavLink to="/">Home</NavLink>
        </li>
        {userData ? (
          <div className="flex space-x-2 items-center">
            <li className="text-indigo-400 hover:text-indigo-600 duration-200 font-semibold text-lg">
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <button
              onClick={logout}
              className="px-2 py-1.5 focus:outline-none text-white duration-300 bg-red-700 hover:bg-red-800   font-medium rounded-lg text-sm  dark:bg-red-600 dark:hover:bg-red-700"
            >
              LogOut
            </button>
          </div>
        ) : (
          <p className="flex items-center space-x-3">
            <li className="text-indigo-400 hover:text-indigo-600 duration-200 font-semibold text-lg">
              <NavLink to="/register">Register</NavLink>
            </li>
            <li className="text-indigo-400 hover:text-indigo-600 duration-200 font-semibold text-lg">
              <NavLink to="/login">Login</NavLink>
            </li>
          </p>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
