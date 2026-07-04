window.VerifyEmailModule = (() => {
  const { useState } = React;

  const VerifyEmail = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      
      const res = await window.authService.verifyEmail(code);
      setLoading(false);
      
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1500);
      } else {
        setError(res.message || 'Verification failed');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-base p-4">
        <div className="w-full max-w-md card rounded-xl p-8 shadow-2xl text-center">
          <h2 className="text-2xl font-manrope font-bold text-primary mb-2">Check your email</h2>
          <p className="text-secondary text-sm mb-6">
            We've sent a 6-digit verification code to your email address. 
            <br/><span className="opacity-50">(Hint for MOCK_MODE: enter 123456)</span>
          </p>
          
          {error && <div className="mb-4 p-3 bg-status-absent/10 border border-status-absent/30 text-status-absent rounded text-sm text-left">{error}</div>}
          {success && <div className="mb-4 p-3 bg-status-present/10 border border-status-present/30 text-status-present rounded text-sm text-left">Email verified! Redirecting to login...</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                type="text" 
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full text-center tracking-[0.5em] text-2xl font-manrope bg-base border border-subtle rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading || success}
              className="w-full bg-accent text-base font-semibold py-2.5 rounded-lg text-base font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
              style={{ color: '#0A0A0B' }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return { VerifyEmail };
})();
