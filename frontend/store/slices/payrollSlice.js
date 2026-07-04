window.PayrollSliceModule = (() => {
  const { createSlice } = window.RTK;

  const initialState = {
    salaryRecords: [],
    loading: false,
    error: null,
  };

  const payrollSlice = createSlice({
    name: 'payroll',
    initialState,
    reducers: {
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setSalaryRecords: (state, action) => {
        state.salaryRecords = action.payload;
        state.error = null;
      },
      generatePayroll: (state, action) => {
        // Assume action.payload is an array of newly generated payroll records
        state.salaryRecords = [...action.payload, ...state.salaryRecords];
      },
      setError: (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }
    },
  });

  return { 
    payrollReducer: payrollSlice.reducer, 
    payrollActions: payrollSlice.actions 
  };
})();
