window.MyLeaveModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState, useEffect } = React;

  const MyLeave = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({ type: 'PAID', startDate: '', endDate: '', remarks: '' });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      setLoading(true);
      const res = await window.leaveService.getMyLeaveRequests();
      if (res.success) {
        setRequests(res.data);
      }
      setLoading(false);
    };

    const handleApply = async (e) => {
      e.preventDefault();
      setFormError('');
      
      if (!formData.startDate || !formData.endDate) {
          setFormError('Please select start and end dates.');
          return;
      }
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
          setFormError('End date must be after start date.');
          return;
      }

      setSubmitting(true);
      const res = await window.leaveService.applyLeave(formData);
      if (res.success) {
        setFormData({ type: 'PAID', startDate: '', endDate: '', remarks: '' });
        loadData();
      } else {
        setFormError(res.message || 'Failed to submit leave request');
      }
      setSubmitting(false);
    };

    const renderStatusBadge = (status) => {
      switch (status) {
        case 'APPROVED': return <span className="px-2 py-1 bg-status-present/10 text-status-present border border-status-present/20 rounded text-xs font-semibold">Approved</span>;
        case 'REJECTED': return <span className="px-2 py-1 bg-status-absent/10 text-status-absent border border-status-absent/20 rounded text-xs font-semibold">Rejected</span>;
        case 'PENDING': return <span className="px-2 py-1 bg-status-pending/10 text-status-pending border border-status-pending/20 rounded text-xs font-semibold">Pending</span>;
        default: return null;
      }
    };

    const renderCalendar = () => {
       const days = Array.from({length: 31}, (_, i) => i + 1);
       
       const getLeaveTypeForDay = (day) => {
           const mockDate = new Date();
           mockDate.setDate(mockDate.getDate() - (mockDate.getDate() - day));
           const dateStr = mockDate.toISOString().split('T')[0];
           
           for (let r of requests) {
               if (r.status === 'REJECTED') continue;
               if (dateStr >= r.startDate && dateStr <= r.endDate) {
                   return r.status;
               }
           }
           return null;
       };

       return (
           <div className="grid grid-cols-7 gap-2">
               {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                   <div key={d} className="text-center text-xs font-medium text-secondary uppercase tracking-wider mb-2">{d}</div>
               ))}
               {Array.from({length: 3}).map((_, i) => <div key={`pad-${i}`} />)}
               
               {days.map(day => {
                   const leaveStatus = getLeaveTypeForDay(day);
                   const isToday = new Date().getDate() === day;
                   
                   let dotColor = 'transparent';
                   if (leaveStatus) {
                       dotColor = 'var(--status-leave)'; 
                   }

                   return (
                       <div key={day} className={`aspect-square card rounded-lg flex flex-col items-center justify-center relative ${isToday ? 'border-accent' : ''} ${leaveStatus === 'APPROVED' ? 'bg-status-leave/10 border-status-leave/30' : ''}`}>
                           <span className={`text-sm ${isToday ? 'text-accent font-bold' : 'text-primary'}`}>{day}</span>
                           {leaveStatus && <div className="w-1.5 h-1.5 rounded-full mt-1" style={{backgroundColor: dotColor}}></div>}
                       </div>
                   );
               })}
           </div>
       );
    };

    return (
      <DashboardLayout>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-manrope font-bold text-primary">Leave Management</h1>
            <p className="text-secondary mt-1">Apply for time off and view your balance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
             <div className="card rounded-xl p-6">
                <h2 className="text-xl font-manrope font-bold text-primary mb-6">Apply for Leave</h2>
                {formError && <div className="mb-4 p-3 bg-status-absent/10 border border-status-absent/30 text-status-absent rounded text-sm text-left">{formError}</div>}
                
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Leave Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-base border border-subtle rounded-lg px-4 py-2 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="PAID">Paid Leave</option>
                      <option value="SICK">Sick Leave</option>
                      <option value="UNPAID">Unpaid Leave</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      <div>
                          <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Start Date</label>
                          <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-base border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none" />
                      </div>
                      <div>
                          <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">End Date</label>
                          <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full bg-base border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Remarks</label>
                      <textarea required value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="w-full bg-base border border-subtle rounded-lg px-4 py-2 text-sm text-primary focus:border-accent outline-none h-20 resize-none" placeholder="Reason for leave..."></textarea>
                  </div>
                  <button type="submit" disabled={submitting} className="w-full bg-accent text-base text-xs font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 mt-2" style={{color: '#0A0A0B'}}>
                      {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
             </div>

             <div className="card rounded-xl p-6">
                <h3 className="font-manrope text-lg font-bold text-primary mb-4">Leave Calendar</h3>
                {renderCalendar()}
                <div className="flex gap-4 mt-4 justify-center text-xs text-secondary">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-leave"></span> Leave Day</div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2">
             <div className="card rounded-xl p-6 min-h-[400px]">
                <h2 className="text-xl font-manrope font-bold text-primary mb-6">My Requests</h2>

                {loading ? (
                    <div className="py-12 text-center text-secondary">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        {requests.length === 0 ? (
                            <div className="py-8 text-center text-secondary">No leave requests found.</div>
                        ) : requests.map(req => (
                            <div key={req.id} className="p-4 bg-surface-raised border border-subtle rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-medium text-primary text-sm">{req.type} LEAVE</h4>
                                        {renderStatusBadge(req.status)}
                                    </div>
                                    <div className="text-sm text-primary mb-1">
                                        {new Date(req.startDate).toLocaleDateString()} &mdash; {new Date(req.endDate).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-secondary">{req.remarks}</div>
                                </div>
                                {req.adminComment && (
                                    <div className="md:w-1/3 bg-base p-3 rounded border border-subtle relative">
                                        <div className="text-[10px] uppercase text-secondary font-semibold mb-1">HR Reply</div>
                                        <div className="text-xs text-primary">{req.adminComment}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
             </div>
          </div>
        </div>
      </DashboardLayout>
    );
  };

  return { MyLeave };
})();
