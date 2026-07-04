window.apiService = (() => {
  const request = async (endpoint, options = {}) => {
    if (window.CONFIG.MOCK_MODE) {
      // Fake network delay for mock mode
      return new Promise(resolve => setTimeout(resolve, 500));
    } else {
      const sessionStr = localStorage.getItem('emerald_session');
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session && session.token) {
            headers['Authorization'] = `Bearer ${session.token}`;
          }
        } catch (e) {
          console.error("Error parsing session for token", e);
        }
      }
      const res = await fetch(`${window.CONFIG.API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });
      return res.json();
    }
  };

  return { request };
})();
