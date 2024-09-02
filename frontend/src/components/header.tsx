import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import logo from "../assets/images/jenzieslogo.png";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Sign Out Fail");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the clicked element is outside the dialog
    if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener only when dialog is open
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    // Cleanup event listener when dialog is closed or component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-white header">
      {/* Logo aligned to the left with blend effect and better margin */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center ml-8">
          <img
            src={logo}
            alt="e"
            className="h-20 mix-blend-multiply object-contain rotate-90"
          />
        </Link>
      </div>

      {/* Icons aligned to the right with consistent spacing */}
      <div className="flex items-center space-x-6">
        <Link onClick={() => setIsOpen(false)} to={"/search"} className="text-xl">
          <FaSearch />
        </Link>
        <Link onClick={() => setIsOpen(false)} to={"/cart"} className="text-xl">
          <FaShoppingCart />
        </Link>

        {user?._id ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the button click from propagating to the document
                setIsOpen((prev) => !prev);
              }}
              className="text-xl"
            >
              <FaUser />
            </button>
            <dialog
              ref={dialogRef}
              open={isOpen}
              onClick={(e) => e.stopPropagation()} // Prevent click inside dialog from closing it
              className="fixed top-16 right-4 bg-white text-black p-4 rounded shadow-lg"
            >
              <div className="space-y-2">
                {user.role === "admin" && (
                  <Link
                    onClick={() => setIsOpen(false)}
                    to="/admin/dashboard"
                    className="block"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/orders"
                  className="block"
                >
                  Orders
                </Link>
                <button
                  onClick={logoutHandler}
                  className="flex items-center space-x-2 text-red-500"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <Link to={"/login"} className="text-xl">
            <FaSignInAlt />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
