import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Frontend_URL } from "../../config";
import { fetchAllUsers } from "../store/slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);
  const formatData = (timeStamp) => {
    const date = new Date(timeStamp);
    const formatedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;

    const formatedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    const result = `${formatedDate} ${formatedTime}`;
    return result;
  };

  const [userID, setUserID] = useState("");

  const handleDeleteModel = (userId) => {
    setDeleteModelOpen(true);
    setUserID(userId);
  };

  const deleteUser = async () => {
    try {
      const res = await axios.delete(`${Frontend_URL}/user/delete/${userID}`, {
        withCredentials: true,
      });
      dispatch(fetchAllUsers());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data.message || "Unknown error occurred.");
      console.log(error);
    }
  };
  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Registered Users
          </h2>
        </header>
        {/* Table */}
        {users && users.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg text-sm sm:text-base">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">NAME</th>
                  <th className="px-4 py-2 text-left">EMAIL</th>
                  <th className="px-4 py-2 text-left">ROLE</th>
                  <th className="px-4 py-2 text-left">No. of Books Borrowed</th>
                  <th className="px-4 py-2 text-left">Registered On</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        user.role === "Admin"
                          ? "text-green-700"
                          : "text-blue-700"
                      }`}
                    >
                      {user.role}
                    </td>
                    <td className="px-4 py-2">{user?.borrowedBooks?.length}</td>
                    <td className="px-4 py-2">{formatData(user.createdAt)}</td>
                    <td className="px-4 py-2">
                      <Trash2
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteModel(user._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-xl mt-5 font-medium">
            No registered users found in library.
          </h3>
        )}
      </main>
      {deleteModelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
          <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3 p-6 h-64 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold">
              Are you sure you want to delete this user?
            </h2>
            <div className="flex gap-4 mt-4 items-center justify-center">
              <button
                onClick={() => setDeleteModelOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUser(userID);
                  setDeleteModelOpen(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
