// Calculate months elapsed between two dates
export const calculateMonthsElapsed = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();

    const yearsDiff = now.getFullYear() - start.getFullYear();
    const monthsDiff = now.getMonth() - start.getMonth();

    return yearsDiff * 12 + monthsDiff;
};

// Calculate loan details based on start date with proper interest calculation
export const calculateLoanProgress = (principal, emiAmount, tenure, startDate, interestRate) => {
    const monthsElapsed = Math.max(0, calculateMonthsElapsed(startDate));
    const monthsPaid = Math.min(monthsElapsed, tenure);
    const tenureLeft = Math.max(0, tenure - monthsPaid);

    // Monthly interest rate (annual rate / 12 / 100)
    const monthlyRate = interestRate / 12 / 100;

    // Calculate remaining balance using amortization formula
    let remainingBalance = principal;
    if (monthlyRate > 0 && monthsPaid > 0) {
        const onePlusR = 1 + monthlyRate;
        const powerN = Math.pow(onePlusR, tenure);
        const powerP = Math.pow(onePlusR, monthsPaid);
        remainingBalance = principal * (powerN - powerP) / (powerN - 1);
    } else if (monthsPaid > 0) {
        remainingBalance = principal * (tenure - monthsPaid) / tenure;
    }

    // Calculate total amount paid
    const totalPaid = monthsPaid * emiAmount;
    const principalPaid = principal - remainingBalance;
    const interestPaid = totalPaid - principalPaid;

    // Calculate last month's breakdown
    let lastMonthPrincipalPaid = 0;
    let lastMonthInterestPaid = 0;
    if (monthsPaid > 0) {
        let previousRemainingBalance = principal;
        if (monthlyRate > 0 && monthsPaid > 1) {
            const onePlusR = 1 + monthlyRate;
            const powerN = Math.pow(onePlusR, tenure);
            const powerP_minus_1 = Math.pow(onePlusR, monthsPaid - 1);
            previousRemainingBalance = principal * (powerN - powerP_minus_1) / (powerN - 1);
        } else if (monthsPaid > 1) {
            previousRemainingBalance = principal * (tenure - (monthsPaid - 1)) / tenure;
        }
        lastMonthInterestPaid = previousRemainingBalance * monthlyRate;
        lastMonthPrincipalPaid = emiAmount - lastMonthInterestPaid;
    }


    return {
        monthsPaid,
        tenureLeft,
        totalPaid: Math.round(totalPaid),
        principalPaid: Math.round(principalPaid),
        interestPaid: Math.round(interestPaid),
        remainingBalance: Math.max(0, Math.round(remainingBalance)),
        lastMonthPrincipalPaid: Math.round(lastMonthPrincipalPaid),
        lastMonthInterestPaid: Math.round(lastMonthInterestPaid),
    };
};

export const calculateMetrics = (loans, recurringPayments, monthlyIncome) => {
    let totalPaid = 0;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    let lastMonthPrincipalPaid = 0;
    let lastMonthInterestPaid = 0;

    loans.forEach(loan => {
        const progress = calculateLoanProgress(loan.principal, loan.emiAmount, loan.tenure, loan.startDate, loan.interestRate);
        totalPaid += progress.totalPaid;
        totalPrincipalPaid += progress.principalPaid;
        totalInterestPaid += progress.interestPaid;
        lastMonthPrincipalPaid += progress.lastMonthPrincipalPaid;
        lastMonthInterestPaid += progress.lastMonthInterestPaid;
    });

    const totalDebt = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
    const totalPrincipal = loans.reduce((sum, loan) => sum + loan.principal, 0);

    const completionPercentage = totalPrincipal > 0 ? (totalPrincipalPaid / totalPrincipal) * 100 : 0;
    const monthlyEMI = loans.reduce((sum, loan) => sum + (parseFloat(loan.emiAmount) || 0), 0);
    const recurringTotal = recurringPayments.reduce((sum, pay) => sum + (parseFloat(pay.amount) || 0), 0);
    const totalMonthlyOutflow = monthlyEMI + recurringTotal;
    const surplus = monthlyIncome - totalMonthlyOutflow;

    return {
        totalDebt,
        totalPrincipal,
        totalPaid,
        totalInterestPaid,
        completionPercentage,
        monthlyEMI,
        recurringTotal,
        totalMonthlyOutflow,
        surplus,
        lastMonthPrincipalPaid,
        lastMonthInterestPaid,
    };
};
