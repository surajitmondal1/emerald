window.AuthSliceModule = (() => {
  const { createSlice } = window.RTK;

  const initialState = {
    user: null,
    loading: false,
    error: null,
  };

  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      loginStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      loginSuccess: (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      },
      loginFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      logout: (state) => {
        state.user = null;
      },
    },
  });

  return { 
    authReducer: authSlice.reducer, 
    authActions: authSlice.actions 
  };
})();
