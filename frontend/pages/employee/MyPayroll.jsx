window.MyPayrollModule = (() => {
  const { DashboardLayout } = window.DashboardLayoutModule;
  const { useState, useEffect } = React;
  const { useAuth } = window.AuthContextModule;

  const MyPayroll = () => {
    const { user: sessionUser } = useAuth();
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      setLoading(true);
      const res = await window.payrollService.getMyPayslips();
      if (res.success) {
        setPayslips(res.data);
      }
      setLoading(false);
    };

    const latest = payslips.length > 0 ? payslips[0] : null;
    const history = payslips.length > 1 ? payslips.slice(1) : [];

    const handleDownload = (e, slip) => {
        e.preventDefault();
        
        const numberToWords = (num) => {
            const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
            const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
            if ((num = num.toString()).length > 9) return '';
            let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!n) return '';
            let str = '';
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
            str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
            return str ? 'Rupees ' + str.trim() + ' Only' : '';
        };

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payslip - ${slip.month} ${slip.year}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    body { font-family: 'Inter', sans-serif; padding: 40px; color: #1f2937; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #e5e7eb; padding-bottom: 25px; margin-bottom: 40px; }
                    .logo-section { flex: 1; }
                    .logo { width: 100px; height: 100px; object-fit: cover; display: block; margin-bottom: 15px; background: black; }
                    .company-name { font-weight: 700; font-size: 14px; color: #374151; margin-bottom: 3px; }
                    .company-address { font-size: 12px; color: #6b7280; line-height: 1.5; }
                    .title-section { text-align: right; padding-bottom: 15px; }
                    .title { font-size: 36px; font-weight: 500; color: #0f4c3a; letter-spacing: 2px; margin-bottom: 5px; }
                    .receipt-no { font-size: 13px; color: #6b7280; font-weight: 600; letter-spacing: 1px; }
                    
                    .info-grid { display: flex; justify-content: space-between; margin-bottom: 50px; gap: 40px; }
                    .box { flex: 1; }
                    .box-title { font-size: 15px; font-weight: 700; color: #0f4c3a; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #0f4c3a; padding-bottom: 8px; margin-bottom: 15px; display: inline-block; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                    .row .label { color: #4b5563; font-weight: 600; }
                    .row .val { color: #6b7280; text-align: right; }
                    
                    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                    th, td { padding: 14px 20px; text-align: left; font-size: 13px; }
                    th { background: #0f4c3a; color: #ffffff; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; font-size: 12px; }
                    td { border-bottom: 1px solid #f3f4f6; color: #4b5563; }
                    .amount-col { text-align: right; }
                    
                    .totals-row { background: #f0fdf4; font-weight: 700; color: #0f4c3a; }
                    .totals-row td { border-bottom: none; padding-top: 15px; padding-bottom: 15px; font-size: 14px; }
                    
                    .net-pay-box { background: #082f22; color: white; padding: 25px 30px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 80px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                    .net-pay-label { font-size: 15px; font-weight: 500; letter-spacing: 1px; color: #d1fae5; margin-bottom: 8px; opacity: 0.9; }
                    .net-pay-words { font-size: 13px; font-style: italic; color: #a7f3d0; opacity: 0.8; }
                    .net-pay-amount { font-size: 32px; font-weight: 700; letter-spacing: 0.5px; }
                    
                    .signatures { display: flex; justify-content: space-between; padding-top: 20px; }
                    .sig-box { width: 220px; text-align: center; border-top: 1px solid #d1d5db; padding-top: 12px; font-size: 12px; color: #6b7280; font-weight: 500; letter-spacing: 0.5px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-section">
                        <img src="${window.location.origin}/assets/logo.jpeg" class="logo" />
                        <div class="company-name">Emerald Technologies Pvt. Ltd.</div>
                        <div class="company-address">
                            123 Diamond District, Tech Park, Block EP<br/>
                            Salt Lake Sector V, Kolkata, WB 700091<br/>
                            <span style="color: #0f4c3a; font-weight: 500;">hr@emerald.com • www.emerald.com</span>
                        </div>
                    </div>
                    <div class="title-section">
                        <div class="title">PAYSLIP</div>
                        <div class="receipt-no">RECEIPT NO: EML-242-${slip.year}</div>
                    </div>
                </div>
                
                <div class="info-grid">
                    <div class="box">
                        <div class="box-title">EMPLOYEE DETAILS</div>
                        <div class="row"><span class="label">Employee Name</span> <span class="val">${sessionUser?.name || '---'}</span></div>
                        <div class="row"><span class="label">Employee ID</span> <span class="val">${sessionUser?.id || '---'}</span></div>
                        <div class="row"><span class="label">Designation</span> <span class="val">${sessionUser?.designation || '---'}</span></div>
                        <div class="row"><span class="label">Department</span> <span class="val">${sessionUser?.department || 'Engineering'}</span></div>
                    </div>
                    <div class="box">
                        <div class="box-title">PAYMENT BREAKDOWN</div>
                        <div class="row"><span class="label">Pay Period</span> <span class="val">${slip.month} ${slip.year}</span></div>
                        <div class="row"><span class="label">Payment Date</span> <span class="val">${slip.month} 30, ${slip.year}</span></div>
                        <div class="row"><span class="label">Bank Name</span> <span class="val">HDFC Bank</span></div>
                        <div class="row"><span class="label">Account Number</span> <span class="val">***********1234</span></div>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th style="width: 35%">EARNINGS ITEM</th>
                            <th class="amount-col" style="width: 15%">AMOUNT<br/>(INR)</th>
                            <th style="width: 35%">DEDUCTIONS ITEM</th>
                            <th class="amount-col" style="width: 15%">AMOUNT<br/>(INR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Basic Salary</td>
                            <td class="amount-col">₹ ${(slip.basic || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td>Provident Fund (PF)</td>
                            <td class="amount-col">₹ ${(slip.deductions ? slip.deductions * 0.4 : 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                            <td>House Rent Allowance (HRA)</td>
                            <td class="amount-col">₹ ${(slip.allowances ? slip.allowances * 0.6 : 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td>Professional Tax (PT)</td>
                            <td class="amount-col">₹ ${(slip.deductions ? slip.deductions * 0.1 : 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                            <td>Medical Allowance</td>
                            <td class="amount-col">₹ ${(slip.allowances ? slip.allowances * 0.15 : 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td>Income Tax (TDS)</td>
                            <td class="amount-col">₹ ${(slip.deductions ? slip.deductions * 0.5 : 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                            <td>Special Allowance</td>
                            <td class="amount-col">₹ ${(slip.allowances ? slip.allowances * 0.25 : 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td>Other Deductions</td>
                            <td class="amount-col">₹ 0.00</td>
                        </tr>
                        <tr class="totals-row">
                            <td>Gross Earnings</td>
                            <td class="amount-col">₹ ${(slip.basic + slip.allowances).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td>Total Deductions</td>
                            <td class="amount-col">₹ ${(slip.deductions).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="net-pay-box">
                    <div>
                        <div class="net-pay-label">NET DISBURSED AMOUNT</div>
                        <div class="net-pay-words">${numberToWords(slip.net)}</div>
                    </div>
                    <div class="net-pay-amount">
                        ₹ ${slip.net.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                </div>
                
                <div class="signatures">
                    <div class="sig-box">AUTHORIZED SIGNATORY</div>
                    <div class="sig-box">EMPLOYEE SIGNATURE</div>
                </div>
            </body>
            </html>
        `;
        const printWindow = window.open('', '', 'width=800,height=900');
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
      <DashboardLayout>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-manrope font-bold text-primary">Payroll</h1>
            <p className="text-secondary mt-1">View your compensation and download payslips.</p>
          </div>
        </div>

        {loading ? (
            <div className="py-12 text-center text-secondary">Loading payroll info...</div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    {latest ? (
                        <div className="card rounded-xl p-6 bg-gradient-to-br from-base to-surface-raised border border-subtle relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-accent">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                            </div>
                            <h2 className="text-sm font-medium text-secondary uppercase tracking-wider mb-6">Latest Payslip &bull; {latest.month} {latest.year}</h2>
                            
                            <div className="mb-8">
                                <div className="text-4xl font-manrope font-bold text-accent mb-1">₹{latest.net.toLocaleString()}</div>
                                <div className="text-sm text-secondary font-medium">Net Pay</div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Basic Salary</span>
                                    <span className="text-primary font-medium">₹{latest.basic.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Allowances</span>
                                    <span className="text-status-present font-medium">+ ₹{latest.allowances.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Deductions</span>
                                    <span className="text-status-absent font-medium">- ₹{latest.deductions.toLocaleString()}</span>
                                </div>
                            </div>

                            <button onClick={(e) => handleDownload(e, latest)} className="w-full bg-accent/10 border border-accent/20 text-accent font-semibold py-3 rounded-lg hover:bg-accent/20 transition-colors flex items-center justify-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Download Receipt
                            </button>
                        </div>
                    ) : (
                        <div className="card rounded-xl p-8 text-center text-secondary">
                            No recent payslips available.
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <div className="card rounded-xl overflow-hidden min-h-[400px]">
                        <div className="p-6 border-b border-subtle flex justify-between items-center">
                            <h2 className="text-xl font-manrope font-bold text-primary">Payslip History</h2>
                        </div>
                        {history.length === 0 ? (
                            <div className="py-12 text-center text-secondary">No historical payslips.</div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-surface-raised border-b border-subtle text-secondary text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Month</th>
                                        <th className="px-6 py-4 font-medium">Net Pay</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-subtle">
                                    {history.map(slip => (
                                        <tr key={slip.id} className="hover:bg-surface-raised transition-colors">
                                            <td className="px-6 py-4 font-medium text-primary">{slip.month} {slip.year}</td>
                                            <td className="px-6 py-4 text-primary font-manrope font-semibold">₹{slip.net.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-status-present/10 text-status-present border border-status-present/20 rounded text-xs font-semibold">{slip.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={(e) => handleDownload(e, slip)} className="text-accent hover:underline text-xs font-medium">Download</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        )}
      </DashboardLayout>
    );
  };

  return { MyPayroll };
})();
