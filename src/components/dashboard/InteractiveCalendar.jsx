import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const InteractiveCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 3, 1));

    const mockEvents = {
        5: { type: 'booking', title: 'Wedding - Grand Hall', guests: 250 },
        12: { type: 'conference', title: 'Tech Summit 2024', guests: 500 },
        18: { type: 'corporate', title: 'Annual Gala', guests: 150 },
        24: { type: 'private', title: 'Private Event', guests: 80 },
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const getEventColor = (type) => {
        const colors = {
            booking: 'bg-emerald-500/30 border-emerald-400',
            conference: 'bg-blue-500/30 border-blue-400',
            corporate: 'bg-gold/30 border-gold',
            private: 'bg-purple-500/30 border-purple-400',
        };
        return colors[type] || colors.booking;
    };

    const getEventTextColor = (type) => {
        const colors = {
            booking: 'text-emerald-300',
            conference: 'text-blue-300',
            corporate: 'text-gold',
            private: 'text-purple-300',
        };
        return colors[type] || colors.booking;
    };

    return (
        <div className="glass-panel p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="heading-md">Event Calendar</h2>
                    <p className="text-sm text-muted mt-1">April 2024 - Your upcoming bookings</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                        className="p-2 hover:bg-emerald-500/20 rounded-lg transition"
                    >
                        <FiChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                        className="p-2 hover:bg-emerald-500/20 rounded-lg transition"
                    >
                        <FiChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Month/Year */}
            <h3 className="text-center font-semibold text-lg mb-6 text-gold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-muted py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {emptyDays.map((i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                ))}

                {/* Day cells */}
                {days.map((day) => {
                    const event = mockEvents[day];
                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

                    return (
                        <div
                            key={day}
                            className={`
                aspect-square rounded-lg p-2 cursor-pointer group relative overflow-hidden
                ${event
                                    ? `glass-panel border-2 ${getEventColor(event.type)} hover:shadow-lg transform hover:scale-105`
                                    : 'bg-white/5 border border-transparent hover:border-emerald-500/50 hover:bg-white/[0.08]'
                                }
                ${isToday ? 'ring-2 ring-gold' : ''}
                transition-all duration-300
                flex flex-col justify-center items-center
              `}
                        >
                            <div className={`text-sm font-semibold ${event ? 'text-white' : 'text-white/80'}`}>
                                {day}
                            </div>

                            {event && (
                                <div className="mt-1 text-xs flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${event.type === 'booking' ? 'bg-emerald-400' :
                                        event.type === 'conference' ? 'bg-blue-400' :
                                            event.type === 'corporate' ? 'bg-gold' :
                                                'bg-purple-400'
                                        }`}></span>
                                </div>
                            )}

                            {/* Tooltip on hover */}
                            {event && (
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition
                  flex flex-col justify-center items-center text-center p-2 rounded-lg z-10">
                                    <p className="text-xs font-semibold text-white mb-1">{event.title}</p>
                                    <p className="text-xs text-muted">{event.guests} guests</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-8 border-t border-emerald-500/20 flex flex-wrap gap-6">
                {[
                    { color: 'bg-emerald-500/30', label: 'Booking', border: 'border-emerald-400' },
                    { color: 'bg-blue-500/30', label: 'Conference', border: 'border-blue-400' },
                    { color: 'bg-gold/30', label: 'Corporate', border: 'border-gold' },
                    { color: 'bg-purple-500/30', label: 'Private', border: 'border-purple-400' },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${item.color} border ${item.border}`}></div>
                        <span className="text-xs text-muted">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InteractiveCalendar;
