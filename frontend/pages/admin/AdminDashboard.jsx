window.AdminDashboardModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState } = React;

  const AdminDashboard = () => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [employees, setEmployees] = useState([]);

    React.useEffect(() => {
      const loadEmployees = async () => {
        const res = await window.employeeService.listEmployees();
        if (res.success) {
          setEmployees(res.data);
        }
      };
      loadEmployees();
    }, []);

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
              {employees.filter(u => u.role !== 'HR' && u.role !== 'ADMIN').map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.employeeId})</option>
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
            <div className="text-4xl font-manrope font-bold tracking-tight">{employees.length}</div>
            <div className="text-xs text-status-present mt-2">Active employees</div>
          </div>
          <div className="card rounded-xl p-6 border-t-2 border-t-status-present">
            <h3 className="text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Present Today</h3>
            <div className="text-4xl font-manrope font-bold tracking-tight">-</div>
            <div className="text-xs text-secondary mt-2">Data not available</div>
          </div>
          <div className="card rounded-xl p-6 border-t-2 border-t-status-pending">
            <h3 className="text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Pending Leaves</h3>
            <div className="text-4xl font-manrope font-bold tracking-tight">0</div>
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
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-secondary">
                      No recent attendance data.
                    </td>
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
            <div className="card rounded-xl overflow-hidden p-8 text-center text-secondary">
               No pending leave requests.
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  };

  return { AdminDashboard };
})();
