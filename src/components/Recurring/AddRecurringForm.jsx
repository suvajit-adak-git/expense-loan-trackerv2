import React, { useState } from 'react';

const AddRecurringForm = ({ onSave, onCancel, initialData }) => {
    const [newRecurring, setNewRecurring] = useState(initialData || {
        name: '',
        amount: '',
        category: ''
    });

    const handleSubmit = () => {
        if (newRecurring.name && newRecurring.amount) {
            onSave({
                ...newRecurring,
                amount: parseFloat(newRecurring.amount)
            });
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 mb-4 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Add Recurring Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Payment Name"
                    value={newRecurring.name}
                    onChange={(e) => setNewRecurring({ ...newRecurring, name: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-500"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={newRecurring.amount}
                    onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-500"
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newRecurring.category}
                    onChange={(e) => setNewRecurring({ ...newRecurring, category: e.target.value })}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-500"
                />
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all"
                >
                    Save
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

export default AddRecurringForm;
