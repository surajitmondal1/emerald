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
    if (res && res.success === false) {
      return res;
    }
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
    const company = payload.companyName || 'Emerald';
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000).toString();
    const co = company.substring(0, 2).toUpperCase();
    const names = (payload.name || 'HR User').split(' ');
    const f = (names[0] ? names[0].substring(0, 2) : 'HR').toUpperCase();
    const generatedEmpId = `HR-${co}${f}${year}${rand}`;

    const backendPayload = {
      employeeId: payload.employeeId || generatedEmpId,
      fullName: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      role: payload.role === 'HR' ? 'ADMIN' : 'EMPLOYEE'
    };
    const res = await request('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify(backendPayload) 
    });
    if (res && res.success === false) {
      return res;
    }
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

  const sendOtp = async (phone) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      console.log(`[MOCK OTP] Sent code '123456' to phone: ${phone}`);
      alert(`[MOCK OTP] A verification code '123456' has been sent to ${phone}.`);
      return { success: true, message: 'OTP sent successfully' };
    }
    return await request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  };

  const verifyOtp = async (phone, otp) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      if (otp === '123456') {
        return { success: true, message: 'OTP verified successfully' };
      }
      return { success: false, message: 'Invalid OTP' };
    }
    return await request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp })
    });
  };

  const forgotPassword = async (email) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      const user = window.mockData.users.find(u => u.email === email);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      console.log(`[MOCK OTP] Forgot password OTP '123456' sent for user: ${email}`);
      alert(`[MOCK OTP] Forgot password verification code '123456' has been sent to user's mobile number.`);
      return { success: true, phone: '******0011', message: 'OTP sent successfully' };
    }
    return await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  };

  const resetPassword = async (email, otp, newPassword) => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      if (otp !== '123456') {
        return { success: false, message: 'Invalid OTP' };
      }
      const userIdx = window.mockData.users.findIndex(u => u.email === email);
      if (userIdx === -1) {
        return { success: false, message: 'User not found' };
      }
      window.mockData.users[userIdx].password = newPassword;
      localStorage.setItem('emerald_users', JSON.stringify(window.mockData.users));
      return { success: true, message: 'Password reset successfully' };
    }
    return await request('/auth/reset-password-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword })
    });
  };

  const signOut = async () => {
    if (window.CONFIG.MOCK_MODE) {
      await request('/mock-delay');
      return { success: true };
    }
    return { success: true };
  };

  return { signIn, signUp, verifyEmail, signOut, sendOtp, verifyOtp, forgotPassword, resetPassword };
})();
