import React, { useState } from "react";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../store/slices/authSlice";
import settingIcon from "../assets/setting.png";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
const SettingPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("currentPassword", currentPassword);
    data.append("newPassword", newPassword);
    data.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword(data));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg sm:w-auto lg:w-1/2 2xl:w-1/3">
        <div className="p-6 ">
          <header className="flex justify-between items-center mb-7 pb-5 border-b-[1px] border-black">
            <div className="flex items-center gap-3">
              <img
                src={settingIcon}
                alt="icon"
                className="bg-gray-300 p-5 rounded-lg"
              />
              <h3 className="text-xl font-bold">Change Credentials</h3>
            </div>
            <img
              src={closeIcon}
              alt="icon"
              onClick={() => dispatch(toggleSettingPopup())}
              className="cursor-pointer"
            />
          </header>

          <form onSubmit={handleUpdatePassword}>
            <div className="mb-4 sm:flex gap-4 items-center">
              <label className="block text-gray-900 font-medium w-full">
                Enter Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4 sm:flex gap-4 items-center">
              <label className="block text-gray-900 font-medium w-full">
                Enter New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4 sm:flex gap-4 items-center">
              <label className="block text-gray-900 font-medium w-full">
                Enter Confirm New Password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-4 mt-10">
              <button
                type="button"
                onClick={() => dispatch(toggleSettingPopup())}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-black rounded-md hover:bg-gray-800 text-white"
              >
                CONFIRM
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;
