window.AttendanceSliceModule = (() => {
  const { createSlice } = window.RTK;

  const initialState = {
    records: [],
    overview: null,
    loading: false,
    error: null,
  };

  const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setAttendanceRecords: (state, action) => {
        state.records = action.payload;
        state.error = null;
      },
      setOverview: (state, action) => {
        state.overview = action.payload;
      },
      clockIn: (state, action) => {
        state.records.unshift(action.payload);
      },
      clockOut: (state, action) => {
        const index = state.records.findIndex(record => record.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      },
      setError: (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }
    },
  });

  return { 
    attendanceReducer: attendanceSlice.reducer, 
    attendanceActions: attendanceSlice.actions 
  };
})();
