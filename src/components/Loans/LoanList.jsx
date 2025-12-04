import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import LoanCard from './LoanCard';
import AddLoanForm from './AddLoanForm';
import LoanUpload from './LoanUpload';

const LoanList = ({ loans, onAddLoan, onEditLoan, onDeleteLoan, onAddPrepayment }) => {
    const [showAddLoan, setShowAddLoan] = useState(false);
    const [editingLoan, setEditingLoan] = useState(null);
    const [extractedData, setExtractedData] = useState(null);

    const handleSaveLoan = (loan) => {
        if (editingLoan) {
            onEditLoan(loan);
            setEditingLoan(null);
        } else {
            onAddLoan(loan);
        }
        setShowAddLoan(false);
        setExtractedData(null);
    };

    const handleDataExtracted = (data) => {
        setExtractedData(data);
        setShowAddLoan(true);
    };

    const handleEditClick = (loan) => {
        setEditingLoan(loan);
        setShowAddLoan(true);
    };

    const handleCancel = () => {
        setShowAddLoan(false);
        setEditingLoan(null);
        setExtractedData(null);
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Active Loans</h2>
                <div className="flex gap-2">
                    <LoanUpload onDataExtracted={handleDataExtracted} />
                    <button
                        onClick={() => setShowAddLoan(!showAddLoan)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                    >
                        <PlusCircle size={20} />
                        Add Loan
                    </button>
                </div>
            </div>

            {showAddLoan && (
                <AddLoanForm
                    onSave={handleSaveLoan}
                    onCancel={handleCancel}
                    initialData={editingLoan || extractedData}
                />
            )}

            <div className="space-y-4">
                {loans.map((loan) => (
                    <LoanCard
                        key={loan.id}
                        loan={loan}
                        onDelete={onDeleteLoan}
                        onEdit={handleEditClick}
                        onAddPrepayment={onAddPrepayment}
                    />
                ))}
            </div>
        </div>
    );
};

export default LoanList;
