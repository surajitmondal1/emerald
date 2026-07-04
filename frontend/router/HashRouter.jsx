window.RouterModule = (() => {
  const { useState, useEffect, createContext, useContext } = React;

  const RouterContext = createContext({ currentHash: '' });

  const HashRouter = ({ children }) => {
    const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

    useEffect(() => {
      const handleHashChange = () => setCurrentHash(window.location.hash || '#/');
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
      <RouterContext.Provider value={{ currentHash }}>
        {children}
      </RouterContext.Provider>
    );
  };

  const Route = ({ path, exact, render, children }) => {
    const { currentHash } = useContext(RouterContext);
    
    if (path === "") {
        if (currentHash === '#/' || currentHash === '') return children || (render ? render({}) : null);
        return null;
    }

    // Handle param e.g. path="#/admin/employees/:id"
    const hasParam = path.includes('/:');
    if (hasParam) {
       const basePath = path.split('/:')[0];
       if (currentHash.startsWith(basePath + '/')) {
           const id = currentHash.replace(basePath + '/', '');
           return render ? render({ match: { params: { id } } }) : children;
       }
       return null;
    }

    if (exact) {
        if (currentHash === path) return children || (render ? render({}) : null);
        return null;
    }

    if (currentHash.startsWith(path)) {
      return children || (render ? render({}) : null);
    }
    return null;
  };

  const Redirect = ({ to }) => {
    useEffect(() => {
      window.location.hash = to;
    }, [to]);
    return null;
  };

  return { HashRouter, Route, Redirect };
})();
