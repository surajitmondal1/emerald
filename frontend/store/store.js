window.StoreModule = (() => {
  const { configureStore } = window.RTK;
  
  // Extract reducers from slice modules
  const { authReducer } = window.AuthSliceModule;
  const { employeeReducer } = window.EmployeeSliceModule;
  const { attendanceReducer } = window.AttendanceSliceModule;
  const { leaveReducer } = window.LeaveSliceModule;
  const { payrollReducer } = window.PayrollSliceModule;

  const store = configureStore({
    reducer: {
      auth: authReducer,
      employee: employeeReducer,
      attendance: attendanceReducer,
      leave: leaveReducer,
      payroll: payrollReducer,
    },
    // RTK enables Redux DevTools by default
  });

  // Attach store to window for ReactRedux.Provider
  window.store = store;

  return { store };
})();
