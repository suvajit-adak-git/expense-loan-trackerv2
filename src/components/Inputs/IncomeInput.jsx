import React from 'react';

const IncomeInput = ({ monthlyIncome, setMonthlyIncome, payoffGoalYears, setPayoffGoalYears }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <label className="block text-sm text-slate-400 mb-2">Monthly Income (₹)</label>
                <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <label className="block text-sm text-slate-400 mb-2">Payoff Goal (years) - Optional</label>
                <input
                    type="number"
                    value={payoffGoalYears || ''}
                    onChange={(e) => setPayoffGoalYears(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="e.g., 3"
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>
    );
};

export default IncomeInput;
