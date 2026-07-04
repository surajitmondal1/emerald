window.AdminDashboardModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState } = React;

  const AdminDashboard = () => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

    const handleEmployeeJump = (e) => {
      e.preventDefault();
      if (selectedEmployeeId) {
        window.location.hash = `#/admin/employees/${selectedEmployeeId}`;
      }
    };

    return (
      <DashboardLayout>
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-manrope font-bold text-primary">HR Overview</h1>
            <p className="text-secondary mt-1">Company-wide metrics and pending actions.</p>
          </div>
          
          <form onSubmit={handleEmployeeJump} className="flex gap-2">
            <select 
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
              className="bg-base border border-subtle rounded-lg px-4 py-2 text-sm text-primary focus:outline-none focus:border-accent"
            >
              <option value="">Jump to employee...</option>
              {window.mockData.users.filter(u => u.role === 'EMPLOYEE').map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
              ))}
            </select>
            <button type="submit" className="bg-surface-raised border border-subtle px-4 py-2 rounded-lg text-sm hover:text-accent transition-colors">
              Go
            </button>
          </form>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card rounded-xl p-6 border-t-2 border-t-accent">
            <h3 className="text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Total Headcount</h3>
            <div className="text-4xl font-manrope font-bold tracking-tight">42</div>
            <div className="text-xs text-status-present mt-2">+2 this month</div>
          </div>
          <div className="card rounded-xl p-6 border-t-2 border-t-status-present">
            <h3 className="text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Present Today</h3>
            <div className="text-4xl font-manrope font-bold tracking-tight">38</div>
            <div className="text-xs text-secondary mt-2">90% attendance rate</div>
          </div>
          <div className="card rounded-xl p-6 border-t-2 border-t-status-pending">
            <h3 className="text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Pending Leaves</h3>
            <div className="text-4xl font-manrope font-bold tracking-tight">5</div>
            <a href="#/admin/leave" className="text-xs text-accent mt-2 cursor-pointer hover:underline block">Review requests &rarr;</a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-manrope text-xl font-bold">Recent Attendance</h3>
              <a href="#/admin/attendance" className="text-sm text-accent hover:underline">View all</a>
            </div>
            <div className="card rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-raised border-b border-subtle text-secondary text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-medium">Employee</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Time In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle">
                  <tr className="hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">Surajit Mondal</td>
                    <td className="px-4 py-3"><span className="text-xs bg-status-present/10 text-status-present px-2 py-1 rounded border border-status-present/20">Present</span></td>
                    <td className="px-4 py-3 text-secondary">09:02 AM</td>
                  </tr>
                  <tr className="hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">Sibsankar Maity</td>
                    <td className="px-4 py-3"><span className="text-xs bg-status-absent/10 text-status-absent px-2 py-1 rounded border border-status-absent/20">Absent</span></td>
                    <td className="px-4 py-3 text-secondary">--</td>
                  </tr>
                  <tr className="hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">Surajit Samanta</td>
                    <td className="px-4 py-3"><span className="text-xs bg-status-pending/10 text-status-pending px-2 py-1 rounded border border-status-pending/20">Half-day</span></td>
                    <td className="px-4 py-3 text-secondary">01:15 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-4">
              <h3 className="font-manrope text-xl font-bold">Leave Approvals</h3>
              <a href="#/admin/leave" className="text-sm text-accent hover:underline">View all</a>
            </div>
            <div className="card rounded-xl overflow-hidden">
              <div className="divide-y divide-subtle">
                <div className="p-4 hover:bg-surface-raised transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-primary text-sm">Sujan Bhowmik</div>
                      <div className="text-xs text-secondary">Annual Leave (3 days)</div>
                    </div>
                    <span className="text-xs bg-status-pending/10 text-status-pending px-2 py-1 rounded border border-status-pending/20">Pending</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 bg-status-present text-base text-xs font-semibold py-1.5 rounded hover:opacity-90 text-base" style={{color: '#0A0A0B'}}>Approve</button>
                    <button className="flex-1 border border-status-absent text-status-absent text-xs font-semibold py-1.5 rounded hover:bg-status-absent/10">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  };

  return { AdminDashboard };
})();
