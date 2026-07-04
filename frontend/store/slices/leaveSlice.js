window.LeaveSliceModule = (() => {
  const { createSlice } = window.RTK;

  const initialState = {
    leaveRequests: [],
    loading: false,
    error: null,
  };

  const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setLeaveRequests: (state, action) => {
        state.leaveRequests = action.payload;
        state.error = null;
      },
      addLeaveRequest: (state, action) => {
        state.leaveRequests.unshift(action.payload);
      },
      updateLeaveStatus: (state, action) => {
        const { id, status } = action.payload;
        const index = state.leaveRequests.findIndex(req => req.id === id);
        if (index !== -1) {
          state.leaveRequests[index].status = status;
        }
      },
      setError: (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }
    },
  });

  return { 
    leaveReducer: leaveSlice.reducer, 
    leaveActions: leaveSlice.actions 
  };
})();
