import React from 'react';
import { Home, Calendar, BarChart3, Brain, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'emerald' },
        { id: 'booking', label: 'New Booking', icon: Calendar, color: 'gold' },
        { id: 'reports', label: 'Reports', icon: BarChart3, color: 'emerald' },
        { id: 'ai', label: 'AI Insights', icon: Brain, color: 'gold' },
    ];

    return (
        <>
            {/* Sidebar */}
            <aside className={`
        fixed md:static top-0 left-0 h-screen z-40 transition-all duration-300
        ${isOpen ? 'w-72' : 'w-20'}
        bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
        border-r border-emerald-500/20
        flex flex-col
      `}>
                {/* Premium Header */}
                <div className="p-6 flex items-center justify-between border-b border-emerald-500/10">
                    {isOpen && (
                        <div className="animate-fade-in-up">
                            <h2 className="heading-md text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-gold">
                                ExpoInn
                            </h2>
                            <p className="text-xs text-muted mt-1">Smart Booking</p>
                        </div>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 hover:bg-emerald-500/10 rounded-lg transition ml-auto"
                    >
                        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-lg
                  transition-all duration-300 group
                  ${isActive
                                        ? 'bg-gradient-emerald text-white shadow-lg shadow-emerald-500/30'
                                        : 'text-gray-300 hover:bg-emerald-500/10'
                                    }
                `}
                            >
                                <Icon size={22} className={isActive ? 'text-white' : 'group-hover:text-gold transition'} />
                                {isOpen && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Accent */}
                {isOpen && (
                    <div className="p-6 border-t border-emerald-500/10">
                        <div className="glass-panel-subtle p-4 text-center">
                            <p className="text-xs font-semibold text-gold mb-2">Premium Plan</p>
                            <p className="text-xs text-muted">Unlimited Bookings</p>
                        </div>
                    </div>
                )}
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
