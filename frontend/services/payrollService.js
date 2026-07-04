/*
API Contracts for payrollService:
- getMyPayslips():
  Output: { success: true, data: [{ id, month, year, basic, allowances, deductions, net, status }] }

- getAllPayroll(month, year):
  Output: { success: true, data: [{ employeeId, name, net, status, ... }] }

- generatePayroll(month, year):
  Output: { success: true, message: 'Payroll generated successfully' }
*/

window.payrollService = (() => {
  const { request } = window.apiService;

  const mockPayslips = [
      { id: 'PS-001', employeeId: 'EMP001', month: 'June', year: 2026, basic: 85000, allowances: 15000, deductions: 5000, net: 95000, status: 'PAID' },
      { id: 'PS-002', employeeId: 'EMP001', month: 'May', year: 2026, basic: 85000, allowances: 15000, deductions: 5000, net: 95000, status: 'PAID' }
  ];

  let currentMonthGenerated = false;

  const mapBackendPayroll = (p) => {
    if (!p) return null;
    return {
      id: p.id,
      employeeId: p.employeeId || '',
      name: p.employeeName,
      month: p.month,
      year: p.year,
      basic: p.basicSalary,
      allowances: p.allowance,
      deductions: p.deduction,
      net: p.netSalary,
      status: p.status
    };
  };

  const getMyPayslips = async () => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const session = JSON.parse(localStorage.getItem('emerald_session'));
      
      let slips = mockPayslips.filter(p => p.employeeId === session.id);
      if (currentMonthGenerated) {
          const u = window.mockData.users.find(u => u.id === session.id);
          slips.unshift({
             id: `PS-${Date.now()}`,
             employeeId: session.id,
             month: 'July',
             year: 2026,
             basic: u?.salary?.basic || 85000,
             allowances: u?.salary?.allowances || 15000,
             deductions: u?.salary?.deductions || 5000,
             net: (u?.salary?.basic || 85000) + (u?.salary?.allowances || 15000) - (u?.salary?.deductions || 5000),
             status: 'PENDING'
          });
      }
      return { success: true, data: slips };
    }
    const session = JSON.parse(localStorage.getItem('emerald_session'));
    const res = await request(`/payroll/my-payslips?employeeId=${session.id}`);
    return { success: !!res, data: Array.isArray(res) ? res.map(mapBackendPayroll) : [] };
  };

  const getAllPayroll = async (month, year) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      
      const records = window.mockData.users.filter(u => u.role === 'EMPLOYEE').map(u => {
          const basic = u.salary?.basic || 85000;
          const allowances = u.salary?.allowances || 15000;
          const deductions = u.salary?.deductions || 5000;
          return {
             employeeId: u.id,
             name: u.name,
             department: u.department || 'Engineering',
             basic, allowances, deductions,
             net: basic + allowances - deductions,
             status: currentMonthGenerated ? 'GENERATED' : 'PENDING'
          };
      });

      return { success: true, data: records };
    }
    const res = await request(`/admin/payroll?month=${month}&year=${year}`);
    return { success: !!res, data: Array.isArray(res) ? res.map(mapBackendPayroll) : [] };
  };

  const generatePayroll = async (month, year) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      currentMonthGenerated = true;
      return { success: true, message: `Payroll generated for ${month} ${year}` };
    }
    const res = await request('/admin/payroll/generate', { method: 'POST', body: JSON.stringify({ month, year }) });
    return { success: !!res, message: 'Payroll generated successfully' };
  };

  return { getMyPayslips, getAllPayroll, generatePayroll };
})();
