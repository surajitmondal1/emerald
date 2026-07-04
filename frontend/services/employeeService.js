/*
API Contracts for employeeService:
- getProfile():
  Output: { success: true, data: { ...employeeData } }

- updateProfile(fields):
  Input: { address?, phone?, profilePicture? }
  Output: { success: true, data: { ...updatedData } }

- getEmployeeById(id):
  Output: { success: true, data: { ...employeeData } }

- updateEmployeeById(id, fields):
  Input: { ...anyFieldToUpdate }
  Output: { success: true, data: { ...updatedData } }

- listEmployees(filters):
  Input: { search?, status? }
  Output: { success: true, data: [{ ...employeeData }] }
*/

window.employeeService = (() => {
  const { request } = window.apiService;
  
  if (window.CONFIG.MOCK_MODE) {
      window.mockData.users = window.mockData.users.map(u => ({
          ...u,
          phone: u.phone || "+1 555 0192",
          address: u.address || "123 Tech Lane, Silicon Valley, CA",
          department: u.department || "Engineering",
          joinDate: u.joinDate || "2024-01-15",
          status: u.status || "ACTIVE",
          salary: u.salary || { basic: 85000, allowances: 15000, deductions: 5000 }
      }));
  }

  const getProfile = async () => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const session = JSON.parse(localStorage.getItem('emerald_session'));
      const user = window.mockData.users.find(u => u.id === session.id);
      return { success: true, data: user };
    }
    return request('/employee/profile');
  };

  const updateProfile = async (fields) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const session = JSON.parse(localStorage.getItem('emerald_session'));
      const index = window.mockData.users.findIndex(u => u.id === session.id);
      window.mockData.users[index] = { ...window.mockData.users[index], ...fields };
      localStorage.setItem('emerald_users', JSON.stringify(window.mockData.users));
      return { success: true, data: window.mockData.users[index] };
    }
    return request('/employee/profile', { method: 'PUT', body: JSON.stringify(fields) });
  };

  const getEmployeeById = async (id) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const user = window.mockData.users.find(u => u.id === id);
      return user ? { success: true, data: user } : { success: false, message: 'Not found' };
    }
    return request(`/admin/employees/${id}`);
  };

  const updateEmployeeById = async (id, fields) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const index = window.mockData.users.findIndex(u => u.id === id);
      if (index === -1) return { success: false, message: 'Not found' };
      window.mockData.users[index] = { ...window.mockData.users[index], ...fields };
      localStorage.setItem('emerald_users', JSON.stringify(window.mockData.users));
      return { success: true, data: window.mockData.users[index] };
    }
    return request(`/admin/employees/${id}`, { method: 'PUT', body: JSON.stringify(fields) });
  };

  const listEmployees = async (filters = {}) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      let users = window.mockData.users.filter(u => u.role === 'EMPLOYEE');
      if (filters.search) {
          const q = filters.search.toLowerCase();
          users = users.filter(u => u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q));
      }
      return { success: true, data: users };
    }
    const qs = new URLSearchParams(filters).toString();
    return request(`/admin/employees?${qs}`);
  };

  const generateId = (companyName, name, year) => {
    const co = (companyName || 'Emerald').substring(0, 2).toUpperCase();
    const names = name.split(' ');
    const f = (names[0] ? names[0].substring(0, 2) : 'XX').toUpperCase();
    const l = (names.length > 1 ? names[names.length - 1].substring(0, 2) : f).toUpperCase();
    const count = window.mockData.users.length + 1;
    const serial = count.toString().padStart(4, '0');
    return `${co}${f}${l}${year}${serial}`;
  };

  const createEmployee = async (fields) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const companyName = localStorage.getItem('companyName') || 'Emerald';
      const year = new Date().getFullYear();
      const newId = generateId(companyName, fields.name, year);
      const generatedPassword = Math.random().toString(36).slice(-8) + 'A1!';
      
      const newUser = {
        ...fields,
        id: newId,
        password: generatedPassword,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        salary: { basic: parseInt(fields.basic) || 50000, allowances: 5000, deductions: 2000 }
      };
      window.mockData.users.push(newUser);
      localStorage.setItem('emerald_users', JSON.stringify(window.mockData.users));
      return { success: true, data: newUser };
    }
    return request('/admin/employees', { method: 'POST', body: JSON.stringify(fields) });
  };

  return { getProfile, updateProfile, getEmployeeById, updateEmployeeById, listEmployees, createEmployee };
})();
