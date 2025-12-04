import React from 'react';

const MetricCard = ({ title, value, subtext, icon: Icon, iconColor, valueColor = "text-white" }) => {
    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">{title}</span>
                <Icon className={iconColor} size={20} />
            </div>
            <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
            <div className="mt-2 text-xs text-slate-500">
                {subtext}
            </div>
        </div>
    );
};

export default MetricCard;
