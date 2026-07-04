window.EmployeeDetailModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState, useEffect } = React;

  const EmployeeDetail = ({ employeeId }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      loadProfile();
    }, [employeeId]);

    const loadProfile = async () => {
      setLoading(true);
      const res = await window.employeeService.getEmployeeById(employeeId);
      if (res.success) {
        setProfile(res.data);
        setFormData({
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone,
            address: res.data.address,
            department: res.data.department,
            designation: res.data.designation,
            role: res.data.role,
            status: res.data.status,
            salaryBasic: res.data.salary?.basic || 0,
            salaryAllowances: res.data.salary?.allowances || 0,
            salaryDeductions: res.data.salary?.deductions || 0,
        });
      }
      setLoading(false);
    };

    const handleSave = async () => {
      setSaving(true);
      
      const payload = {};
      if (activeTab === 'personal') {
          payload.name = formData.name;
          payload.email = formData.email;
          payload.phone = formData.phone;
          payload.address = formData.address;
      } else if (activeTab === 'job') {
          payload.department = formData.department;
          payload.designation = formData.designation;
          payload.role = formData.role;
          payload.status = formData.status;
      } else if (activeTab === 'salary') {
          payload.salary = {
              basic: Number(formData.salaryBasic),
              allowances: Number(formData.salaryAllowances),
              deductions: Number(formData.salaryDeductions)
          };
      }

      const res = await window.employeeService.updateEmployeeById(employeeId, payload);
      if (res.success) {
        setProfile(res.data);
      }
      setSaving(false);
    };

    if (loading) return <DashboardLayout><div className="text-secondary">Loading employee...</div></DashboardLayout>;
    if (!profile) return <DashboardLayout><div className="text-status-absent">Employee not found.</div></DashboardLayout>;

    return (
      <DashboardLayout>
        <div className="mb-8 flex items-center gap-4">
          <a href="#/admin/employees" className="text-secondary hover:text-primary transition-colors flex items-center text-sm">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             Back
          </a>
          <h1 className="text-3xl font-manrope font-bold text-primary border-l border-subtle pl-4 ml-2">Edit Employee</h1>
        </div>

        <div className="flex gap-8">
          <div className="w-64 shrink-0">
            <div className="card rounded-xl p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full border-2 border-subtle" />
              </div>
              <h2 className="text-lg font-manrope font-bold text-primary">{profile.name}</h2>
              <p className="text-sm text-secondary mb-1">{profile.id}</p>
              <div className={`inline-block mt-2 px-3 py-1 border rounded-full text-xs font-semibold ${profile.status === 'ACTIVE' ? 'bg-status-present/10 text-status-present border-status-present/20' : 'bg-status-absent/10 text-status-absent border-status-absent/20'}`}>
                {profile.status || 'ACTIVE'}
              </div>
            </div>

            <div className="card rounded-xl mt-6 overflow-hidden">
              <button onClick={() => setActiveTab('personal')} className={`w-full text-left px-5 py-4 border-b border-subtle text-sm font-medium transition-colors ${activeTab==='personal' ? 'text-accent bg-accent-soft' : 'text-secondary hover:bg-surface-raised hover:text-primary'}`}>Personal Details</button>
              <button onClick={() => setActiveTab('job')} className={`w-full text-left px-5 py-4 border-b border-subtle text-sm font-medium transition-colors ${activeTab==='job' ? 'text-accent bg-accent-soft' : 'text-secondary hover:bg-surface-raised hover:text-primary'}`}>Job Details</button>
              <button onClick={() => setActiveTab('salary')} className={`w-full text-left px-5 py-4 text-sm font-medium transition-colors ${activeTab==='salary' ? 'text-accent bg-accent-soft' : 'text-secondary hover:bg-surface-raised hover:text-primary'}`}>Salary Structure</button>
            </div>
          </div>

          <div className="flex-1">
            <div className="card rounded-xl p-8 min-h-[400px]">
              
              {activeTab === 'personal' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-manrope font-bold text-primary">Personal Details</h3>
                    <button onClick={handleSave} disabled={saving} className="bg-accent text-base text-xs font-bold px-4 py-1.5 rounded disabled:opacity-50" style={{color: '#0A0A0B'}}>Save Changes</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Full Name</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary focus:border-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Email</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary focus:border-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Phone</label>
                      <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary focus:border-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Address</label>
                      <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary focus:border-accent outline-none h-20" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'job' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-manrope font-bold text-primary">Job Details</h3>
                    <button onClick={handleSave} disabled={saving} className="bg-accent text-base text-xs font-bold px-4 py-1.5 rounded disabled:opacity-50" style={{color: '#0A0A0B'}}>Save Changes</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Department</label>
                      <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary focus:border-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Designation</label>
                      <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary focus:border-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">System Role</label>
                      <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary focus:border-accent outline-none">
                          <option value="EMPLOYEE">Employee</option>
                          <option value="HR">HR Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary focus:border-accent outline-none">
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'salary' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-manrope font-bold text-primary">Salary Structure</h3>
                    <button onClick={handleSave} disabled={saving} className="bg-accent text-base text-xs font-bold px-4 py-1.5 rounded disabled:opacity-50" style={{color: '#0A0A0B'}}>Save Changes</button>
                  </div>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Basic Salary ($)</label>
                      <input type="number" value={formData.salaryBasic} onChange={e => setFormData({...formData, salaryBasic: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary font-manrope focus:border-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Allowances ($)</label>
                      <input type="number" value={formData.salaryAllowances} onChange={e => setFormData({...formData, salaryAllowances: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary font-manrope focus:border-accent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Deductions ($)</label>
                      <input type="number" value={formData.salaryDeductions} onChange={e => setFormData({...formData, salaryDeductions: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-2 text-sm text-primary font-manrope focus:border-accent outline-none" />
                    </div>
                    
                    <div className="flex justify-between p-4 border-t border-subtle mt-6 bg-surface-raised rounded">
                      <span className="text-primary font-bold">Calculated Net</span>
                      <span className="text-accent font-bold font-manrope text-lg">
                        ${(Number(formData.salaryBasic) + Number(formData.salaryAllowances) - Number(formData.salaryDeductions)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  };

  return { EmployeeDetail };
})();
