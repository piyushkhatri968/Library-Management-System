import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Sidebar from "./../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState("");

  console.log();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
        <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white cursor-pointer">
          <GiHamburgerMenu
            className="text-2xl "
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
        <Sidebar
          isSideBarOpen={isSidebarOpen}
          setIsSideBarOpen={setIsSidebarOpen}
          setSelectedComponent={setSelectedComponents}
        />
        {(() => {
          switch (selectedComponents) {
            case "Dashboard":
              return user?.role === "User" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard />
              );
              break;
            case "Books":
              return <BookManagement />;
              break;
            case "Catalog":
              if (user?.role === "Admin") {
                return <Catalog />;
              }
              break;
            case "Users":
              if (user?.role === "Admin") {
                return <Users />;
              }
              break;
            case "My Borrowed Books":
              return <MyBorrowedBooks />;
              break;
            default:
              return user?.role === "User" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard />
              );
              break;
          }
        })()}
      </div>
    </>
  );
};

export default Home;
