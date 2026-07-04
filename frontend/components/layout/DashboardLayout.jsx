window.DashboardLayoutModule = (() => {
  const { Sidebar } = window.SidebarModule;
  const { Topbar } = window.TopbarModule;

  const DashboardLayout = ({ children }) => {
    return (
      <div className="min-h-screen bg-base text-primary">
        <Sidebar />
        <Topbar />
        <main className="ml-64 pt-20 p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  };

  return { DashboardLayout };
})();
