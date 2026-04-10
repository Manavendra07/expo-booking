import React from 'react';
import { Link } from 'react-router-dom';
import SmartDashboard from '../components/dashboard/SmartDashboard';

const DashboardDemo = () => {
    const [showDemo, setShowDemo] = React.useState(false);

    if (showDemo) {
        return <SmartDashboard />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Navigation */}
            <nav className="border-b border-emerald-500/20 bg-black/30 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-gold">
                        ExpoInn Smart Booking Engine
                    </h1>
                    <Link to="/" className="text-muted hover:text-gold transition">
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
                </div>

                <div className="text-center max-w-4xl">
                    <div className="mb-8 animate-fade-in-up">
                        <span className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-400 rounded-full text-sm text-emerald-300 font-semibold mb-6">
                            ✨ Premium Dashboard UI System
                        </span>
                    </div>

                    <h2 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-gold">
                            Luxury Booking Experience
                        </span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        A stunning ultra-premium smart booking engine dashboard featuring glassmorphism,
                        elegant animations, and intuitive user experience inspired by luxury hospitality brands.
                    </p>

                    <div className="flex gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <button
                            onClick={() => setShowDemo(true)}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-emerald-500/40 transition transform hover:scale-105"
                        >
                            Launch Full Demo →
                        </button>
                        <Link
                            to="/"
                            className="px-8 py-4 border border-gold text-gold rounded-lg font-semibold hover:bg-gold/10 transition"
                        >
                            Explore Features
                        </Link>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                        {[
                            { icon: '🎨', title: 'Glassmorphism', desc: 'Translucent panels with blur effects' },
                            { icon: '✨', title: 'Animations', desc: 'Smooth micro-interactions & transitions' },
                            { icon: '📊', title: 'Analytics', desc: 'Real-time metrics & insights' },
                            { icon: '🤖', title: 'AI Chat', desc: 'Intelligent booking assistant' },
                            { icon: '📅', title: 'Calendar', desc: 'Color-coded event management' },
                            { icon: '🏨', title: 'Venues', desc: 'Premium venue selection interface' },
                            { icon: '💎', title: 'Premium UX', desc: 'Luxury hotel experience' },
                            { icon: '🌙', title: 'Dark Theme', desc: 'Emerald & gold luxury palette' },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="glass-panel p-6 hover:shadow-lg hover:shadow-emerald-500/20 transition text-center"
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`,
                                }}
                            >
                                <div className="text-3xl mb-3">{feature.icon}</div>
                                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Showcase Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 space-y-20">
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-gold">
                        Key Features Included
                    </h2>

                    <div className="space-y-4">
                        <FeatureCard
                            title="Smart Sidebar Navigation"
                            description="Collapsible sidebar with icon navigation. Switch between Dashboard, Bookings, Reports, and AI Insights with elegant animations."
                            features={['Icon-based navigation', 'Collapse/expand toggle', 'Animated transitions', 'Premium styling']}
                        />
                        <FeatureCard
                            title="Advanced Analytics Dashboard"
                            description="Real-time metrics cards showing total bookings, revenue, upcoming events, and customer satisfaction with animated progress bars."
                            features={['4 premium metric cards', 'Live statistics', 'Trend indicators', 'Interactive hover effects']}
                        />
                        <FeatureCard
                            title="Interactive Calendar View"
                            description="Color-coded calendar with event management. Hover to see event details, navigate months, and view event types at a glance."
                            features={['Month navigation', 'Color-coded events', 'Tooltip previews', 'Event filtering']}
                        />
                        <FeatureCard
                            title="Modern Booking Form"
                            description="Self-contained booking system with floating labels, venue selection cards, date/time pickers, and real-time price estimation."
                            features={['Floating labels', 'Venue cards', 'Price calculator', 'Special requirements']}
                        />
                        <FeatureCard
                            title="Reports & Analytics"
                            description="Detailed reports with revenue charts, top venues, booking status distribution, and customer insights with interactive visualizations."
                            features={['Bar charts', 'Performance metrics', 'Customer stats', 'Time-range filtering']}
                        />
                        <FeatureCard
                            title="AI Chat Interface"
                            description="Floating AI assistant with conversation history, typing animations, suggested questions, and message bubbles for smart recommendations."
                            features={['Message bubbles', 'Typing animation', 'Suggested questions', 'Floating widget']}
                        />
                        <FeatureCard
                            title="Premium Top Navigation"
                            description="Search bar, notification bell, AI chat toggle, settings access, and user profile with status indicator displaying current user info."
                            features={['Search functionality', 'Notifications', 'User profile', 'Status indicator']}
                        />
                    </div>
                </div>

                {/* Design System */}
                <div className="glass-panel p-12">
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-gold mb-8">
                        Design System
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-emerald-400 mb-4">Color Palette</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-400 border border-emerald-300"></div>
                                        <span className="text-white">Emerald Green (#1a4d3e, #2d8659)</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-600 to-amber-300 border border-amber-400"></div>
                                        <span className="text-white">Gold (#d4af37, #e6c547)</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 border border-slate-500"></div>
                                        <span className="text-white">Deep Black (#0f1419)</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-emerald-400 mb-4">Effects & Styles</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>✓ Glassmorphism (20px blur)</li>
                                    <li>✓ Soft glowing borders</li>
                                    <li>✓ Rounded corners (2xl)</li>
                                    <li>✓ Smooth transitions</li>
                                    <li>✓ Premium shadows</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gold mb-4">Animations</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>✓ Fade in up (0.6s)</li>
                                    <li>✓ Slide in left/right</li>
                                    <li>✓ Pulse glow effects</li>
                                    <li>✓ Float animations</li>
                                    <li>✓ Hover transforms</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gold mb-4">Typography</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>✓ Minimal & luxurious</li>
                                    <li>✓ Clear hierarchy</li>
                                    <li>✓ Premium font weighting</li>
                                    <li>✓ Elegant letter spacing</li>
                                    <li>✓ High readability</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="glass-panel p-12 text-center">
                    <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-gold">
                        Ready to Experience Premium Luxury?
                    </h3>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Launch the full interactive dashboard to explore all features, animations, and the complete user experience.
                    </p>
                    <button
                        onClick={() => setShowDemo(true)}
                        className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-emerald-500/40 transition transform hover:scale-105"
                    >
                        Open Interactive Dashboard →
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-emerald-500/20 bg-black/50 py-12 mt-20">
                <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
                    <p>ExpoInn Smart Booking Engine - Premium Dashboard UI System</p>
                    <p className="mt-2 text-sm">Designed with luxury, elegance, and user experience in mind ✨</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ title, description, features }) => {
    return (
        <div className="glass-panel p-8">
            <h4 className="text-xl font-semibold text-emerald-400 mb-2">{title}</h4>
            <p className="text-gray-300 mb-4">{description}</p>
            <div className="flex flex-wrap gap-2">
                {features.map((feature, i) => (
                    <span key={i} className="badge-gold">
                        {feature}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default DashboardDemo;
