window.apiService = (() => {
  const request = async (endpoint, options = {}) => {
    if (window.CONFIG.MOCK_MODE) {
      // Fake network delay for mock mode
      return new Promise(resolve => setTimeout(resolve, 500));
    } else {
      const res = await fetch(`${window.CONFIG.API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      return res.json();
    }
  };

  return { request };
})();
