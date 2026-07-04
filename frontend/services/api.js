window.apiService = (() => {
  const request = async (endpoint, options = {}) => {
    if (window.CONFIG.MOCK_MODE) {
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
      try {
        const res = await fetch(`${window.CONFIG.API_BASE_URL}${endpoint}`, {
          ...options,
          headers
        });
        
        let data;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          data = { message: text || `HTTP ${res.status}` };
        }

        if (!res.ok) {
          return { success: false, message: data.message || `Error: ${res.status}` };
        }
        return data;
      } catch (e) {
        console.error("Network error fetching API", e);
        return { success: false, message: "Cannot connect to server. Make sure the Spring Boot backend is running at http://localhost:5001." };
      }
    }
  };

  return { request };
})();
