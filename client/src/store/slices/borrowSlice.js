import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Frontend_URL } from "./../../../config.js";
import { toggleRecordBookPopup } from "./popUpSlice.js";
import { toast } from "react-toastify";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    message: null,
    userBorrowedBooks: [],
    allborrowedBooks: [],
  },
  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = null;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // -------------------------------------
    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    recordBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    // -------------------------------------
    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = null;
      state.allborrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // -------------------------------------
    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  await axios
    .get(`${Frontend_URL}/borrow/my-borrowed-books`, { withCredentials: true })
    .then((res) => {
      dispatch(
        borrowSlice.actions.fetchUserBorrowedBooksSuccess(
          res.data.borrowedBooks
        )
      );
    })
    .catch((err) => {
      dispatch(
        borrowSlice.actions.fetchUserBorrowedBooksFailed(
          err.response.data.message
        )
      );
    });
};

export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  await axios
    .get(`${Frontend_URL}/borrow/borrowed-books-by-users`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(
        borrowSlice.actions.fetchAllBorrowedBooksSuccess(res.data.borrowedBooks)
      );
    })
    .catch((err) => {
      dispatch(
        borrowSlice.actions.fetchAllBorrowedBooksFailed(
          err.response.data.message
        )
      );
    });
};

export const recordBorrowBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  await axios
    .post(
      `${Frontend_URL}/borrow/record-borrow-book/${id}`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
      dispatch(toggleRecordBookPopup())
    })
    .catch((err) => {
      dispatch(borrowSlice.actions.recordBookFailed(err.response.data.message));
      toast.error(err.response.data.message)
    });
};

export const returnBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  await axios
    .put(
      `${Frontend_URL}/borrow/return-borrowed-book/${id}`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
    })
    .catch((err) => {
      dispatch(borrowSlice.actions.returnBookFailed(err.response.data.message));
    });
};

export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer;
