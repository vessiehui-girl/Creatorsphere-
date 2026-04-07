import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useLogout } from '../hooks/useLogout';

const HomePage = () => {
    const { data: user } = useCurrentUser();
    const logoutMutation = useLogout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                navigate('/auth');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                <h1 className="text-xl font-bold text-blue-400">Creatorsphere</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="px-4 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                    >
                        {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                {/* Greeting */}
                <section>
                    <h2 className="text-2xl font-semibold">
                        Welcome back{user?.email ? `, ${user.email.split('@')[0] || user.email}` : ''}! 👋
                    </h2>
                    <p className="text-gray-400 mt-1">Here's what's happening with your content today.</p>
                </section>

                {/* Activity Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Posts Scheduled', value: '—' },
                        { label: 'Vault Items', value: '—' },
                        { label: 'Reach This Week', value: '—' },
                        { label: 'Engagement Rate', value: '—' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-gray-800 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-blue-400">{stat.value}</p>
                            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* Quick Actions */}
                <section>
                    <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: '+ New Post', icon: '✏️' },
                            { label: 'Add to Vault', icon: '🗄️' },
                            { label: 'View Planner', icon: '📅' },
                            { label: 'Analytics', icon: '📊' },
                        ].map((action) => (
                            <button
                                key={action.label}
                                className="flex items-center gap-2 justify-center bg-gray-800 hover:bg-gray-700 rounded-lg p-3 text-sm transition-colors"
                            >
                                <span>{action.icon}</span>
                                <span>{action.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Upcoming Post */}
                    <section className="bg-gray-800 rounded-lg p-5">
                        <h3 className="font-semibold mb-3">📅 Upcoming Post</h3>
                        <p className="text-gray-400 text-sm">No posts scheduled yet. Head to the Planner to create one.</p>
                    </section>

                    {/* Recent Vault Items */}
                    <section className="bg-gray-800 rounded-lg p-5">
                        <h3 className="font-semibold mb-3">🗄️ Recent Vault Items</h3>
                        <p className="text-gray-400 text-sm">Your vault is empty. Add ideas, assets, and drafts here.</p>
                    </section>
                </div>

                {/* Platform Status */}
                <section>
                    <h3 className="text-lg font-semibold mb-3">Platform Status</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'LinkedIn'].map((platform) => (
                            <span
                                key={platform}
                                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                            >
                                {platform} — not connected
                            </span>
                        ))}
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Sphere Intel */}
                    <section className="bg-gray-800 rounded-lg p-5">
                        <h3 className="font-semibold mb-3">🧠 Sphere Intel</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>→ What's trending in your niche?</li>
                            <li>→ Best times to post this week</li>
                            <li>→ Content ideas based on your vault</li>
                        </ul>
                    </section>

                    {/* Community Activity */}
                    <section className="bg-gray-800 rounded-lg p-5">
                        <h3 className="font-semibold mb-3">🌐 Community Activity</h3>
                        <p className="text-gray-400 text-sm">No community activity yet. Join or create a Sphere to get started.</p>
                    </section>
                </div>

                {/* Analytics Shortcut */}
                <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-5 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">📊 Analytics Overview</h3>
                        <p className="text-sm text-blue-200 mt-1">Connect platforms to see detailed performance metrics.</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-colors">
                        View Analytics
                    </button>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
