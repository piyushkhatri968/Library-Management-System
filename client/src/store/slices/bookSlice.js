import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Frontend_URL } from "./../../../config.js";
import { toggleAddBookPopup } from "./popUpSlice.js";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },
  reducers: {
    fetchBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBookSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    // -------------------------------------
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // -------------------------------------
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBookRequest());
  await axios
    .get(`${Frontend_URL}/book/all`, { withCredentials: true })
    .then((res) => {
      dispatch(bookSlice.actions.fetchBookSuccess(res.data.books));
    })
    .catch((err) => {
      dispatch(bookSlice.actions.fetchBookFailed(err.response.data.message));
    });
};

export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  await axios
    .post(`${Frontend_URL}/book/admin/add`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(bookSlice.actions.addBookSuccess(res.data.message));
      dispatch(toggleAddBookPopup());
    })
    .catch((err) => {
      dispatch(bookSlice.actions.addBookFailed(err.response.data.message));
    });
};

export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;
