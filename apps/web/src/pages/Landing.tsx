import { Link } from 'react-router-dom';
import { FileText, Zap, Shield, Users, ArrowRight, Github, Star, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Landing() {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Build and deploy documentation in seconds with our optimized workflow',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your docs are encrypted and stored securely with enterprise-grade security',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team in real-time with seamless collaboration',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for personal projects',
      features: [
        '1 Project',
        'Unlimited Pages',
        'Basic Themes',
        'Community Support',
      ],
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      description: 'For professional teams',
      features: [
        'Unlimited Projects',
        'Unlimited Pages',
        'Custom Themes',
        'Priority Support',
        'Advanced Analytics',
        'Custom Domain',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'SSO & SAML',
        'Dedicated Support',
        'SLA Guarantee',
        'Custom Integrations',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0B0B]">
      {/* Navbar */}
      <nav className="h-[60px] bg-white dark:bg-[#0C0C0C] border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0C0C0C]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <FileText className="w-5 h-5 text-emerald-500" strokeWidth={2} />
            </div>
            <span className="text-base font-semibold text-gray-900 dark:text-white">Doxify</span>
          </Link>

          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              GitHub
            </a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="h-9 px-4 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center">
                  Sign In
                </Link>
                <Link to="/register" className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-medium rounded-lg transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/20">
            <Star className="w-4 h-4" />
            Open Source Documentation Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            Build beautiful docs
            <br />
            <span className="text-emerald-500">in seconds</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Create professional documentation for your projects with our powerful markdown-based platform. 
            Fast, simple, and beautiful.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-black text-base font-medium rounded-lg transition-all flex items-center gap-2 group">
              {isAuthenticated ? 'Go to Dashboard' : 'Start for Free'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="h-12 px-8 border border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-all text-base font-medium flex items-center gap-2">
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500 dark:text-neutral-500">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Open source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 md:px-8 py-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to document
          </h2>
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            Built for developers, designed for teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-2xl p-8 hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-8 py-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-2xl p-8 relative ${
                plan.popular
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-black text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-600 dark:text-neutral-400 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-700 dark:text-neutral-300">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full h-10 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-black'
                    : 'border border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24">
        <div className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-3xl p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join thousands of teams building beautiful documentation with Doxify
          </p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="inline-flex items-center gap-2 h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-black text-base font-medium rounded-lg transition-all group"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0C0C0C]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-base font-semibold text-gray-900 dark:text-white">Doxify</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              © 2025 Doxify. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Terms
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
