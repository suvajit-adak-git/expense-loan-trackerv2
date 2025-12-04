import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';

const DataManagement = ({
    loans,
    recurringPayments,
    monthlyIncome,
    payoffGoalYears,
    setLoans,
    setRecurringPayments,
    setMonthlyIncome,
    setPayoffGoalYears
}) => {
    const fileInputRef = useRef(null);

    const handleExport = () => {
        const data = {
            loans,
            recurringPayments,
            monthlyIncome,
            payoffGoalYears,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `loan-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.loans) setLoans(data.loans);
                    if (data.recurringPayments) setRecurringPayments(data.recurringPayments);
                    if (data.monthlyIncome) setMonthlyIncome(data.monthlyIncome);
                    if (data.payoffGoalYears) setPayoffGoalYears(data.payoffGoalYears);
                    alert('Data imported successfully!');
                } catch (error) {
                    console.error('Import Error:', error);
                    alert('Failed to import data. Invalid file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="mb-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Data Management</h3>
            <div className="flex gap-4">
                <button
                    onClick={handleExport}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                    <Download size={20} />
                    Export Data
                </button>
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                    <Upload size={20} />
                    Import Data
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default DataManagement;
