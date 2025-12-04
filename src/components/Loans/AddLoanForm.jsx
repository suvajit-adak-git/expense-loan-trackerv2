import React, { useState, useEffect } from 'react';
import { calculateLoanProgress } from '../../utils/calculations';

const AddLoanForm = ({ onSave, onCancel, initialData }) => {
    const [newLoan, setNewLoan] = useState(initialData || {
        name: '',
        type: 'personal',
        principal: '',
        interestRate: '',
        emiAmount: '',
        startDate: '',
        tenure: '',
        remainingBalance: '',
        tenureLeft: ''
    });

    // Auto-calculate remaining balance and tenure left when relevant fields change
    useEffect(() => {
        if (newLoan.principal && newLoan.emiAmount && newLoan.tenure && newLoan.startDate && newLoan.interestRate) {
            const principal = parseFloat(newLoan.principal);
            const emiAmount = parseFloat(newLoan.emiAmount);
            const tenure = parseInt(newLoan.tenure);
            const interestRate = parseFloat(newLoan.interestRate);

            if (!isNaN(principal) && !isNaN(emiAmount) && !isNaN(tenure) && !isNaN(interestRate)) {
                const progress = calculateLoanProgress(principal, emiAmount, tenure, newLoan.startDate, interestRate);

                setNewLoan(prev => ({
                    ...prev,
                    remainingBalance: progress.remainingBalance,
                    tenureLeft: progress.tenureLeft
                }));
            }
        }
    }, [newLoan.principal, newLoan.emiAmount, newLoan.tenure, newLoan.startDate, newLoan.interestRate]);

    const handleSubmit = () => {
        if (newLoan.name && newLoan.principal && newLoan.interestRate && newLoan.emiAmount && newLoan.startDate) {
            onSave(newLoan);
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 mb-4 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Add New Loan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Loan Name"
                    value={newLoan.name}
                    onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                />
                <select
                    value={newLoan.type}
                    onChange={(e) => setNewLoan({ ...newLoan, type: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                >
                    <option value="personal">Personal Loan</option>
                    <option value="car">Car Loan</option>
                    <option value="home">Home Loan</option>
                </select>
                <input
                    type="number"
                    placeholder="Principal Amount"
                    value={newLoan.principal}
                    onChange={(e) => setNewLoan({ ...newLoan, principal: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="number"
                    step="0.1"
                    placeholder="Interest Rate (%)"
                    value={newLoan.interestRate}
                    onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="number"
                    placeholder="EMI Amount"
                    value={newLoan.emiAmount}
                    onChange={(e) => setNewLoan({ ...newLoan, emiAmount: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="date"
                    placeholder="Start Date"
                    value={newLoan.startDate}
                    onChange={(e) => setNewLoan({ ...newLoan, startDate: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="number"
                    placeholder="Total Tenure (months)"
                    value={newLoan.tenure}
                    onChange={(e) => setNewLoan({ ...newLoan, tenure: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="number"
                    placeholder="Tenure Left (months) - Auto-calculated"
                    value={newLoan.tenureLeft}
                    readOnly
                    className="bg-slate-600 text-white px-4 py-2 rounded-lg border border-slate-500 cursor-not-allowed"
                />
                <input
                    type="number"
                    placeholder="Remaining Balance - Auto-calculated"
                    value={newLoan.remainingBalance}
                    readOnly
                    className="bg-slate-600 text-white px-4 py-2 rounded-lg border border-slate-500 cursor-not-allowed"
                />
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all"
                >
                    Save Loan
                </button>
                <button
                    onClick={onCancel}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddLoanForm;
