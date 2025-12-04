import React, { useState } from 'react';
import { Trash2, Plus, X, Pencil } from 'lucide-react';
import { calculateLoanProgress } from '../../utils/calculations';

const LoanCard = ({ loan, onDelete, onEdit, onAddPrepayment }) => {
    const [showPrepayment, setShowPrepayment] = useState(false);
    const [prepaymentAmount, setPrepaymentAmount] = useState('');

    const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

    // Calculate progress using the utility function
    const loanProgress = calculateLoanProgress(
        loan.principal,
        loan.emiAmount,
        loan.tenure,
        loan.startDate,
        loan.interestRate
    );

    const progress = ((loan.tenure - loanProgress.tenureLeft) / loan.tenure) * 100;

    const handleAddPrepayment = () => {
        if (prepaymentAmount && !isNaN(prepaymentAmount)) {
            onAddPrepayment(loan.id, parseFloat(prepaymentAmount), new Date().toISOString().split('T')[0]);
            setPrepaymentAmount('');
            setShowPrepayment(false);
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold">{loan.name}</h3>
                    <span className="text-sm text-slate-400 capitalize">{loan.type} Loan</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(loan)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Edit Loan"
                    >
                        <Pencil size={20} />
                    </button>
                    <button
                        onClick={() => setShowPrepayment(!showPrepayment)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Add Prepayment"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        onClick={() => onDelete(loan.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Loan"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {showPrepayment && (
                <div className="mb-4 bg-slate-700/50 p-3 rounded-lg flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Amount"
                        value={prepaymentAmount}
                        onChange={(e) => setPrepaymentAmount(e.target.value)}
                        className="bg-slate-600 text-white px-3 py-1 rounded border border-slate-500 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <button
                        onClick={handleAddPrepayment}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Add
                    </button>
                    <button
                        onClick={() => setShowPrepayment(false)}
                        className="text-slate-400 hover:text-slate-300"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Progress: {progress.toFixed(1)}%</span>
                    <span>{loanProgress.tenureLeft} months left</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <div className="text-xs text-slate-400 mb-1">Interest Rate</div>
                    <div className="text-lg font-semibold">{loan.interestRate}%</div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1">Monthly EMI</div>
                    <div className="text-lg font-semibold">{formatCurrency(loan.emiAmount)}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1">Remaining</div>
                    <div className="text-lg font-semibold text-red-400">{formatCurrency(loan.remainingBalance)}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 mb-1">Total Paid</div>
                    <div className="text-lg font-semibold text-green-400">{formatCurrency(loanProgress.totalPaid)}</div>
                    <div className="text-xs text-slate-500">(Int: {formatCurrency(loanProgress.interestPaid)})</div>
                </div>
            </div>
        </div>
    );
};
export default LoanCard;
