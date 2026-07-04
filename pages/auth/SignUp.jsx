window.SignUpModule = (() => {
  const { useState } = React;

  const SignUp = () => {
    const [formData, setFormData] = useState({ companyName: '', name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (pass) => {
      if (pass.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(pass)) return "Password must contain an uppercase letter";
      if (!/[a-z]/.test(pass)) return "Password must contain a lowercase letter";
      if (!/[0-9]/.test(pass)) return "Password must contain a number";
      if (!/[^A-Za-z0-9]/.test(pass)) return "Password must contain a special character";
      return null;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      const passError = validatePassword(formData.password);
      if (passError) {
        setError(passError);
        return;
      }

      setLoading(true);
      const res = await window.authService.signUp({
        companyName: formData.companyName,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'HR'
      });
      setLoading(false);

      if (res.success) {
        localStorage.setItem('companyName', formData.companyName);
        window.location.hash = '#/verify-email';
      } else {
        setError(res.message || 'Signup failed');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-base p-4">
        <div className="w-full max-w-lg card rounded-xl p-8 shadow-2xl mt-12 mb-12">
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="flex justify-center mb-4">
              <img src="assets/logo.jpeg" alt="Emerald Logo" className="w-16 h-16 rounded-xl object-cover shadow-lg" />
            </div>
            <h1 className="text-3xl font-manrope font-bold text-primary mb-2">Sign Up Page</h1>
            <p className="text-secondary text-sm">Register your company</p>
          </div>
          
          {error && <div className="mb-4 p-3 bg-status-absent/10 border border-status-absent/30 text-status-absent rounded text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Company Name :-</label>
                    <input 
                        type="text" 
                        value={formData.companyName}
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                        className="w-full bg-base border-b border-subtle px-2 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
                        required
                    />
                </div>
                <button type="button" className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 border border-accent/20" title="Upload Logo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </button>
            </div>

            <div>
              <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Name :-</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-base border-b border-subtle px-2 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Email :-</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-base border-b border-subtle px-2 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Phone :-</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-base border-b border-subtle px-2 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Password :-</label>
                <div className="relative">
                    <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-base border-b border-subtle px-2 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
                    required
                    />
                </div>
              </div>
              <div>
                <label className="block text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Confirm Password :-</label>
                <div className="relative">
                    <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-base border-b border-subtle px-2 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
                    required
                    />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
                <button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-base font-semibold py-3 rounded-lg text-base font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
                style={{ color: '#0A0A0B' }}
                >
                {loading ? 'Creating...' : 'Sign Up'}
                </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-secondary">
            Already have an account? <a href="#/login" className="text-accent hover:underline">Sign In</a>
          </div>
        </div>
      </div>
    );
  };

  return { SignUp };
})();
