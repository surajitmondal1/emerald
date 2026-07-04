window.AttendanceOverviewModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState, useEffect } = React;

  const AttendanceOverview = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ date: new Date().toISOString().split('T')[0], status: '', search: '' });

    useEffect(() => {
      loadData();
    }, [filters.date, filters.status, filters.search]);

    const loadData = async () => {
      setLoading(true);
      const res = await window.attendanceService.getAllAttendance(filters);
      if (res.success) {
        setRecords(res.data);
      }
      setLoading(false);
    };

    const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        if (hours === 12) hours = modifier === 'AM' ? 0 : 12;
        else hours = modifier === 'PM' ? hours + 12 : hours;
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
    };

    const calculateHours = (inStr, outStr) => {
        if (!inStr || !outStr) return { work: '--', extra: '--' };
        const inDate = parseTime(inStr);
        const outDate = parseTime(outStr);
        let diffMs = outDate - inDate;
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
        const totalHours = diffMs / (1000 * 60 * 60);
        const workHours = Math.min(totalHours, 9);
        const extraHours = Math.max(0, totalHours - 9);
        const format = h => `${Math.floor(h).toString().padStart(2, '0')}h ${Math.floor((h % 1) * 60).toString().padStart(2, '0')}m`;
        return { work: format(workHours), extra: extraHours > 0 ? format(extraHours) : '--' };
    };

    const renderStatusBadge = (status) => {
      switch (status) {
        case 'PRESENT': return <span className="px-2 py-1 bg-status-present/10 text-status-present border border-status-present/20 rounded text-xs font-semibold">Present</span>;
        case 'ABSENT': return <span className="px-2 py-1 bg-status-absent/10 text-status-absent border border-status-absent/20 rounded text-xs font-semibold">Absent</span>;
        case 'HALF_DAY': return <span className="px-2 py-1 bg-status-pending/10 text-status-pending border border-status-pending/20 rounded text-xs font-semibold">Half-day</span>;
        case 'LEAVE': return <span className="px-2 py-1 bg-status-leave/10 text-status-leave border border-status-leave/20 rounded text-xs font-semibold">Leave</span>;
        default: return null;
      }
    };

    return (
      <DashboardLayout>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-manrope font-bold text-primary">Attendance Overview</h1>
            <p className="text-secondary mt-1">Monitor company-wide presence and hours.</p>
          </div>
          
          <div className="flex gap-3">
            <input 
              type="date" 
              value={filters.date}
              onChange={e => setFilters({...filters, date: e.target.value})}
              className="bg-surface border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none"
            />
            <select 
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
              className="bg-surface border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none"
            >
              <option value="">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half-day</option>
              <option value="LEAVE">Leave</option>
            </select>
            <input 
              type="text" 
              placeholder="Search employee..." 
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
              className="bg-surface border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none w-64"
            />
          </div>
        </div>

        <div className="card rounded-xl overflow-hidden min-h-[400px]">
          {loading ? (
             <div className="p-8 text-center text-secondary">Loading records...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised border-b border-subtle text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Time In</th>
                  <th className="px-6 py-4 font-medium">Time Out</th>
                  <th className="px-6 py-4 font-medium">Work Hours</th>
                  <th className="px-6 py-4 font-medium">Extra Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {records.map((record, i) => {
                  const hours = calculateHours(record.checkIn, record.checkOut);
                  return (
                  <tr key={i} className="hover:bg-surface-raised transition-colors">
                    <td className="px-6 py-4">
                      <a href={`#/admin/employees/${record.employeeId}`} className="font-medium text-primary hover:text-accent transition-colors">
                        {record.name}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-secondary">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="px-6 py-4">{renderStatusBadge(record.status)}</td>
                    <td className="px-6 py-4 text-secondary">{record.checkIn || '--'}</td>
                    <td className="px-6 py-4 text-secondary">{record.checkOut || '--'}</td>
                    <td className="px-6 py-4 text-secondary font-medium">{hours.work}</td>
                    <td className="px-6 py-4 text-secondary">{hours.extra}</td>
                  </tr>
                  );
                })}
                {records.length === 0 && (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-secondary">No attendance records found for these filters.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </DashboardLayout>
    );
  };

  return { AttendanceOverview };
})();
