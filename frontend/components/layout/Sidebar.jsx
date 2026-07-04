window.SidebarModule = (() => {
  const { useAuth } = window.AuthContextModule;

  const Sidebar = () => {
    const { user, logout } = useAuth();
    const currentHash = window.location.hash || '#/';

    const employeeLinks = [
      { name: 'Dashboard', path: '#/employee/dashboard', icon: 'layout-dashboard' },
      { name: 'My Profile', path: '#/employee/profile', icon: 'user' },
      { name: 'Attendance', path: '#/employee/attendance', icon: 'clock' },
      { name: 'Leave', path: '#/employee/leave', icon: 'calendar' },
      { name: 'Payroll', path: '#/employee/payroll', icon: 'file-text' }
    ];

    const adminLinks = [
      { name: 'Dashboard', path: '#/admin/dashboard', icon: 'layout-dashboard' },
      { name: 'Employees', path: '#/admin/employees', icon: 'users' },
      { name: 'Attendance', path: '#/admin/attendance', icon: 'clock' },
      { name: 'Leave Approvals', path: '#/admin/leave', icon: 'check-square' },
      { name: 'Payroll Control', path: '#/admin/payroll', icon: 'dollar-sign' }
    ];

    const links = user?.role === 'HR' ? adminLinks : employeeLinks;

    const renderIcon = (iconName) => {
      const svgs = {
        'layout-dashboard': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>,
        'user': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
        'clock': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
        'calendar': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
        'file-text': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
        'users': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
        'check-square': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
        'dollar-sign': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      };
      return svgs[iconName] || svgs['layout-dashboard'];
    };

    return (
      <aside className="w-64 bg-surface border-r border-subtle h-screen flex flex-col fixed left-0 top-0">
        <div className="h-20 flex items-center px-6 border-b border-subtle">
          <h1 className="text-2xl font-manrope font-bold text-primary">Emerald</h1>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {links.map(link => {
            const isActive = currentHash === link.path || (link.path !== '#/admin/dashboard' && link.path !== '#/employee/dashboard' && currentHash.startsWith(link.path));
            return (
              <a 
                key={link.path}
                href={link.path}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-accent bg-accent-soft' 
                    : 'text-secondary hover:text-primary hover:bg-surface-raised'
                }`}
              >
                <div className="mr-3">{renderIcon(link.icon)}</div>
                {link.name}
              </a>
            );
          })}
        </nav>
        <div className="p-4 border-t border-subtle space-y-1">
          <button onClick={logout} className="w-full flex items-center px-3 py-2 text-sm text-secondary hover:text-status-absent hover:bg-status-absent/10 rounded-lg transition-colors font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign Out
          </button>
          <div className="flex items-center px-3 py-2 text-sm text-secondary">
            <span className="w-2 h-2 rounded-full bg-status-present mr-2"></span>
            System Online
          </div>
        </div>
      </aside>
    );
  };

  return { Sidebar };
})();
