/*
API Contracts for attendanceService:
- checkIn():
  Output: { success: true, data: { checkInTime: "..." } }

- checkOut():
  Output: { success: true, data: { checkOutTime: "..." } }

- getMyAttendance(range):
  Input: { start, end }
  Output: { success: true, data: [{ date, status, checkIn, checkOut }] }

- getAllAttendance(filters):
  Input: { date?, status?, employeeId? }
  Output: { success: true, data: [{ id, employeeId, name, date, status, checkIn, checkOut }] }
*/

window.attendanceService = (() => {
  const { request } = window.apiService;

  let mockTodayAttendance = null;
  
  const generateMockHistory = (employeeId) => {
      const history = [];
      const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'];
      for (let i = 1; i <= 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          if (date.getDay() !== 0 && date.getDay() !== 6) { // skip weekends
              history.push({
                  id: `ATT-${employeeId}-${i}`,
                  employeeId,
                  date: date.toISOString().split('T')[0],
                  status: status,
                  checkIn: status === 'PRESENT' || status === 'HALF_DAY' ? '09:00 AM' : null,
                  checkOut: status === 'PRESENT' ? '05:00 PM' : (status === 'HALF_DAY' ? '01:00 PM' : null)
              });
          }
      }
      return history;
  };

  const getMyAttendance = async (range = {}) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const session = JSON.parse(localStorage.getItem('emerald_session'));
      const history = generateMockHistory(session.id);
      if (mockTodayAttendance) {
          history.unshift(mockTodayAttendance);
      }
      return { success: true, data: history };
    }
    return request(`/attendance/me?start=${range.start || ''}&end=${range.end || ''}`);
  };

  const checkIn = async () => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const session = JSON.parse(localStorage.getItem('emerald_session'));
      const now = new Date();
      mockTodayAttendance = {
          id: `ATT-${session.id}-TODAY`,
          employeeId: session.id,
          date: now.toISOString().split('T')[0],
          status: 'PRESENT',
          checkIn: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          checkOut: null
      };
      return { success: true, data: mockTodayAttendance };
    }
    return request('/attendance/check-in', { method: 'POST' });
  };

  const checkOut = async () => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      if (mockTodayAttendance) {
          mockTodayAttendance.checkOut = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
      return { success: true, data: mockTodayAttendance };
    }
    return request('/attendance/check-out', { method: 'POST' });
  };

  const getAllAttendance = async (filters = {}) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      let records = [];
      window.mockData.users.filter(u => u.role === 'EMPLOYEE').forEach(u => {
          const uHist = generateMockHistory(u.id);
          records = [...records, ...uHist.map(h => ({ ...h, name: u.name }))];
      });
      
      if (filters.date) records = records.filter(r => r.date === filters.date);
      if (filters.status) records = records.filter(r => r.status === filters.status);
      if (filters.search) {
          const q = filters.search.toLowerCase();
          records = records.filter(r => r.name.toLowerCase().includes(q));
      }
      
      return { success: true, data: records.slice(0, 50) }; 
    }
    const qs = new URLSearchParams(filters).toString();
    return request(`/admin/attendance?${qs}`);
  };

  return { getMyAttendance, checkIn, checkOut, getAllAttendance };
})();
