window.SignInModule = (() => {
  const { useState } = React;
  const { useAuth } = window.AuthContextModule;

  const SignIn = () => {
    const { login } = useAuth();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      const res = await login(loginId, password);
      setLoading(false);
      if (!res.success) {
        setError(res.message);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-base p-4">
        <div className="w-full max-w-md card rounded-xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <img src="assets/logo.jpeg" alt="Emerald Logo" className="w-16 h-16 rounded-xl object-cover shadow-lg" />
            </div>
            <h1 className="text-3xl font-manrope font-bold text-primary mb-2">Emerald</h1>
            <p className="text-secondary text-sm">Sign in to your account</p>
          </div>
          
          {error && <div className="mb-4 p-3 bg-status-absent/10 border border-status-absent/30 text-status-absent rounded text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Login Id/Email :-</label>
              <input 
                type="text" 
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                className="w-full bg-base border border-subtle rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
            
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 mr-2 border rounded border-subtle bg-base group-hover:border-accent">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="absolute opacity-0 w-full h-full cursor-pointer" />
                  {rememberMe && <div className="w-2 h-2 bg-accent rounded-sm"></div>}
                </div>
                <span className="text-sm text-secondary">Remember me</span>
              </label>
              <a href="#" className="text-sm text-accent hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-base font-semibold py-2.5 rounded-lg text-base font-medium hover:bg-accent/90 transition-colors mt-2 disabled:opacity-50"
              style={{ color: '#0A0A0B' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-secondary">
            Don't have an account? <a href="#/signup" className="text-accent hover:underline">Sign Up</a>
          </div>
        </div>
      </div>
    );
  };

  return { SignIn };
})();
