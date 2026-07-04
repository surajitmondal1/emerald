const { AuthProvider, useAuth } = window.AuthContextModule;
const { HashRouter, Route, Redirect } = window.RouterModule;
const { SignIn } = window.SignInModule;
const { SignUp } = window.SignUpModule;
const { VerifyEmail } = window.VerifyEmailModule;
const { EmployeeDashboard } = window.EmployeeDashboardModule;
const { MyProfile } = window.MyProfileModule;
const { MyAttendance } = window.MyAttendanceModule;
const { MyLeave } = window.MyLeaveModule;
const { MyPayroll } = window.MyPayrollModule;
const { AdminDashboard } = window.AdminDashboardModule;
const { EmployeeList } = window.EmployeeListModule;
const { EmployeeDetail } = window.EmployeeDetailModule;
const { AttendanceOverview } = window.AttendanceOverviewModule;
const { LeaveApprovals } = window.LeaveApprovalsModule;
const { PayrollManagement } = window.PayrollManagementModule;
const { ProtectedRoute } = window.ProtectedRouteModule;

function App() {
  const { Provider } = window.ReactRedux;
  return (
    <Provider store={window.store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-secondary min-h-screen bg-base flex items-center justify-center">Loading session...</div>;

  return (
    <HashRouter>
      <Route path="#/login">
        {user ? <Redirect to={user.role === 'HR' ? '#/admin/dashboard' : '#/employee/dashboard'} /> : <SignIn />}
      </Route>

      <Route path="#/signup">
        {user ? <Redirect to={user.role === 'HR' ? '#/admin/dashboard' : '#/employee/dashboard'} /> : <SignUp />}
      </Route>

      <Route path="#/verify-email">
        {user ? <Redirect to={user.role === 'HR' ? '#/admin/dashboard' : '#/employee/dashboard'} /> : <VerifyEmail />}
      </Route>
      
      <Route path="#/employee/dashboard" exact>
        <ProtectedRoute allowedRoles={['EMPLOYEE']}>
          <EmployeeDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="#/employee/profile" exact>
        <ProtectedRoute allowedRoles={['EMPLOYEE']}>
          <MyProfile />
        </ProtectedRoute>
      </Route>

      <Route path="#/employee/attendance" exact>
        <ProtectedRoute allowedRoles={['EMPLOYEE']}>
          <MyAttendance />
        </ProtectedRoute>
      </Route>

      <Route path="#/employee/leave" exact>
        <ProtectedRoute allowedRoles={['EMPLOYEE']}>
          <MyLeave />
        </ProtectedRoute>
      </Route>

      <Route path="#/employee/payroll" exact>
        <ProtectedRoute allowedRoles={['EMPLOYEE']}>
          <MyPayroll />
        </ProtectedRoute>
      </Route>

      <Route path="#/admin/dashboard" exact>
        <ProtectedRoute allowedRoles={['HR']}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="#/admin/employees" exact>
        <ProtectedRoute allowedRoles={['HR']}>
          <EmployeeList />
        </ProtectedRoute>
      </Route>

      <Route path="#/admin/employees/:id" render={({match}) => (
        <ProtectedRoute allowedRoles={['HR']}>
          <EmployeeDetail employeeId={match.params.id} />
        </ProtectedRoute>
      )} />

      <Route path="#/admin/attendance" exact>
        <ProtectedRoute allowedRoles={['HR']}>
          <AttendanceOverview />
        </ProtectedRoute>
      </Route>

      <Route path="#/admin/leave" exact>
        <ProtectedRoute allowedRoles={['HR']}>
          <LeaveApprovals />
        </ProtectedRoute>
      </Route>

      <Route path="#/admin/payroll" exact>
        <ProtectedRoute allowedRoles={['HR']}>
          <PayrollManagement />
        </ProtectedRoute>
      </Route>
      
      <Route path="">
         <Redirect to={user ? (user.role === 'HR' ? '#/admin/dashboard' : '#/employee/dashboard') : "#/login"} />
      </Route>
    </HashRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
