import React from "react";
import { useDispatch } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";

const ReadBookPopup = ({ book }) => {
  const dispatch = useDispatch();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-lg shadow-lg sm:w-1/2 lg:w-1/3">
        <div className="flex justify-between items-center bg-black text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-bold">View Book Info</h2>
          <button
            onClick={() => dispatch(toggleReadBookPopup())}
            className="text-white text-lg font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Book Title
            </label>
            <p className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
              {book && book.title}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Author</label>
            <p className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
              {book && book.author}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Description
            </label>
            <p className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
              {book && book.description}
            </p>
          </div>
        </div>
        <div className="flex justify-end px-6 py-4 bg-gray-100 rounded-b-lg">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            type="button"
            onClick={() => dispatch(toggleReadBookPopup())}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadBookPopup;
