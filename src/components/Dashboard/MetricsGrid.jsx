import React from 'react';
import { TrendingDown, Calendar, IndianRupee, Target, PieChart } from 'lucide-react';
import MetricCard from './MetricCard';

const MetricsGrid = ({ metrics, monthlyIncome }) => {
    const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
                title="Total Debt"
                value={formatCurrency(metrics.totalDebt)}
                subtext={`${metrics.completionPercentage.toFixed(1)}% Complete`}
                icon={TrendingDown}
                iconColor="text-red-400"
            />
            <MetricCard
                title="Monthly EMI"
                value={formatCurrency(metrics.monthlyEMI)}
                subtext={`+ ${formatCurrency(metrics.recurringTotal)} recurring`}
                icon={Calendar}
                iconColor="text-blue-400"
            />
            <MetricCard
                title="Monthly Surplus"
                value={formatCurrency(metrics.surplus)}
                subtext={`Income: ${formatCurrency(monthlyIncome)}`}
                icon={IndianRupee}
                iconColor="text-green-400"
                valueColor={metrics.surplus >= 0 ? 'text-green-400' : 'text-red-400'}
            />
            <MetricCard
                title="Total Paid"
                value={formatCurrency(metrics.totalPaid)}
                subtext={`Interest: ${formatCurrency(metrics.totalInterestPaid)}`}
                icon={Target}
                iconColor="text-purple-400"
            />
        </div>
    );
};

export default MetricsGrid;
