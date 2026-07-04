window.TopbarModule = (() => {
  const { useAuth } = window.AuthContextModule;
  const { useState } = React;

  const Topbar = () => {
    const { user, logout } = useAuth();
    const [showNotif, setShowNotif] = useState(false);
    const activities = window.mockData?.activities || [];
    const unreadCount = activities.filter(a => a.unread).length;
    const currentHash = window.location.hash || '#/';
    
    const pageTitle = (() => {
      if (currentHash.includes('dashboard')) return 'Dashboard';
      if (currentHash.includes('profile')) return 'My Profile';
      if (currentHash.includes('attendance')) return 'Attendance';
      if (currentHash.includes('leave')) return 'Leave Management';
      if (currentHash.includes('payroll')) return 'Payroll';
      if (currentHash.includes('employees')) return 'Employees';
      return 'Emerald HRMS';
    })();

    return (
      <header className="h-20 bg-base border-b border-subtle flex items-center justify-between px-8 ml-64 fixed top-0 right-0 left-0 z-10">
        <h2 className="text-xl font-manrope font-semibold text-primary">{pageTitle}</h2>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 text-secondary hover:text-primary transition-colors focus:outline-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-status-absent rounded-full border-2 border-base"></span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-12 w-80 bg-surface-raised border border-subtle rounded-xl shadow-2xl z-50 animate-fade-in overflow-hidden">
                <div className="p-4 border-b border-subtle flex justify-between items-center">
                  <h3 className="font-semibold text-primary">Notifications</h3>
                  <span className="text-xs text-accent cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {activities.map(a => (
                    <div key={a.id} className={`p-4 border-b border-subtle/50 hover:bg-base/50 transition-colors cursor-pointer ${a.unread ? 'bg-accent/5' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${a.unread ? 'text-primary' : 'text-secondary'}`}>{a.title}</span>
                        <span className="text-[10px] text-secondary whitespace-nowrap ml-2">{a.time}</span>
                      </div>
                      <p className="text-xs text-secondary leading-relaxed">{a.desc}</p>
                    </div>
                  ))}
                  {activities.length === 0 && <div className="p-6 text-center text-secondary text-sm">No new notifications</div>}
                </div>
              </div>
            )}
          </div>
          <div className="h-6 w-px bg-subtle"></div>
          <div className="text-right">
            <div className="text-sm font-semibold text-primary">{user?.name}</div>
            <div className="text-xs text-secondary">{user?.designation}</div>
          </div>
          <div className="relative cursor-pointer group pb-2">
             {user?.profilePicture ? (
               <img src={user?.profilePicture} alt="Profile" className="w-10 h-10 rounded-full border border-subtle object-cover" />
             ) : (
               <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-manrope font-bold text-sm" style={{ color: '#0A0A0B' }}>
                 {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
               </div>
             )}
             <div className="absolute right-0 top-10 mt-2 w-48 bg-surface-raised border border-subtle rounded-lg shadow-2xl hidden group-hover:block p-2 z-50 animate-fade-in">
                <a href="#/employee/profile" className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-base rounded mb-1 transition-colors">Profile settings</a>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-status-absent hover:bg-base rounded transition-colors">Sign Out</button>
             </div>
          </div>
        </div>
      </header>
    );
  };

  return { Topbar };
})();
