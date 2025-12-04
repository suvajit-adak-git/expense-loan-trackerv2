import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];

const Charts = ({ loans, metrics }) => {
    // Data for Pie Chart (Total Principal vs Interest vs Remaining)
    // This is an approximation since we don't track total interest paid explicitly in the simple model yet
    const pieData = [
        { name: 'Principal Paid', value: metrics.totalPaid },
        { name: 'Remaining Balance', value: metrics.totalDebt },
    ];

    // Data for Bar Chart (Loan-wise breakdown)
    const barData = loans.map(loan => {
        // Calculate paid components roughly if not available in loan object directly
        // Ideally we should use the same utility, but for now we can infer
        const principalPaid = loan.principal - loan.remainingBalance;
        // Total paid so far approx = EMI * months paid? 
        // Or better, let's just use the metrics if available or simple calc
        // Since we don't have per-loan interest paid easily accessible without recalculating,
        // let's assume the user wants to see the Principal Paid vs Remaining vs Interest Paid

        return {
            name: loan.name,
            Principal: loan.principal,
            Remaining: loan.remainingBalance,
            'Principal Paid': principalPaid,
            // We can't easily get exact interest paid here without importing the calc function
            // So let's stick to Principal Paid vs Remaining for consistency with the new logic
        };
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Portfolio Distribution */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold mb-4">Portfolio Status</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Loan Breakdown */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold mb-4">Loan Breakdown</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="Remaining" stackId="a" fill="#ef4444" />
                            <Bar dataKey="Principal Paid" stackId="a" fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Charts;
