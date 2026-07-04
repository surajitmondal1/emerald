window.MyAttendanceModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState, useEffect } = React;

  const MyAttendance = () => {
    const [view, setView] = useState('monthly'); 
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clocking, setClocking] = useState(false);
    const [todayRecord, setTodayRecord] = useState(null);

    useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      setLoading(true);
      const res = await window.attendanceService.getMyAttendance();
      if (res.success) {
        setAttendance(res.data);
        const todayStr = new Date().toISOString().split('T')[0];
        const today = res.data.find(r => r.date === todayStr);
        if (today) setTodayRecord(today);
      }
      setLoading(false);
    };

    const handleClockIn = async () => {
      setClocking(true);
      const res = await window.attendanceService.checkIn();
      if (res.success) {
        setTodayRecord(res.data);
        loadData();
      }
      setClocking(false);
    };

    const handleClockOut = async () => {
      setClocking(true);
      const res = await window.attendanceService.checkOut();
      if (res.success) {
        setTodayRecord(res.data);
        loadData();
      }
      setClocking(false);
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

    const renderCalendar = () => {
       const days = Array.from({length: 31}, (_, i) => i + 1);
       return (
           <div className="grid grid-cols-7 gap-2">
               {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                   <div key={d} className="text-center text-xs font-medium text-secondary uppercase tracking-wider mb-2">{d}</div>
               ))}
               
               {Array.from({length: 3}).map((_, i) => <div key={`pad-${i}`} />)}
               
               {days.map(day => {
                   const mockDate = new Date();
                   mockDate.setDate(mockDate.getDate() - (mockDate.getDate() - day));
                   const dateStr = mockDate.toISOString().split('T')[0];
                   const record = attendance.find(r => r.date === dateStr);
                   
                   let textColor = 'transparent';
                   let label = '';
                   if (record) {
                       if (record.status === 'PRESENT') { textColor = 'var(--status-present)'; label = 'P'; }
                       if (record.status === 'ABSENT') { textColor = 'var(--status-absent)'; label = 'A'; }
                       if (record.status === 'HALF_DAY') { textColor = 'var(--status-pending)'; label = 'H'; }
                       if (record.status === 'LEAVE') { textColor = 'var(--status-leave)'; label = 'L'; }
                   }

                   const isToday = new Date().getDate() === day;

                   return (
                       <div key={day} className={`aspect-square card rounded-lg flex flex-col items-center justify-center relative ${isToday ? 'border-accent' : ''}`}>
                           <span className={`text-sm ${isToday ? 'text-accent font-bold' : 'text-primary'}`}>{day}</span>
                           {record && <div className="text-xs font-bold mt-0.5" style={{color: textColor}}>{label}</div>}
                       </div>
                   );
               })}
           </div>
       );
    };

    return (
      <DashboardLayout>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-manrope font-bold text-primary">Attendance</h1>
            <p className="text-secondary mt-1">Track your daily hours and history.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <div className="card rounded-xl p-8 text-center sticky top-28">
                <div className="text-sm font-medium text-secondary mb-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                <div className="text-4xl font-manrope font-bold tracking-tight mb-8">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                {!todayRecord?.checkIn ? (
                    <button onClick={handleClockIn} disabled={clocking} className="w-full bg-accent text-base text-xs font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50" style={{color: '#0A0A0B'}}>
                        Check In
                    </button>
                ) : !todayRecord?.checkOut ? (
                    <button onClick={handleClockOut} disabled={clocking} className="w-full border-2 border-status-absent text-status-absent text-base text-xs font-bold py-3 rounded-lg hover:bg-status-absent/10 disabled:opacity-50">
                        Check Out
                    </button>
                ) : (
                    <div className="px-4 py-3 bg-surface-raised border border-subtle rounded-lg text-sm text-secondary">
                        Shift completed. ({todayRecord.checkIn} - {todayRecord.checkOut})
                    </div>
                )}
                
                {todayRecord?.checkIn && (
                    <div className="mt-6 flex justify-between text-sm">
                        <span className="text-secondary">Time In</span>
                        <span className="font-medium text-primary">{todayRecord.checkIn}</span>
                    </div>
                )}
             </div>
          </div>

          <div className="lg:col-span-2">
             <div className="card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-manrope font-bold text-primary">History</h2>
                    <div className="flex gap-2 bg-base p-1 border border-subtle rounded-lg">
                        <button onClick={() => setView('weekly')} className={`px-3 py-1 text-xs font-medium rounded ${view === 'weekly' ? 'bg-surface-raised text-primary' : 'text-secondary hover:text-primary'}`}>List View</button>
                        <button onClick={() => setView('monthly')} className={`px-3 py-1 text-xs font-medium rounded ${view === 'monthly' ? 'bg-surface-raised text-primary' : 'text-secondary hover:text-primary'}`}>Calendar View</button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-secondary">Loading...</div>
                ) : view === 'monthly' ? (
                    renderCalendar()
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface-raised border-b border-subtle text-secondary text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Time In</th>
                                <th className="px-4 py-3 font-medium">Time Out</th>
                                <th className="px-4 py-3 font-medium">Work Hours</th>
                                <th className="px-4 py-3 font-medium">Extra Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-subtle">
                            {attendance.slice(0, 10).map((record, i) => {
                                const hours = calculateHours(record.checkIn, record.checkOut);
                                return (
                                <tr key={i} className="hover:bg-surface-raised transition-colors">
                                    <td className="px-4 py-3 font-medium text-primary">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td className="px-4 py-3">{renderStatusBadge(record.status)}</td>
                                    <td className="px-4 py-3 text-secondary">{record.checkIn || '--'}</td>
                                    <td className="px-4 py-3 text-secondary">{record.checkOut || '--'}</td>
                                    <td className="px-4 py-3 text-secondary font-medium">{hours.work}</td>
                                    <td className="px-4 py-3 text-secondary">{hours.extra}</td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
             </div>
          </div>
        </div>
      </DashboardLayout>
    );
  };

  return { MyAttendance };
})();
