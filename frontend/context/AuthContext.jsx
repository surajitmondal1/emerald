window.AuthContextModule = (() => {
  const { createContext, useState, useContext, useEffect } = React;

  const AuthContext = createContext(null);

  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const storedSession = localStorage.getItem('emerald_session');
      if (storedSession) {
        try {
          setUser(JSON.parse(storedSession));
        } catch (e) {
          localStorage.removeItem('emerald_session');
        }
      }
      setLoading(false);
    }, []);

    const updateUser = (fields) => {
      if (user) {
        const updated = { ...user, ...fields };
        setUser(updated);
        localStorage.setItem('emerald_session', JSON.stringify(updated));
      }
    };

    const login = async (email, password) => {
      const res = await window.authService.signIn(email, password);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('emerald_session', JSON.stringify(res.user));
      }
      return res;
    };

    const logout = async () => {
      await window.authService.signOut();
      setUser(null);
      localStorage.removeItem('emerald_session');
      window.location.hash = '#/login';
    };

    return (
      <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
        {children}
      </AuthContext.Provider>
    );
  };

  const useAuth = () => useContext(AuthContext);

  return { AuthProvider, useAuth };
})();
