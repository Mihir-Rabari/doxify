import { Link } from 'react-router-dom';
import { FileText, Zap, Shield, Users, ArrowRight, Github, Star, Check, Sparkles } from 'lucide-react';
import { Globe } from '@/components/ui/globe';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { Particles } from '@/components/ui/particles';
import { LightRays } from '@/components/ui/light-rays';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/authStore';

const features = [
  {
    Icon: Zap,
    name: 'Lightning Fast',
    description: 'Create and edit documentation in real-time with instant updates.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-transparent" />
    ),
  },
  {
    Icon: Shield,
    name: 'Secure & Private',
    description: 'Your documentation is encrypted and stored securely with enterprise-grade security.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
        <Particles className="absolute inset-0" quantity={50} />
      </div>
    ),
  },
  {
    Icon: Users,
    name: 'Team Collaboration',
    description: 'Work together seamlessly with your team in real-time.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/10" />
    ),
  },
  {
    Icon: FileText,
    name: 'Rich Editor',
    description: 'Write beautiful documentation with our powerful markdown editor.',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-transparent" />
    ),
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for personal projects and getting started',
    features: [
      'Up to 3 projects',
      'Basic markdown editor',
      'Community support',
      '1GB storage',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$12',
    description: 'For professionals and growing teams',
    features: [
      'Unlimited projects',
      'Advanced editor features',
      'Priority support',
      '100GB storage',
      'Custom domains',
      'Version history',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with advanced needs',
    features: [
      'Everything in Pro',
      'SSO & SAML',
      'Advanced security',
      'Unlimited storage',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function Landing() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-slate-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl blur-md opacity-50" />
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Doxify
              </span>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-200 hover:scale-105"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-200 hover:scale-105"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-black dark:via-slate-950 dark:to-black" />
        <LightRays
          className="absolute inset-0"
          count={12}
          color={theme === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.1)'}
          blur={40}
          speed={16}
          length="80vh"
        />
        <Particles
          className="absolute inset-0"
          quantity={80}
          ease={80}
          color={theme === 'dark' ? '#10b981' : '#000000'}
          refresh
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800 px-4 py-1.5">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Trusted by 10,000+ developers
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  Documentation
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Create, manage, and share beautiful documentation with your team. 
                Powerful markdown editor, real-time collaboration, and enterprise-grade security.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://github.com/yourusername/doxify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2 border border-gray-200 dark:border-slate-700"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">50K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Documents</div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-blue-500/20 rounded-3xl blur-3xl" />
              <div className="relative">
                <Globe
                  className="w-full h-[500px]"
                  config={{
                    width: 800,
                    height: 800,
                    onRender: () => {},
                    devicePixelRatio: 2,
                    phi: 0,
                    theta: 0.3,
                    dark: theme === 'dark' ? 1 : 0,
                    diffuse: 0.4,
                    mapSamples: 16000,
                    mapBrightness: theme === 'dark' ? 1.2 : 6,
                    baseColor: theme === 'dark' ? [0.3, 0.3, 0.3] : [1, 1, 1],
                    markerColor: [16 / 255, 185 / 255, 129 / 255],
                    glowColor: theme === 'dark' ? [0.1, 0.1, 0.1] : [1, 1, 1],
                    markers: [
                      { location: [37.7749, -122.4194], size: 0.1 },
                      { location: [40.7128, -74.006], size: 0.1 },
                      { location: [51.5074, -0.1278], size: 0.08 },
                      { location: [35.6762, 139.6503], size: 0.08 },
                      { location: [1.3521, 103.8198], size: 0.07 },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
              Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-emerald-500 bg-clip-text text-transparent">
                document with confidence
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for modern teams who care about documentation.
            </p>
          </div>

          <BentoGrid>
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
              Pricing
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that's right for you. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.featured
                    ? 'border-2 border-primary-500 shadow-2xl shadow-primary-500/20 scale-105'
                    : 'border border-gray-200 dark:border-slate-800'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary-600 to-primary-500 text-white border-0 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className="text-gray-600 dark:text-gray-400">/month</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link
                    to={isAuthenticated ? '/dashboard' : '/register'}
                    className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      plan.featured
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/50'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-200/20 via-transparent to-transparent dark:from-primary-500/10" />
        <LightRays
          className="absolute inset-0"
          count={8}
          color={theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.08)'}
          blur={60}
          speed={18}
          length="50vh"
        />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-700/50 rounded-3xl p-12 lg:p-16 shadow-2xl">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-emerald-500/5 dark:from-primary-500/10 dark:to-emerald-500/10 rounded-3xl" />
            
            <div className="relative text-center space-y-8">
              <Badge className="bg-gradient-to-r from-primary-500 to-emerald-500 text-white border-0 px-4 py-1.5">
                <Sparkles className="w-3 h-3 mr-1 inline" />
                Start Building Today
              </Badge>
              
              <h2 className="text-4xl lg:text-6xl font-black bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent leading-tight">
                Ready to transform your
                <br />
                <span className="bg-gradient-to-r from-primary-600 via-emerald-500 to-teal-500 dark:from-primary-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  documentation?
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join thousands of teams already using Doxify to create beautiful, professional documentation.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-emerald-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://github.com/yourusername/doxify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
              </div>

              <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-slate-950/50 border-t border-gray-200 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl blur-md opacity-50" />
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Doxify
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 Doxify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
