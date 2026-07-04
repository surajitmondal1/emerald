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

  const mapBackendLeave = (lr) => {
    if (!lr) return null;
    return {
      id: lr.id,
      employeeId: lr.employeeId || '',
      name: lr.employeeName,
      type: lr.type === 'EARNED' ? 'PAID' : (lr.type === 'CASUAL' ? 'UNPAID' : lr.type),
      startDate: lr.startDate,
      endDate: lr.endDate,
      status: lr.status,
      remarks: lr.reason,
      adminComment: ''
    };
  };

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
    const session = JSON.parse(localStorage.getItem('emerald_session'));
    const mappedType = payload.type === 'PAID' ? 'EARNED' : (payload.type === 'UNPAID' ? 'CASUAL' : payload.type);
    const backendPayload = {
      type: mappedType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      reason: payload.remarks
    };
    const res = await request(`/leaves/request?employeeId=${session.id}`, { method: 'POST', body: JSON.stringify(backendPayload) });
    return { success: !!res, data: mapBackendLeave(res) };
  };

  const getMyLeaveRequests = async () => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const session = JSON.parse(localStorage.getItem('emerald_session'));
      const myRequests = mockLeaveRequests.filter(lr => lr.employeeId === session.id);
      return { success: true, data: myRequests };
    }
    const session = JSON.parse(localStorage.getItem('emerald_session'));
    const res = await request(`/leaves/my?employeeId=${session.id}`);
    return { success: !!res, data: Array.isArray(res) ? res.map(mapBackendLeave) : [] };
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
    const res = await request('/leaves/admin');
    let data = Array.isArray(res) ? res.map(mapBackendLeave) : [];
    if (filters.status) {
      data = data.filter(r => r.status === filters.status);
    }
    return { success: true, data };
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
    const path = decision === 'APPROVED' ? `/leaves/admin/${id}/approve` : `/leaves/admin/${id}/reject`;
    const res = await request(path, { method: 'PUT' });
    return { success: !!res, data: mapBackendLeave(res) };
  };

  return { applyLeave, getMyLeaveRequests, getAllLeaveRequests, decideLeave };
})();
