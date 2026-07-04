/*
API Contracts for leaveService:
- applyLeave(payload):
  Input: { type: 'PAID'|'SICK'|'UNPAID', startDate, endDate, remarks }
  Output: { success: true, data: { ...leaveRequest } }

- getMyLeaveRequests():
  Output: { success: true, data: [{ id, type, startDate, endDate, status, remarks, adminComment }] }

- getAllLeaveRequests(filters):
  Input: { status? }
  Output: { success: true, data: [{ id, employeeId, name, type, startDate, endDate, status, remarks, adminComment }] }

- decideLeave(id, decision, comment):
  Input: { decision: 'APPROVED'|'REJECTED', comment }
  Output: { success: true, data: { ...updatedLeaveRequest } }
*/

window.leaveService = (() => {
  const { request } = window.apiService;
  
  const defaultLeaves = [
      { id: 'LR-001', employeeId: 'EMP001', type: 'SICK', startDate: '2026-07-02', endDate: '2026-07-03', status: 'APPROVED', remarks: 'Fever', adminComment: 'Get well soon.' },
      { id: 'LR-002', employeeId: 'EMP001', type: 'PAID', startDate: '2026-07-20', endDate: '2026-07-22', status: 'PENDING', remarks: 'Family trip', adminComment: '' },
      { id: 'LR-003', employeeId: 'EMP002', type: 'UNPAID', startDate: '2026-08-01', endDate: '2026-08-05', status: 'PENDING', remarks: 'Personal errands', adminComment: '' }
  ];

  let mockLeaveRequests = localStorage.getItem('emerald_leaves') ? JSON.parse(localStorage.getItem('emerald_leaves')) : defaultLeaves;

  const applyLeave = async (payload) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const session = JSON.parse(localStorage.getItem('emerald_session'));
      const newRequest = {
          id: `LR-${Date.now()}`,
          employeeId: session.id,
          ...payload,
          status: 'PENDING',
          adminComment: ''
      };
      mockLeaveRequests.unshift(newRequest);
      localStorage.setItem('emerald_leaves', JSON.stringify(mockLeaveRequests));
      return { success: true, data: newRequest };
    }
    return request('/leave/apply', { method: 'POST', body: JSON.stringify(payload) });
  };

  const getMyLeaveRequests = async () => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const session = JSON.parse(localStorage.getItem('emerald_session'));
      const myRequests = mockLeaveRequests.filter(lr => lr.employeeId === session.id);
      return { success: true, data: myRequests };
    }
    return request('/leave/me');
  };

  const getAllLeaveRequests = async (filters = {}) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      let records = mockLeaveRequests.map(lr => {
          const emp = window.mockData.users.find(u => u.id === lr.employeeId);
          return { ...lr, name: emp ? emp.name : 'Unknown' };
      });
      
      if (filters.status) records = records.filter(r => r.status === filters.status);
      return { success: true, data: records };
    }
    const qs = new URLSearchParams(filters).toString();
    return request(`/admin/leave?${qs}`);
  };

  const decideLeave = async (id, decision, comment) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const index = mockLeaveRequests.findIndex(lr => lr.id === id);
      if (index === -1) return { success: false, message: 'Not found' };
      
      mockLeaveRequests[index].status = decision;
      mockLeaveRequests[index].adminComment = comment;
      localStorage.setItem('emerald_leaves', JSON.stringify(mockLeaveRequests));
      return { success: true, data: mockLeaveRequests[index] };
    }
    return request(`/admin/leave/${id}/decide`, { method: 'POST', body: JSON.stringify({ decision, comment }) });
  };

  return { applyLeave, getMyLeaveRequests, getAllLeaveRequests, decideLeave };
})();
