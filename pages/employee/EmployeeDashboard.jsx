window.EmployeeDashboardModule = (() => {
  const { useAuth } = window.AuthContextModule;
  const { DashboardLayout } = window.DashboardLayoutModule;

  const EmployeeDashboard = () => {
    const { user } = useAuth();

    return (
      <DashboardLayout>
        <div className="mb-10">
          <h1 className="text-3xl font-manrope font-bold text-primary">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-secondary mt-1">Here is what's happening today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <a href="#/employee/profile" className="card rounded-xl p-6 hover:bg-surface-raised transition-colors group cursor-pointer relative overflow-hidden block">
            <h3 className="font-manrope text-lg font-semibold mb-1 group-hover:text-accent transition-colors">My Profile</h3>
            <p className="text-secondary text-xs">View and edit personal info</p>
            <div className="mt-4 text-accent text-sm font-medium flex justify-between items-center">
              Go to Profile 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </a>
          <a href="#/employee/attendance" className="card rounded-xl p-6 hover:bg-surface-raised transition-colors group cursor-pointer block">
            <h3 className="font-manrope text-lg font-semibold mb-1 group-hover:text-accent transition-colors">Attendance</h3>
            <p className="text-secondary text-xs">Check in/out and view history</p>
            <div className="mt-4 text-accent text-sm font-medium flex justify-between items-center">
              View Attendance 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </a>
          <a href="#/employee/leave" className="card rounded-xl p-6 hover:bg-surface-raised transition-colors group cursor-pointer block">
            <h3 className="font-manrope text-lg font-semibold mb-1 group-hover:text-accent transition-colors">Leave</h3>
            <p className="text-secondary text-xs">Apply for time off and check balance</p>
            <div className="mt-4 text-accent text-sm font-medium flex justify-between items-center">
              Manage Leave 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </a>
          <div className="card rounded-xl p-6 hover:bg-surface-raised transition-colors group cursor-pointer border-status-absent/30" onClick={() => window.location.hash = '#/login'}>
             <h3 className="font-manrope text-lg font-semibold mb-1 text-status-absent">Log Out</h3>
             <p className="text-secondary text-xs">End your session securely</p>
          </div>
        </div>

        <h3 className="font-manrope text-xl font-bold mb-4">Recent Activity</h3>
        <div className="card rounded-xl overflow-hidden">
          <div className="divide-y divide-subtle">
            <div className="p-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
              <div>
                <div className="font-medium text-primary text-sm">Clocked In</div>
                <div className="text-xs text-secondary mt-0.5">Today at 09:02 AM</div>
              </div>
              <span className="text-xs bg-status-present/10 text-status-present px-2 py-1 rounded border border-status-present/20">Success</span>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
              <div>
                <div className="font-medium text-primary text-sm">Leave Request Approved</div>
                <div className="text-xs text-secondary mt-0.5">Sick Leave (Jul 2 - Jul 3)</div>
              </div>
              <span className="text-xs bg-status-present/10 text-status-present px-2 py-1 rounded border border-status-present/20">Approved</span>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
              <div>
                <div className="font-medium text-primary text-sm">Payslip Generated</div>
                <div className="text-xs text-secondary mt-0.5">June 2026</div>
              </div>
              <span className="text-xs bg-accent-soft text-accent px-2 py-1 rounded border border-accent/20">New</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  };

  return { EmployeeDashboard };
})();
