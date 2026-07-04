window.LeaveApprovalsModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState, useEffect } = React;

  const LeaveApprovals = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [comment, setComment] = useState('');
    const [actioning, setActioning] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
      loadData();
    }, [filter]);

    const loadData = async () => {
      setLoading(true);
      const res = await window.leaveService.getAllLeaveRequests({ status: filter });
      if (res.success) {
        setRequests(res.data);
      }
      setLoading(false);
    };

    const handleAction = async (decision) => {
        if (decision === 'REJECTED' && !comment) {
            alert('Please provide a comment for rejection.');
            return;
        }

        setActioning(true);
        const res = await window.leaveService.decideLeave(selectedRequest.id, decision, comment);
        if (res.success) {
            setToast(`Request ${decision.toLowerCase()} successfully.`);
            setTimeout(() => setToast(''), 3000);
            setSelectedRequest(null);
            setComment('');
            loadData();
        }
        setActioning(false);
    };

    const renderStatusBadge = (status) => {
      switch (status) {
        case 'APPROVED': return <span className="px-2 py-1 bg-status-present/10 text-status-present border border-status-present/20 rounded text-xs font-semibold">Approved</span>;
        case 'REJECTED': return <span className="px-2 py-1 bg-status-absent/10 text-status-absent border border-status-absent/20 rounded text-xs font-semibold">Rejected</span>;
        case 'PENDING': return <span className="px-2 py-1 bg-status-pending/10 text-status-pending border border-status-pending/20 rounded text-xs font-semibold">Pending</span>;
        default: return null;
      }
    };

    return (
      <DashboardLayout>
        {toast && (
            <div className="fixed top-24 right-8 bg-status-present text-base px-6 py-3 rounded shadow-2xl font-medium border border-status-present/50 z-50 text-sm" style={{color: '#0A0A0B'}}>
                {toast}
            </div>
        )}

        {selectedRequest && (
            <div className="fixed inset-0 bg-base/80 flex items-center justify-center z-50 p-4">
                <div className="card-raised rounded-xl p-6 w-full max-w-md shadow-2xl border border-subtle">
                    <h3 className="text-xl font-manrope font-bold text-primary mb-4">Review Leave Request</h3>
                    <div className="mb-4 text-sm text-primary bg-base p-4 rounded border border-subtle">
                        <div className="mb-2"><strong className="text-accent">{selectedRequest.name}</strong> requested <strong>{selectedRequest.type} LEAVE</strong></div>
                        <div className="text-secondary text-xs uppercase tracking-wider mb-1">Dates</div>
                        <div className="mb-2">{selectedRequest.startDate} &mdash; {selectedRequest.endDate}</div>
                        <div className="text-secondary text-xs uppercase tracking-wider mb-1">Employee Remarks</div>
                        <div className="italic">"{selectedRequest.remarks}"</div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">HR Comment (Required for Rejection)</label>
                        <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full bg-base border border-subtle rounded-lg px-4 py-2 text-sm text-primary focus:border-accent outline-none h-24 resize-none" placeholder="Provide a reason or acknowledgement..."></textarea>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setSelectedRequest(null)} disabled={actioning} className="flex-1 border border-subtle text-secondary py-2 rounded-lg text-sm hover:text-primary transition-colors">Cancel</button>
                        <button onClick={() => handleAction('REJECTED')} disabled={actioning} className="flex-1 bg-status-absent/20 border border-status-absent text-status-absent py-2 rounded-lg text-sm font-semibold hover:bg-status-absent/30 transition-colors">Reject</button>
                        <button onClick={() => handleAction('APPROVED')} disabled={actioning} className="flex-1 bg-status-present text-base py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-colors" style={{color: '#0A0A0B'}}>Approve</button>
                    </div>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-manrope font-bold text-primary">Leave Approvals</h1>
            <p className="text-secondary mt-1">Review and manage employee time off.</p>
          </div>
          
          <div>
            <select 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-surface border border-subtle rounded-lg px-4 py-2 text-sm text-primary focus:outline-none focus:border-accent"
            >
              <option value="">All Requests</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="card rounded-xl overflow-hidden min-h-[400px]">
          {loading ? (
             <div className="p-8 text-center text-secondary">Loading requests...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised border-b border-subtle text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Leave Type</th>
                  <th className="px-6 py-4 font-medium">Dates</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-surface-raised transition-colors">
                    <td className="px-6 py-4">
                      <a href={`#/admin/employees/${req.employeeId}`} className="font-medium text-primary hover:text-accent transition-colors">
                        {req.name}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-secondary">{req.type} LEAVE</td>
                    <td className="px-6 py-4 text-secondary">{req.startDate} <br/>to {req.endDate}</td>
                    <td className="px-6 py-4">{renderStatusBadge(req.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'PENDING' ? (
                          <button onClick={() => setSelectedRequest(req)} className="text-accent hover:underline text-xs font-medium bg-accent-soft px-3 py-1.5 rounded border border-accent/20">Review</button>
                      ) : (
                          <span className="text-secondary text-xs">Decided</span>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-secondary">No leave requests found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </DashboardLayout>
    );
  };

  return { LeaveApprovals };
})();
