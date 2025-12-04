import React from 'react';
import { useLoanData } from './hooks/useLoanData';
import { calculateMetrics } from './utils/calculations';
import Container from './components/Layout/Container';
import Header from './components/Layout/Header';
import MetricsGrid from './components/Dashboard/MetricsGrid';
import Charts from './components/Dashboard/Charts';
import AIInsights from './components/AI/AIInsights';
import IncomeInput from './components/Inputs/IncomeInput';
import LoanList from './components/Loans/LoanList';
import RecurringList from './components/Recurring/RecurringList';
import DataManagement from './components/Settings/DataManagement';

const App = () => {
  const {
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
    setLoans,
    setRecurringPayments
  } = useLoanData();

  const metrics = calculateMetrics(loans, recurringPayments, monthlyIncome);

  return (
    <Container>
      <Header />
      <MetricsGrid metrics={metrics} monthlyIncome={monthlyIncome} />

      <Charts loans={loans} metrics={metrics} />

      <AIInsights
        loans={loans}
        metrics={metrics}
        monthlyIncome={monthlyIncome}
      />

      <IncomeInput
        monthlyIncome={monthlyIncome}
        setMonthlyIncome={setMonthlyIncome}
        payoffGoalYears={payoffGoalYears}
        setPayoffGoalYears={setPayoffGoalYears}
      />

      <LoanList
        loans={loans}
        onAddLoan={addLoan}
        onEditLoan={editLoan}
        onDeleteLoan={deleteLoan}
        onAddPrepayment={addPrepayment}
      />

      <RecurringList
        payments={recurringPayments}
        onAddRecurring={addRecurring}
        onEditRecurring={editRecurring}
        onDeleteRecurring={deleteRecurring}
      />

      <DataManagement
        loans={loans}
        recurringPayments={recurringPayments}
        monthlyIncome={monthlyIncome}
        payoffGoalYears={payoffGoalYears}
        setLoans={setLoans}
        setRecurringPayments={setRecurringPayments}
        setMonthlyIncome={setMonthlyIncome}
        setPayoffGoalYears={setPayoffGoalYears}
      />
    </Container>
  );
};

export default App;
