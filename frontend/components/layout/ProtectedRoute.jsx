window.ProtectedRouteModule = (() => {
  const { useAuth } = window.AuthContextModule;
  const { Redirect } = window.RouterModule;

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen bg-base flex items-center justify-center text-secondary">Loading...</div>;

    if (!user) {
      return <Redirect to="#/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Redirect to={user.role === 'HR' ? '#/admin/dashboard' : '#/employee/dashboard'} />;
    }

    return children;
  };

  return { ProtectedRoute };
})();
