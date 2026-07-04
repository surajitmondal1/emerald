window.PayrollManagementModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState, useEffect } = React;

  const PayrollManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [toast, setToast] = useState('');
    
    const [month, setMonth] = useState('July');
    const [year, setYear] = useState('2026');

    useEffect(() => {
      loadData();
    }, [month, year]);

    const loadData = async () => {
      setLoading(true);
      const res = await window.payrollService.getAllPayroll(month, year);
      if (res.success) {
        setRecords(res.data);
      }
      setLoading(false);
    };

    const handleGenerate = async () => {
        setGenerating(true);
        const res = await window.payrollService.generatePayroll(month, year);
        if (res.success) {
            setToast(res.message);
            setTimeout(() => setToast(''), 3000);
            loadData(); 
        }
        setGenerating(false);
    };

    const totalNet = records.reduce((sum, r) => sum + r.net, 0);
    const allGenerated = records.every(r => r.status === 'GENERATED' || r.status === 'PAID');

    return (
      <DashboardLayout>
        {toast && (
            <div className="fixed top-24 right-8 bg-status-present text-base px-6 py-3 rounded shadow-2xl font-medium border border-status-present/50 z-50 text-sm" style={{color: '#0A0A0B'}}>
                {toast}
            </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-manrope font-bold text-primary">Payroll Management</h1>
            <p className="text-secondary mt-1">Review compensation and process payslips.</p>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="bg-surface border border-subtle rounded-lg px-4 py-2 text-sm text-primary focus:outline-none focus:border-accent"
            >
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
            </select>
            <select 
              value={year}
              onChange={e => setYear(e.target.value)}
              className="bg-surface border border-subtle rounded-lg px-4 py-2 text-sm text-primary focus:outline-none focus:border-accent"
            >
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card rounded-xl p-6 col-span-1 md:col-span-3 flex items-center justify-between bg-gradient-to-r from-base to-surface-raised border border-subtle">
                <div>
                    <div className="text-secondary text-sm font-medium mb-1">Total Payload ({month} {year})</div>
                    <div className="text-3xl font-manrope font-bold text-primary">₹{totalNet.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-secondary text-sm font-medium mb-1">Employees</div>
                    <div className="text-3xl font-manrope font-bold text-primary">{records.length}</div>
                </div>
            </div>
            <div className="card rounded-xl p-6 col-span-1 flex flex-col justify-center border border-subtle">
                <button 
                    onClick={handleGenerate} 
                    disabled={generating || allGenerated || loading} 
                    className={`w-full py-3 rounded-lg text-sm font-bold flex justify-center items-center gap-2 ${allGenerated ? 'bg-surface-raised text-secondary border border-subtle cursor-not-allowed' : 'bg-accent text-base hover:opacity-90 transition-opacity'}`}
                    style={!allGenerated && !loading ? {color: '#0A0A0B'} : {}}
                >
                    {generating ? (
                         <span>Processing...</span>
                    ) : allGenerated ? (
                         <>
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                         Generated
                         </>
                    ) : (
                        'Generate All Payslips'
                    )}
                </button>
            </div>
        </div>

        <div className="card rounded-xl overflow-hidden min-h-[400px]">
          {loading ? (
             <div className="p-8 text-center text-secondary">Loading payroll...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised border-b border-subtle text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium text-right">Basic</th>
                  <th className="px-6 py-4 font-medium text-right">Allowances</th>
                  <th className="px-6 py-4 font-medium text-right">Deductions</th>
                  <th className="px-6 py-4 font-medium text-right">Net Pay</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {records.map((r, i) => (
                  <tr key={i} className="hover:bg-surface-raised transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{r.name}</td>
                    <td className="px-6 py-4 text-secondary">{r.department}</td>
                    <td className="px-6 py-4 text-right text-secondary">₹{r.basic.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-status-present">+₹{r.allowances.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-status-absent">-₹{r.deductions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-primary font-manrope font-bold">₹{r.net.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider border ${r.status === 'GENERATED' || r.status === 'PAID' ? 'bg-status-present/10 text-status-present border-status-present/20' : 'bg-status-pending/10 text-status-pending border-status-pending/20'}`}>
                            {r.status}
                        </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-secondary">No payroll records found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </DashboardLayout>
    );
  };

  return { PayrollManagement };
})();
