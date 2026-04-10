import React, { useState } from 'react';

const ReportsSection = ({ full = false }) => {
    const [timeRange, setTimeRange] = useState('week');

    const chartData = {
        week: [65, 78, 89, 75, 92, 88, 95],
        month: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 88, 92],
    };

    const data = timeRange === 'week' ? chartData.week : chartData.month;
    const maxValue = Math.max(...data);
    const labels = timeRange === 'week'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const topVenues = [
        { name: 'Grand Ballroom', bookings: 145, revenue: '$45,200', trending: 'up' },
        { name: 'Botanical Garden', bookings: 128, revenue: '$38,900', trending: 'up' },
        { name: 'Convention Center', bookings: 98, revenue: '$52,100', trending: 'down' },
        { name: 'Intimate Lounge', bookings: 87, revenue: '$28,400', trending: 'up' },
    ];

    const bookingStats = [
        { label: 'Completed', value: 324, color: 'emerald', width: 75 },
        { label: 'Pending', value: 45, color: 'gold', width: 10 },
        { label: 'Cancelled', value: 12, color: 'red', width: 3 },
    ];

    return (
        <div className={full ? 'space-y-6' : ''}>
            {/* Revenue Chart */}
            <div className="glass-panel p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="heading-md">Revenue Trends</h3>
                        <p className="text-xs text-muted mt-1">Booking revenue over time</p>
                    </div>
                    <div className="flex gap-2">
                        {['week', 'month'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${timeRange === range
                                        ? 'bg-gold/30 text-gold border border-gold'
                                        : 'bg-white/5 text-muted border border-white/10 hover:border-gold/30'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="h-64 flex items-end justify-between gap-2">
                    {data.map((value, index) => {
                        const height = (value / maxValue) * 100;
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center group">
                                <div className="relative w-full h-48 flex items-end justify-center mb-2">
                                    <div
                                        className="w-3/4 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg
                      transition-all duration-300 group-hover:from-gold group-hover:to-gold/80
                      shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/30
                      group-hover:scale-105 origin-bottom"
                                        style={{ height: `calc(100% * ${height / 100})` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-muted text-center">{labels[index]}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-emerald-500/20 grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-muted mb-2">Total Revenue</p>
                        <p className="text-lg font-bold text-gold">$285,450</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted mb-2">Average Booking</p>
                        <p className="text-lg font-bold text-emerald-400">$6,240</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted mb-2">Growth Rate</p>
                        <p className="text-lg font-bold text-emerald-400">+18.5%</p>
                    </div>
                </div>
            </div>

            {full && (
                <>
                    {/* Top Venues Performance */}
                    <div className="glass-panel p-6 md:p-8">
                        <h3 className="heading-md mb-6">Top Performing Venues</h3>
                        <div className="space-y-4">
                            {topVenues.map((venue, index) => (
                                <div
                                    key={index}
                                    className="glass-panel-subtle p-4 hover:bg-emerald-500/10 transition"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-white">{venue.name}</h4>
                                            <p className="text-xs text-muted mt-1">{venue.bookings} bookings</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gold">{venue.revenue}</p>
                                            <p className={`text-xs ${venue.trending === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {venue.trending === 'up' ? '↑ +12.5%' : '↓ -3.2%'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                                            style={{ width: `${(venue.bookings / 150) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Status Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 md:p-8">
                            <h3 className="heading-md mb-6">Booking Status</h3>
                            <div className="space-y-4">
                                {bookingStats.map((stat) => (
                                    <div key={stat.label}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-white">{stat.label}</span>
                                            <span className="text-sm font-bold text-muted">{stat.value}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${stat.color === 'emerald' ? 'bg-emerald-500' :
                                                        stat.color === 'gold' ? 'bg-gold' :
                                                            'bg-red-500'
                                                    }`}
                                                style={{ width: `${stat.width}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Insights */}
                        <div className="glass-panel p-6 md:p-8">
                            <h3 className="heading-md mb-6">Customer Insights</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg">
                                    <span className="text-sm text-white">Avg. Rating</span>
                                    <span className="font-bold text-lg text-emerald-400">4.8/5 ⭐</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gold/10 rounded-lg">
                                    <span className="text-sm text-white">Repeat Customers</span>
                                    <span className="font-bold text-lg text-gold">68%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg">
                                    <span className="text-sm text-white">Avg. Booking Value</span>
                                    <span className="font-bold text-lg text-emerald-400">$6,240</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gold/10 rounded-lg">
                                    <span className="text-sm text-white">Customer Retention</span>
                                    <span className="font-bold text-lg text-gold">82%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!full && (
                <div className="glass-panel p-6 md:p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="heading-md">Top Venues</h3>
                            <p className="text-xs text-muted mt-1">Your best performing locations</p>
                        </div>
                        <button className="text-gold text-sm font-semibold hover:text-gold-light transition">
                            View All →
                        </button>
                    </div>
                    <div className="mt-6 space-y-3">
                        {topVenues.slice(0, 3).map((venue, index) => (
                            <div key={index} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition">
                                <div>
                                    <p className="text-sm font-medium text-white">{venue.name}</p>
                                    <p className="text-xs text-muted">{venue.bookings} bookings</p>
                                </div>
                                <p className="font-bold text-gold">{venue.revenue}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsSection;
