import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Frontend_URL } from "./../../../config.js";
import { toast } from "react-toastify";

const authSLice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    //----------------------------------------
    OtpVerificationRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    OtpVerificationSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    OtpVerificationFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    //----------------------------------------
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    //---------------------------------
    logoutRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    //----------------------------------
    getUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    //----------------------------------
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    //----------------------------------
    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    resetPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    //----------------------------------
    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    //----------------------------------
    resetAuthSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.user = state.user;
      state.isAuthenticated = state.isAuthenticated;
    },
  },
});

export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSLice.actions.resetAuthSlice());
};

export const register = (data) => async (dispatch) => {
  dispatch(authSLice.actions.registerRequest());
  await axios
    .post(`${Frontend_URL}/auth/register`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(authSLice.actions.registerSuccess(res.data));
    })
    .catch((error) => {
      dispatch(authSLice.actions.registerFailed(error.response.data.message));
    });
};

//------------------------------

export const OtpVerification = (email, otp) => async (dispatch) => {
  dispatch(authSLice.actions.OtpVerificationRequest());
  await axios
    .post(
      `${Frontend_URL}/auth/verify-otp`,
      { email, otp },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(authSLice.actions.OtpVerificationSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSLice.actions.OtpVerificationFailed(error.response.data.message)
      );
    });
};

//------------------------------

export const login = (data) => async (dispatch) => {
  dispatch(authSLice.actions.loginRequest());
  await axios
    .post(`${Frontend_URL}/auth/login`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(authSLice.actions.loginSuccess(res.data));
    })
    .catch((error) => {
      dispatch(authSLice.actions.loginFailed(error.response.data.message));
    });
};

//------------------------------

// export const logout = () => async (dispatch) => {
//   dispatch(authSLice.actions.logoutRequest());
//   await axios
//     .get(`${Frontend_URL}/auth/logout`, {
//       withCredentials: true,
//     })
//     .then((res) => {
//       dispatch(authSLice.actions.logoutSuccess(res.data.message));
//       dispatch(authSLice.actions.resetAuthSlice());
//     })
//     .catch((error) => {
//       dispatch(authSLice.actions.logoutFailed(error.response.data.message));
//     });
// };

export const logout = () => async (dispatch) => {
  dispatch(authSLice.actions.logoutRequest());
  try {
    const response = await axios.get(`${Frontend_URL}/auth/logout`, {
      withCredentials: true,
    });
    dispatch(authSLice.actions.logoutSuccess(response.data.message));
    dispatch(authSLice.actions.resetAuthSlice());

    // Force clear client-side storage (just in case)
    localStorage.clear();
    sessionStorage.clear();

    // Redirect after successful logout
    window.location.href = "/login"; // Full page reload to clear state
  } catch (error) {
    dispatch(
      authSLice.actions.logoutFailed(
        error.response?.data?.message || "Logout failed"
      )
    );
  }
};

//------------------------------

export const getUser = () => async (dispatch) => {
  dispatch(authSLice.actions.getUserRequest());
  await axios
    .get(`${Frontend_URL}/auth/me`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(authSLice.actions.getUserSuccess(res.data));
    })
    .catch((error) => {
      dispatch(authSLice.actions.getUserFailed(error.response.data.message));
    });
};

//------------------------------

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authSLice.actions.forgotPasswordRequest());
  await axios
    .post(
      `${Frontend_URL}/auth/password/forgot`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(authSLice.actions.forgotPasswordSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSLice.actions.forgotPasswordFailed(error.response.data.message)
      );
    });
};

//------------------------------

export const resetPassword = (data, token) => async (dispatch) => {
  dispatch(authSLice.actions.resetPasswordRequest());
  await axios
    .put(`${Frontend_URL}/auth/password/reset/${token}`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(authSLice.actions.resetPasswordSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSLice.actions.resetPasswordFailed(error.response.data.message)
      );
    });
};

//------------------------------

export const updatePassword = (data) => async (dispatch) => {
  dispatch(authSLice.actions.updatePasswordRequest());
  await axios
    .put(`${Frontend_URL}/auth/password/update`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(authSLice.actions.updatePasswordSuccess(res.data.message));
    })
    .catch((error) => {
      dispatch(
        authSLice.actions.updatePasswordFailed(error.response.data.message)
      );
    });
};

export default authSLice.reducer;
