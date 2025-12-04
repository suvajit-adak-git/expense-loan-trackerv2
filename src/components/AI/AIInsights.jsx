import React, { useState } from 'react';
import { Brain } from 'lucide-react';

const AIInsights = ({ loans, metrics, monthlyIncome }) => {
    const [aiInsights, setAiInsights] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAIInsights, setShowAIInsights] = useState(false);
    const [error, setError] = useState(null);

    const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

    const getAIInsights = async () => {
        setIsAnalyzing(true);
        setShowAIInsights(true);
        setError(null);

        try {
            // ... (keep existing prompt construction) ...
            const loanData = loans.map(loan => ({
                name: loan.name,
                type: loan.type,
                remainingBalance: loan.remainingBalance,
                interestRate: loan.interestRate,
                emiAmount: loan.emiAmount,
                tenureLeft: loan.tenureLeft
            }));

            const prompt = `You are a financial advisor analyzing a loan portfolio. Here is the data:

Monthly Income: Rs ${monthlyIncome.toLocaleString('en-IN')}
Current Surplus: Rs ${metrics.surplus.toLocaleString('en-IN')}

Loans:
${loanData.map((loan, i) => `${i + 1}. ${loan.name} (${loan.type})
   - Remaining: Rs ${loan.remainingBalance.toLocaleString('en-IN')}
   - Interest Rate: ${loan.interestRate}%
   - EMI: Rs ${loan.emiAmount.toLocaleString('en-IN')}
   - Months Left: ${loan.tenureLeft}`).join('\n')}

Provide a comprehensive analysis with:
1. Which loan to prioritize for prepayment and why
2. Estimated total interest savings if surplus is used for prepayment
3. Recommended prepayment strategy (avalanche vs snowball)
4. How much to keep as emergency buffer
5. Timeline to close all loans with current strategy

Respond ONLY with valid JSON in this exact format (no markdown, no preamble):
{
  "priorityLoan": "loan name",
  "reasoning": "brief explanation",
  "interestSavings": number,
  "recommendedMonthlyPrepayment": number,
  "emergencyBuffer": number,
  "strategy": "avalanche or snowball",
  "payoffTimeline": "X years Y months",
  "detailedPlan": ["step 1", "step 2", "step 3"],
  "goalStrategy": "strategy for goal if provided"
}`;

            const response = await fetch('/api/analyze-portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Analysis request failed');
            }

            const insights = await response.json();
            setAiInsights(insights);
        } catch (error) {
            console.error('AI Analysis Error:', error);
            setError(error.message);
            setAiInsights(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <>
            <div className="mb-6">
                <button
                    onClick={getAIInsights}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all"
                >
                    <Brain size={20} />
                    {isAnalyzing ? 'Analyzing...' : 'Get AI Recommendations'}
                </button>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                    <p className="font-bold">Analysis Failed</p>
                    <p>{error}</p>
                </div>
            )}

            {showAIInsights && aiInsights && (
                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-6 mb-8 border border-purple-700">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Brain className="text-purple-400" />
                        AI Financial Insights
                    </h2>

                    <div className="space-y-4">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-2 text-purple-300">Priority Loan</h3>
                            <p className="text-xl font-bold mb-1">{aiInsights.priorityLoan}</p>
                            <p className="text-slate-300">{aiInsights.reasoning}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <div className="text-slate-400 text-sm mb-1">Potential Savings</div>
                                <div className="text-2xl font-bold text-green-400">
                                    {formatCurrency(aiInsights.interestSavings)}
                                </div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <div className="text-slate-400 text-sm mb-1">Recommended Prepayment</div>
                                <div className="text-2xl font-bold text-blue-400">
                                    {formatCurrency(aiInsights.recommendedMonthlyPrepayment)}
                                </div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <div className="text-slate-400 text-sm mb-1">Emergency Buffer</div>
                                <div className="text-2xl font-bold text-yellow-400">
                                    {formatCurrency(aiInsights.emergencyBuffer)}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-2 text-purple-300">Recommended Strategy</h3>
                            <p className="text-slate-300 mb-2">
                                <span className="font-semibold capitalize">{aiInsights.strategy}</span> Method - Payoff Timeline: <span className="font-bold text-blue-400">{aiInsights.payoffTimeline}</span>
                            </p>
                            <ul className="space-y-2 mt-3">
                                {aiInsights.detailedPlan.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-purple-400 font-bold">{idx + 1}.</span>
                                        <span className="text-slate-300">{step}</span>
                                    </li>
                                ))}
                            </ul>
                            {aiInsights.goalStrategy && (
                                <div className="mt-4 p-3 bg-blue-900/30 rounded border border-blue-700">
                                    <p className="text-blue-300">{aiInsights.goalStrategy}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }
        </>
    );
};

export default AIInsights;
