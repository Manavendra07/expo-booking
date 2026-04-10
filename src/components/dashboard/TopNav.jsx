import React from 'react';
import { Bell, Search, MessageCircle, Settings } from 'lucide-react';

const TopNav = ({ onChatToggle, isChatOpen }) => {
    return (
        <div className="glass-panel-subtle border-b border-emerald-500/20 px-8 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between gap-6">
                {/* Left: Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={18} />
                        <input
                            type="text"
                            placeholder="Search bookings, venues..."
                            className="w-full pl-10 pr-4 py-2.5 bg-emerald-900/20 border border-emerald-500/30 rounded-lg
                focus:outline-none focus:border-gold/60 focus:bg-emerald-900/30
                text-white text-sm placeholder-muted transition
                backdrop-filter backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-6">
                    {/* Notifications */}
                    <button className="relative p-2.5 hover:bg-emerald-500/10 rounded-lg transition group">
                        <FiBell size={20} className="group-hover:text-gold transition" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    {/* AI Chat Toggle */}
                    <button
                        onClick={onChatToggle}
                        className={`p-2.5 rounded-lg transition ${isChatOpen
                            ? 'bg-gold/20 text-gold'
                            : 'hover:bg-emerald-500/10 text-white hover:text-gold'
                            }`}
                    >
                        <FiMessageCircle size={20} />
                    </button>

                    {/* Settings */}
                    <button className="p-2.5 hover:bg-emerald-500/10 rounded-lg transition group">
                        <FiSettings size={20} className="group-hover:text-gold transition" />
                    </button>

                    {/* Divider */}
                    <div className="w-px h-8 bg-emerald-500/20"></div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-white">Sarah Johnson</p>
                            <p className="text-xs text-muted">Elite Member</p>
                        </div>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-emerald-400 flex-center text-sm font-bold text-black">
                                SJ
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
