import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const AmPm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes}:${AmPm}`);

      const options = { month: "short", dat: "mumeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <header className="absolute top-0 bg-white w-full py-4 px-6 left-0 shadow-md flex items-center justify-between">
        {/* left side  */}
        <div className="flex items-center gap-2">
          <img src={userIcon} alt="icon" className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
              {user?.name}
            </span>
            <span className="text-sm font-medium sm:text-lg sm:font-medium">
              {user?.role}
            </span>
          </div>
        </div>
        {/* right side  */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex flex-col text-sm lg:text-base items-end font-semibold">
            <span>{currentTime}</span>
            <span>{currentDate}</span>
          </div>
          <span className="bg-black h-14 w-[1px]" />
          <img
            src={settingIcon}
            alt="icon"
            className="w-8 h-8 cursor-pointer"
            onClick={() => dispatch(toggleSettingPopup())}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
