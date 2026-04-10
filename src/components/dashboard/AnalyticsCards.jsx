import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const AnalyticsCards = () => {
    const cards = [
        {
            title: 'Total Bookings',
            value: '2,847',
            change: '+12.5%',
            positive: true,
            icon: '📅',
            color: 'emerald',
            gradient: 'from-emerald-600/20 to-emerald-400/10',
        },
        {
            title: 'Revenue Generated',
            value: '$128,450',
            change: '+18.2%',
            positive: true,
            icon: '💰',
            color: 'gold',
            gradient: 'from-gold/20 to-yellow-500/10',
        },
        {
            title: 'Upcoming Events',
            value: '24',
            change: '-3.1%',
            positive: false,
            icon: '🎯',
            color: 'emerald',
            gradient: 'from-emerald-600/20 to-cyan-400/10',
        },
        {
            title: 'Customer Satisfaction',
            value: '4.8/5',
            change: '+2.4%',
            positive: true,
            icon: '⭐',
            color: 'gold',
            gradient: 'from-gold/20 to-amber-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`glass-panel p-6 group cursor-pointer
            hover:shadow-xl hover:shadow-${card.color}-500/20
            border-${card.color}-500/20
          `}
                    style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                >
                    {/* Icon & Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className={`text-3xl animate-float`} style={{ animationDelay: `${index * 0.2}s` }}>
                            {card.icon}
                        </div>
                        <div className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
              ${card.positive
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }
            `}>
                            {card.positive ? (
                                <FiArrowUpRight size={14} />
                            ) : (
                                <FiArrowDownLeft size={14} />
                            )}
                            {card.change}
                        </div>
                    </div>

                    {/* Title */}
                    <p className="text-sm text-muted font-medium mb-2">{card.title}</p>

                    {/* Value */}
                    <h3 className="text-2xl font-bold text-white mb-3">{card.value}</h3>

                    {/* Progress Bar */}
                    <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r from-${card.color === 'emerald' ? 'emerald-400' : 'gold'
                                } to-${card.color === 'emerald' ? 'emerald-600' : 'yellow-500'} rounded-full`}
                            style={{
                                width: `${Math.random() * 40 + 60}%`,
                            }}
                        ></div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300
            bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                </div>
            ))}
        </div>
    );
};

export default AnalyticsCards;
