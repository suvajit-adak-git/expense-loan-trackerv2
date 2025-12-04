import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import RecurringCard from './RecurringCard';
import AddRecurringForm from './AddRecurringForm';

const RecurringList = ({ payments, onAddRecurring, onEditRecurring, onDeleteRecurring }) => {
    const [showAddRecurring, setShowAddRecurring] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);

    const handleSaveRecurring = (payment) => {
        if (editingPayment) {
            onEditRecurring(payment);
            setEditingPayment(null);
        } else {
            onAddRecurring(payment);
        }
        setShowAddRecurring(false);
    };

    const handleEditClick = (payment) => {
        setEditingPayment(payment);
        setShowAddRecurring(true);
    };

    const handleCancel = () => {
        setShowAddRecurring(false);
        setEditingPayment(null);
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recurring Payments</h2>
                <button
                    onClick={() => setShowAddRecurring(!showAddRecurring)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                    <PlusCircle size={20} />
                    Add Payment
                </button>
            </div>

            {showAddRecurring && (
                <AddRecurringForm
                    onSave={handleSaveRecurring}
                    onCancel={handleCancel}
                    initialData={editingPayment}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {payments.map((payment) => (
                    <RecurringCard
                        key={payment.id}
                        payment={payment}
                        onDelete={onDeleteRecurring}
                        onEdit={handleEditClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecurringList;
