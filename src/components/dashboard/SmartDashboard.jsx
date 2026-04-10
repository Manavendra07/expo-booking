import React, { useState } from 'react';
// import '../styles/dashboard.css';
import "../../styles/dashboard.css";
// import Sidebar from './dashboard/Sidebar';
import Sidebar from "../dashboard/Sidebar";
import TopNav from '../dashboard/TopNav';
import AnalyticsCards from '../dashboard/AnalyticsCards';
import InteractiveCalendar from '../dashboard/InteractiveCalendar';
import ModernBookingForm from '../dashboard/ModernBookingForm';
import ReportsSection from '../dashboard/ReportsSection';
import AIChatInterface from '../dashboard/AIChatInterface';

const SmartDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showChat, setShowChat] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div className="animate-fade-in-up">
                            <h1 className="heading-xl mb-2">Welcome Back, Sarah</h1>
                            <p className="text-muted">Here's your venue booking overview for this week</p>
                        </div>
                        <AnalyticsCards />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <InteractiveCalendar />
                            </div>
                            <div>
                                <ReportsSection />
                            </div>
                        </div>
                    </div>
                );
            case 'booking':
                return (
                    <div className="animate-fade-in-up">
                        <h1 className="heading-xl mb-2">Create New Booking</h1>
                        <p className="text-muted mb-8">Reserve your perfect venue with our intelligent booking system</p>
                        <ModernBookingForm />
                    </div>
                );
            case 'reports':
                return (
                    <div className="animate-fade-in-up">
                        <h1 className="heading-xl mb-2">Performance Reports</h1>
                        <p className="text-muted mb-8">Detailed analytics and insights on your bookings</p>
                        <ReportsSection full />
                    </div>
                );
            case 'ai':
                return (
                    <div className="animate-fade-in-up">
                        <h1 className="heading-xl mb-2">AI Insights Engine</h1>
                        <p className="text-muted mb-8">Advanced analytics powered by artificial intelligence</p>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="glass-panel p-8">
                                    <h3 className="heading-md mb-4">Smart Recommendations</h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="glass-panel-subtle p-4 hover:bg-emerald-500/10 cursor-pointer transition">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-emerald flex-center flex-shrink-0">
                                                        <span className="text-lg">✨</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold mb-1">Recommendation {i}</h4>
                                                        <p className="text-sm text-muted">Based on your booking patterns and preferences, we suggest considering premium venues for weekend events.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="glass-panel p-6">
                                    <h3 className="heading-md mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-muted mb-2">Accuracy Rate</p>
                                            <p className="text-2xl font-bold text-amber-400">94.7%</p>
                                        </div>
                                        <div>
                                            <p className="text-muted mb-2">Bookings Analyzed</p>
                                            <p className="text-2xl font-bold text-emerald-400">2,847</p>
                                        </div>
                                        <div>
                                            <p className="text-muted mb-2">Avg. Cost Savings</p>
                                            <p className="text-2xl font-bold text-gold">$3,240</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse-glow"></div>
                <div className="absolute bottom-[-30%] left-[-5%] w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl"></div>
            </div>

            {/* Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <TopNav
                    onChatToggle={() => setShowChat(!showChat)}
                    isChatOpen={showChat}
                />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-8 max-w-7xl">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* AI Chat Interface */}
            {showChat && (
                <AIChatInterface onClose={() => setShowChat(false)} />
            )}
        </div>
    );
};

export default SmartDashboard;
