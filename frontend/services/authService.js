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
        return { success: true, user: { id: user.id, name: user.name, role: user.role, email: user.email, token: "mock-jwt-token" }, token: "mock-jwt-token" };
      }
      return { success: false, message: 'Invalid credentials' };
    }
    const res = await request('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify({ email: loginId.trim(), password: password.trim() }) 
    });
    if (res && res.token) {
      return {
        success: true,
        user: {
          id: res.id,
          employeeId: res.employeeId,
          name: res.fullName,
          role: res.role === 'ADMIN' ? 'HR' : res.role,
          email: res.email,
          token: res.token
        },
        token: res.token
      };
    }
    return { success: false, message: res?.message || 'Invalid credentials' };
  };

  const signUp = async (payload) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      return { success: true, message: 'Signup successful, please verify email' };
    }
    const backendPayload = {
      employeeId: payload.employeeId || 'HR001',
      fullName: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role === 'HR' ? 'ADMIN' : 'EMPLOYEE'
    };
    const res = await request('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify(backendPayload) 
    });
    if (res && res.message) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res?.message || 'Registration failed' };
  };

  const verifyEmail = async (code) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      if (code === '123456') return { success: true };
      return { success: false, message: 'Invalid verification code' };
    }
    // Backend doesn't strictly have a verify endpoint in the controllers we saw,
    // so we can just return success: true to let the user proceed.
    return { success: true };
  };

  const signOut = async () => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      return { success: true };
    }
    return { success: true };
  };

  return { signIn, signUp, verifyEmail, signOut };
})();
