const defaultUsers = [
    {
      id: "EMP001",
      email: "employee@emerald.com",
      password: "password123",
      name: "Surajit Mondal",
      role: "EMPLOYEE",
      designation: "Senior Frontend Engineer",
      profilePicture: null
    },
    {
      id: "HR001",
      email: "hr@emerald.com",
      password: "password123",
      name: "Sujan Bhowmik",
      role: "HR",
      designation: "HR Manager",
      profilePicture: null
    }
];

const storedUsers = localStorage.getItem('emerald_users');

window.mockData = {
  users: storedUsers ? JSON.parse(storedUsers) : defaultUsers,
  activities: [
    { id: 1, title: 'New Leave Request', desc: 'Surajit Mondal requested Sick Leave', time: '10 mins ago', unread: true },
    { id: 2, title: 'Attendance Alert', desc: 'Sibsankar Maity clocked in late', time: '1 hour ago', unread: true },
    { id: 3, title: 'System', desc: 'Company Payroll configuration updated', time: '3 hours ago', unread: false },
    { id: 4, title: 'Payroll', desc: 'October payroll has been successfully processed', time: '1 day ago', unread: false },
  ]
};
