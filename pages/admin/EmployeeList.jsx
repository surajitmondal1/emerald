window.EmployeeListModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState, useEffect } = React;

  const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEmp, setNewEmp] = useState({ name: '', email: '', role: 'EMPLOYEE', designation: '', department: '', basic: '50000' });
    const [creating, setCreating] = useState(false);
    const [createdCreds, setCreatedCreds] = useState(null);

    useEffect(() => {
      loadEmployees();
    }, [search]);

    const loadEmployees = async () => {
      setLoading(true);
      const res = await window.employeeService.listEmployees({ search });
      if (res.success) {
        setEmployees(res.data);
      }
      setLoading(false);
    };

    const handleCreate = async (e) => {
      e.preventDefault();
      setCreating(true);
      const res = await window.employeeService.createEmployee(newEmp);
      setCreating(false);
      if (res.success) {
        setCreatedCreds({ id: res.data.id, password: res.data.password });
        setNewEmp({ name: '', email: '', role: 'EMPLOYEE', designation: '', department: '', basic: '50000' });
        loadEmployees();
      }
    };

    return (
      <DashboardLayout>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-manrope font-bold text-primary">Employees</h1>
            <p className="text-secondary mt-1">Manage personnel and roles.</p>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-surface border border-subtle rounded-lg px-4 py-2 text-sm text-primary focus:outline-none focus:border-accent w-64"
            />
            <button onClick={() => setShowAddModal(true)} className="bg-accent text-base px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Add Employee
            </button>
          </div>
        </div>

        <div className="card rounded-xl overflow-hidden min-h-[400px]">
          {loading ? (
             <div className="p-8 text-center text-secondary">Loading employees...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised border-b border-subtle text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-surface-raised transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.profilePicture} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-medium text-primary">{emp.name}</div>
                          <div className="text-xs text-secondary">{emp.id} &bull; {emp.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary">{emp.role}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded border ${emp.status === 'ACTIVE' ? 'bg-status-present/10 text-status-present border-status-present/20' : 'bg-status-absent/10 text-status-absent border-status-absent/20'}`}>
                        {emp.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a href={`#/admin/employees/${emp.id}`} className="text-accent hover:underline text-xs font-medium">Manage</a>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-secondary">No employees found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-base/80 flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-subtle">
              <div className="flex justify-between items-center p-6 border-b border-subtle">
                <h3 className="font-manrope text-xl font-bold text-primary">Add New Employee</h3>
                <button onClick={() => {setShowAddModal(false); setCreatedCreds(null);}} className="text-secondary hover:text-primary">&times;</button>
              </div>
              
              <div className="p-6">
                {createdCreds ? (
                  <div className="bg-status-present/10 border border-status-present/30 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-status-present text-base rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h4 className="text-lg font-bold text-primary mb-2">Employee Created Successfully!</h4>
                    <p className="text-secondary text-sm mb-6">Please securely share these credentials with the employee.</p>
                    <div className="bg-base border border-subtle rounded p-4 text-left space-y-2 inline-block w-full max-w-xs">
                       <div className="flex justify-between"><span className="text-secondary">Login ID:</span> <span className="font-mono font-bold text-accent">{createdCreds.id}</span></div>
                       <div className="flex justify-between"><span className="text-secondary">Password:</span> <span className="font-mono font-bold text-primary">{createdCreds.password}</span></div>
                    </div>
                    <button onClick={() => {setShowAddModal(false); setCreatedCreds(null);}} className="mt-6 w-full bg-surface-raised border border-subtle py-2 rounded-lg font-semibold hover:text-accent transition-colors">Done</button>
                  </div>
                ) : (
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-secondary text-xs font-medium mb-1">Full Name</label>
                        <input type="text" required value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-primary focus:border-accent outline-none" />
                      </div>
                      <div>
                        <label className="block text-secondary text-xs font-medium mb-1">Email</label>
                        <input type="email" required value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-primary focus:border-accent outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-secondary text-xs font-medium mb-1">Department</label>
                        <input type="text" required value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-primary focus:border-accent outline-none" />
                      </div>
                      <div>
                        <label className="block text-secondary text-xs font-medium mb-1">Designation</label>
                        <input type="text" required value={newEmp.designation} onChange={e => setNewEmp({...newEmp, designation: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-primary focus:border-accent outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-secondary text-xs font-medium mb-1">Role</label>
                        <select value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-primary focus:border-accent outline-none">
                          <option value="EMPLOYEE">Employee</option>
                          <option value="HR">HR Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-secondary text-xs font-medium mb-1">Basic Salary (₹)</label>
                        <input type="number" required value={newEmp.basic} onChange={e => setNewEmp({...newEmp, basic: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-primary focus:border-accent outline-none" />
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                      <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg font-medium text-secondary hover:bg-surface-raised transition-colors">Cancel</button>
                      <button type="submit" disabled={creating} className="px-4 py-2 bg-accent text-base rounded-lg font-medium hover:opacity-90 disabled:opacity-50">{creating ? 'Generating ID...' : 'Create Employee'}</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  };

  return { EmployeeList };
})();
