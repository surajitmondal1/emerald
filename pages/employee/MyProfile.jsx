window.MyProfileModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState, useEffect } = React;
  const { useAuth } = window.AuthContextModule;

  const MyProfile = () => {
    const { user: sessionUser, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      loadProfile();
    }, []);

    const loadProfile = async () => {
      setLoading(true);
      const res = await window.employeeService.getProfile();
      if (res.success) {
        setProfile(res.data);
        setFormData({ phone: res.data.phone, address: res.data.address });
      }
      setLoading(false);
    };

    const handleSave = async () => {
      setSaving(true);
      const res = await window.employeeService.updateProfile(formData);
      if (res.success) {
        setProfile(res.data);
        setEditMode(false);
      }
      setSaving(false);
    };

    const handlePhotoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setProfile(prev => ({...prev, profilePicture: url}));
        window.employeeService.updateProfile({ profilePicture: url });
        if (updateUser) {
           updateUser({ profilePicture: url });
        }
      }
    };

    const handleDownload = (e, filename) => {
        e.preventDefault();
        const content = `Mock PDF content for ${filename}.\nIn production, this would be a real file from the backend.`;
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) return <DashboardLayout><div className="text-secondary">Loading profile...</div></DashboardLayout>;

    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-manrope font-bold text-primary">My Profile</h1>
        </div>

        <div className="flex gap-8">
          <div className="w-64 shrink-0">
            <div className="card rounded-xl p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 group">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full border-2 border-subtle" />
                ) : (
                  <div className="w-full h-full rounded-full border-2 border-subtle bg-accent flex items-center justify-center font-manrope font-bold text-4xl" style={{ color: '#0A0A0B' }}>
                    {profile.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <label className="absolute inset-0 bg-base/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <span className="text-xs font-medium text-primary">Change Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
              <h2 className="text-lg font-manrope font-bold text-primary">{profile.name}</h2>
              <p className="text-sm text-secondary mb-1">{profile.designation}</p>
              <div className="inline-block mt-2 px-3 py-1 bg-status-present/10 text-status-present border border-status-present/20 rounded-full text-xs font-semibold">
                {profile.status}
              </div>
            </div>

            <div className="card rounded-xl mt-6 overflow-hidden">
              <button onClick={() => setActiveTab('personal')} className={`w-full text-left px-5 py-4 border-b border-subtle text-sm font-medium transition-colors ${activeTab==='personal' ? 'text-accent bg-accent-soft' : 'text-secondary hover:bg-surface-raised hover:text-primary'}`}>Personal Details</button>
              <button onClick={() => setActiveTab('job')} className={`w-full text-left px-5 py-4 border-b border-subtle text-sm font-medium transition-colors ${activeTab==='job' ? 'text-accent bg-accent-soft' : 'text-secondary hover:bg-surface-raised hover:text-primary'}`}>Job Details</button>
              <button onClick={() => setActiveTab('salary')} className={`w-full text-left px-5 py-4 border-b border-subtle text-sm font-medium transition-colors ${activeTab==='salary' ? 'text-accent bg-accent-soft' : 'text-secondary hover:bg-surface-raised hover:text-primary'}`}>Salary Structure</button>
              <button onClick={() => setActiveTab('documents')} className={`w-full text-left px-5 py-4 text-sm font-medium transition-colors ${activeTab==='documents' ? 'text-accent bg-accent-soft' : 'text-secondary hover:bg-surface-raised hover:text-primary'}`}>Documents</button>
            </div>
          </div>

          <div className="flex-1">
            <div className="card rounded-xl p-8 min-h-[400px]">
              {activeTab === 'personal' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-manrope font-bold text-primary">Personal Details</h3>
                    {!editMode ? (
                      <button onClick={() => setEditMode(true)} className="text-accent text-sm font-medium hover:underline">Edit Info</button>
                    ) : (
                      <div className="flex gap-3">
                        <button onClick={() => setEditMode(false)} className="text-secondary text-sm font-medium hover:text-primary">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="bg-accent text-base text-xs font-bold px-4 py-1.5 rounded disabled:opacity-50" style={{color: '#0A0A0B'}}>Save</button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Employee ID</label>
                      <div className="text-primary text-sm">{profile.id}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Email</label>
                      <div className="text-primary text-sm">{profile.email}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Phone</label>
                      {editMode ? (
                        <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-1.5 text-sm text-primary focus:border-accent outline-none" />
                      ) : (
                        <div className="text-primary text-sm">{profile.phone}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Address</label>
                      {editMode ? (
                        <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-base border border-subtle rounded px-3 py-1.5 text-sm text-primary focus:border-accent outline-none h-20" />
                      ) : (
                        <div className="text-primary text-sm">{profile.address}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'job' && (
                <div>
                  <h3 className="text-xl font-manrope font-bold text-primary mb-6">Job Details</h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Department</label>
                      <div className="text-primary text-sm">{profile.department}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Designation</label>
                      <div className="text-primary text-sm">{profile.designation}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Join Date</label>
                      <div className="text-primary text-sm">{profile.joinDate}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Employment Status</label>
                      <div className="text-primary text-sm">{profile.status}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'salary' && (
                <div>
                  <h3 className="text-xl font-manrope font-bold text-primary mb-6">Salary Structure</h3>
                  <p className="text-sm text-secondary mb-6">Your current compensation breakdown. This information is read-only.</p>
                  
                  <div className="space-y-3 max-w-md">
                    <div className="flex justify-between p-3 bg-surface-raised rounded">
                      <span className="text-secondary text-sm">Basic Salary</span>
                      <span className="text-primary font-medium font-manrope">₹{profile.salary?.basic?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-surface-raised rounded">
                      <span className="text-secondary text-sm">Allowances</span>
                      <span className="text-status-present font-medium font-manrope">+ ₹{profile.salary?.allowances?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-surface-raised rounded">
                      <span className="text-secondary text-sm">Deductions</span>
                      <span className="text-status-absent font-medium font-manrope">- ₹{profile.salary?.deductions?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-4 border-t border-subtle mt-4">
                      <span className="text-primary font-bold">Net Salary</span>
                      <span className="text-accent font-bold font-manrope text-lg">
                        ₹{((profile.salary?.basic || 0) + (profile.salary?.allowances || 0) - (profile.salary?.deductions || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  <h3 className="text-xl font-manrope font-bold text-primary mb-6">Documents</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface-raised rounded border border-subtle">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-base rounded flex items-center justify-center text-accent">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary">Employment Contract.pdf</div>
                          <div className="text-xs text-secondary">Added on Jan 15, 2024 &bull; 2.4 MB</div>
                        </div>
                      </div>
                      <a href="#" onClick={(e) => handleDownload(e, 'Employment_Contract.pdf')} className="text-accent text-sm font-medium hover:underline">Download</a>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface-raised rounded border border-subtle">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-base rounded flex items-center justify-center text-accent">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary">Non-Disclosure Agreement.pdf</div>
                          <div className="text-xs text-secondary">Added on Jan 15, 2024 &bull; 1.1 MB</div>
                        </div>
                      </div>
                      <a href="#" onClick={(e) => handleDownload(e, 'NDA.pdf')} className="text-accent text-sm font-medium hover:underline">Download</a>
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

  return { MyProfile };
})();
