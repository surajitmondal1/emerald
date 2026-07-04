window.EmployeeSliceModule = (() => {
  const { createSlice } = window.RTK;

  const initialState = {
    employees: [],
    currentEmployee: null,
    loading: false,
    error: null,
  };

  const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setEmployees: (state, action) => {
        state.employees = action.payload;
        state.error = null;
      },
      setCurrentEmployee: (state, action) => {
        state.currentEmployee = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }
    },
  });

  return { 
    employeeReducer: employeeSlice.reducer, 
    employeeActions: employeeSlice.actions 
  };
})();
