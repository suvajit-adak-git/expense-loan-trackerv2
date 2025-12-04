import React from 'react';
import { Trash2, Pencil } from 'lucide-react';

const RecurringCard = ({ payment, onDelete, onEdit }) => {
    const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

    return (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h4 className="font-semibold">{payment.name}</h4>
                    <span className="text-xs text-slate-400">{payment.category}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(payment)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Edit Payment"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(payment.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Payment"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(payment.amount)}</div>
        </div>
    );
};

export default RecurringCard;
