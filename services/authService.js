// services/authService.js
/*
API Contracts for authService:
- signIn(email, password): 
  Input: { email, password }
  Output: { success: true, user: { id, name, role, email }, token: "..." } or { success: false, message: "..." }

- signUp(payload):
  Input: { employeeId, email, password, role }
  Output: { success: true, message: "..." } or { success: false, message: "..." }

- verifyEmail(code):
  Input: { code }
  Output: { success: true } or { success: false, message: "..." }

- signOut():
  Output: { success: true }
*/

window.authService = (() => {
  const { request } = window.apiService;

  const signIn = async (loginId, password) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay'); // simulate network
      const safeId = loginId ? loginId.trim() : '';
      const safePass = password ? password.trim() : '';
      const user = window.mockData.users.find(u => (u.email === safeId || u.id === safeId) && u.password === safePass);
      if (user) {
        return { success: true, user: { id: user.id, name: user.name, role: user.role, email: user.email }, token: "mock-jwt-token" };
      }
      return { success: false, message: 'Invalid credentials' };
    }
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ loginId: loginId.trim(), password: password.trim() }) });
  };

  const signUp = async (payload) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      return { success: true, message: 'Signup successful, please verify email' };
    }
    return request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
  };

  const verifyEmail = async (code) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      if (code === '123456') return { success: true };
      return { success: false, message: 'Invalid verification code' };
    }
    return request('/auth/verify', { method: 'POST', body: JSON.stringify({ code }) });
  };

  const signOut = async () => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      return { success: true };
    }
    return request('/auth/logout', { method: 'POST' });
  };

  return { signIn, signUp, verifyEmail, signOut };
})();
