window.ForgotPasswordModule = (() => {
  const { useState } = React;

  const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [maskedPhone, setMaskedPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validatePassword = (pass) => {
      if (pass.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(pass)) return "Password must contain an uppercase letter";
      if (!/[a-z]/.test(pass)) return "Password must contain a lowercase letter";
      if (!/[0-9]/.test(pass)) return "Password must contain a number";
      if (!/[^A-Za-z0-9]/.test(pass)) return "Password must contain a special character";
      return null;
    };

    const handleSendOtp = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      const res = await window.authService.forgotPassword(email.trim());
      setLoading(false);

      if (res.success) {
        setMaskedPhone(res.phone || 'your registered phone');
        setOtpSent(true);
      } else {
        setError(res.message || 'Failed to send OTP. Please verify your email.');
      }
    };

    const handleResetPassword = async (e) => {
      e.preventDefault();
      setError('');

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const passError = validatePassword(newPassword);
      if (passError) {
        setError(passError);
        return;
      }

      setLoading(true);
      const res = await window.authService.resetPassword(email.trim(), otpCode.trim(), newPassword);
      setLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);
      } else {
        setError(res.message || 'Password reset failed');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-base p-4">
        <div className="w-full max-w-md card rounded-xl p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <img src="assets/logo.jpeg" alt="Emerald Logo" className="w-16 h-16 rounded-xl object-cover shadow-lg" />
            </div>
            <h1 className="text-3xl font-manrope font-bold text-primary mb-2">Reset Password</h1>
            <p className="text-secondary text-sm">Recover your account access</p>
          </div>

          {error && <div className="mb-4 p-3 bg-status-absent/10 border border-status-absent/30 text-status-absent rounded text-sm text-left">{error}</div>}
          {success && <div className="mb-4 p-3 bg-status-present/10 border border-status-present/30 text-status-present rounded text-sm text-center">Password reset successful! Redirecting to login...</div>}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Registered Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-base border border-subtle rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-base font-semibold py-2.5 rounded-lg text-base font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
                style={{ color: '#0A0A0B' }}
              >
                {loading ? 'Sending OTP...' : 'Send verification code'}
              </button>

              <div className="text-center mt-4">
                <a href="#/login" className="text-sm text-secondary hover:text-primary transition-colors hover:underline">&larr; Back to Sign In</a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-accent/5 border border-accent/15 rounded-lg text-xs text-secondary mb-4">
                We've sent a 6-digit verification code to the phone number ending in <span className="font-semibold text-primary">{maskedPhone}</span>.
              </div>

              <div>
                <label className="block text-secondary text-xs font-medium mb-1 uppercase tracking-wider">Verification Code</label>
                <input 
                  type="text" 
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full text-center tracking-[0.5em] text-xl font-manrope bg-base border border-subtle rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-secondary text-xs font-medium mb-1 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-base border border-subtle rounded-lg pl-4 pr-10 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-secondary text-xs font-medium mb-1 uppercase tracking-wider">Confirm New Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-base border border-subtle rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading || success}
                className="w-full bg-accent text-base font-semibold py-2.5 rounded-lg text-base font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 mt-2"
                style={{ color: '#0A0A0B' }}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="mt-4 flex justify-between text-xs text-secondary">
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)} 
                  className="hover:text-primary hover:underline"
                >
                  &larr; Back
                </button>
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  disabled={loading}
                  className="text-accent hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  return { ForgotPassword };
})();
