import { useState, useEffect } from 'react';

export const useLoanData = () => {
    const [loans, setLoans] = useState(() => {
        const saved = localStorage.getItem('loans');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                name: "Personal Loan 1",
                type: "personal",
                principal: 500000,
                interestRate: 12.5,
                emiAmount: 11122,
                startDate: "2023-01-15",
                tenure: 60,
                tenureLeft: 42,
                remainingBalance: 380000,
                prepayments: []
            },
            {
                id: 2,
                name: "Personal Loan 2",
                type: "personal",
                principal: 300000,
                interestRate: 14.0,
                emiAmount: 6996,
                startDate: "2023-06-01",
                tenure: 48,
                tenureLeft: 36,
                remainingBalance: 230000,
                prepayments: []
            },
            {
                id: 3,
                name: "Car Loan",
                type: "car",
                principal: 800000,
                interestRate: 9.5,
                emiAmount: 16789,
                startDate: "2022-03-10",
                tenure: 84,
                tenureLeft: 52,
                remainingBalance: 520000,
                prepayments: []
            }
        ];
    });

    const [recurringPayments, setRecurringPayments] = useState(() => {
        const saved = localStorage.getItem('recurringPayments');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: "Insurance Premium", amount: 5000, category: "Insurance" },
            { id: 2, name: "Gym Membership", amount: 2000, category: "Health" }
        ];
    });

    const [monthlyIncome, setMonthlyIncome] = useState(() => {
        const saved = localStorage.getItem('monthlyIncome');
        return saved ? JSON.parse(saved) : 150000;
    });

    const [payoffGoalYears, setPayoffGoalYears] = useState(() => {
        const saved = localStorage.getItem('payoffGoalYears');
        return saved ? JSON.parse(saved) : null;
    });

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('loans', JSON.stringify(loans));
    }, [loans]);

    useEffect(() => {
        localStorage.setItem('recurringPayments', JSON.stringify(recurringPayments));
    }, [recurringPayments]);

    useEffect(() => {
        localStorage.setItem('monthlyIncome', JSON.stringify(monthlyIncome));
    }, [monthlyIncome]);

    useEffect(() => {
        localStorage.setItem('payoffGoalYears', JSON.stringify(payoffGoalYears));
    }, [payoffGoalYears]);

    const addLoan = (newLoan) => {
        const loan = {
            id: Date.now(),
            name: newLoan.name,
            type: newLoan.type,
            principal: parseFloat(newLoan.principal),
            interestRate: parseFloat(newLoan.interestRate),
            emiAmount: parseFloat(newLoan.emiAmount),
            startDate: newLoan.startDate,
            tenure: parseInt(newLoan.tenure),
            tenureLeft: parseInt(newLoan.tenureLeft),
            remainingBalance: parseFloat(newLoan.remainingBalance),
            prepayments: []
        };
        setLoans([...loans, loan]);
    };

    const addRecurring = (newRecurring) => {
        const payment = {
            id: Date.now(),
            name: newRecurring.name,
            amount: parseFloat(newRecurring.amount),
            category: newRecurring.category || 'Other'
        };
        setRecurringPayments([...recurringPayments, payment]);
    };

    const deleteLoan = (id) => {
        setLoans(loans.filter(loan => loan.id !== id));
    };

    const editLoan = (updatedLoan) => {
        setLoans(loans.map(loan => loan.id === updatedLoan.id ? updatedLoan : loan));
    };

    const deleteRecurring = (id) => {
        setRecurringPayments(recurringPayments.filter(pay => pay.id !== id));
    };

    const editRecurring = (updatedPayment) => {
        const payment = {
            ...updatedPayment,
            amount: parseFloat(updatedPayment.amount)
        };
        setRecurringPayments(recurringPayments.map(pay => pay.id === payment.id ? payment : pay));
    };

    const addPrepayment = (loanId, amount, date) => {
        setLoans(loans.map(loan => {
            if (loan.id === loanId) {
                const newRemaining = Math.max(0, loan.remainingBalance - amount);
                // Simple tenure reduction approximation
                // In a real app, we'd recalculate the schedule
                // const interestPerMonth = (loan.interestRate / 12) / 100;
                // New tenure left = -log(1 - (r * P) / EMI) / log(1 + r)
                // This is complex, for now we will just reduce balance and keep EMI same, 
                // which effectively reduces tenure.

                return {
                    ...loan,
                    remainingBalance: newRemaining,
                    prepayments: [...(loan.prepayments || []), {
                        id: Date.now(),
                        amount: parseFloat(amount),
                        date
                    }]
                };
            }
            return loan;
        }));
    };

    return {
        loans,
        recurringPayments,
        monthlyIncome,
        payoffGoalYears,
        setMonthlyIncome,
        setPayoffGoalYears,
        addLoan,
        addRecurring,
        deleteLoan,
        editLoan,
        deleteRecurring,
        editRecurring,
        addPrepayment,
        setLoans, // Exposed for import feature
        setRecurringPayments // Exposed for import feature
    };
};
