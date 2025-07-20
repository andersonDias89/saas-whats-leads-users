'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Zap, 
  Users, 
  BarChart3, 
  Shield, 
  Smartphone,
  ArrowRight,
  Play,
  Check,
  Globe,
  TrendingUp,
  DollarSign
} from 'lucide-react'

export function Hero() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Index</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground-secondary hover:text-foreground transition-colors">
              Home
            </Link>
            <div className="flex items-center space-x-1 text-foreground-secondary hover:text-foreground transition-colors cursor-pointer">
              <span>All Pages</span>
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
            <Link href="/pricing" className="text-foreground-secondary hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-foreground-secondary hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-foreground-secondary hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
          <Link href="/register">
            <Button variant="default" size="sm">
              Começar Grátis
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Funding Badge */}
          <div className="inline-flex items-center space-x-2 bg-background-secondary rounded-full px-4 py-2 mb-8">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground-secondary">We raised $1M as pre-seed fund</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            The <span className="text-primary">AI SaaS</span> your product needs
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-foreground-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Our AI SaaS solution enhances your product with advanced artificial intelligence, 
            streamlining operations and driving efficiency and innovation.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Começar Grátis
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Saiba Mais
              </Button>
            </Link>
          </div>

          {/* Dashboard Mockup */}
          <div className="bg-background-secondary rounded-xl p-6 mb-20">
            <div className="flex space-x-4">
              {/* Sidebar */}
              <div className="w-16 bg-background rounded-lg p-2 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full h-8 bg-border rounded"></div>
                ))}
              </div>
              {/* Main Content */}
              <div className="flex-1 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-background rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 mb-20 opacity-60">
            {['Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum'].map((logo, i) => (
              <div key={i} className="flex items-center space-x-2 text-foreground-secondary">
                <div className="w-6 h-6 bg-primary rounded"></div>
                <span className="text-sm font-medium">{logo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Access to the future of work
          </h2>
          <p className="text-lg text-foreground-secondary max-w-3xl mx-auto mb-16">
            Experience intelligent automation, seamless integrations, real-time insights, 
            user-friendly interface, and top-notch security all in one platform.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Large Green Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8 text-left">
                <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Scalability
                </Badge>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Build Scalable product with the help of our AI
                </h3>
                <p className="text-foreground-secondary leading-relaxed">
                  Easily scale your resources up or down based on business needs without hardware limitations.
                </p>
              </CardContent>
            </Card>

            {/* Video Card */}
            <Card className="bg-background-secondary border-border overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="aspect-video bg-gradient-to-br from-background-tertiary to-background-secondary flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary-foreground ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smaller Cards */}
            <Card className="bg-background-secondary border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium text-foreground">Subscription Successful</span>
                </div>
                <p className="text-xs text-foreground-muted">Today, 09:24</p>
              </CardContent>
            </Card>

            <Card className="bg-background-secondary border-border">
              <CardContent className="p-6">
                <div className="h-16 bg-primary/10 rounded mb-3 flex items-end justify-between px-2 pb-1">
                  {[30, 60, 45, 80, 65].map((height, i) => (
                    <div key={i} className="w-2 bg-primary rounded-t" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="text-2xl font-bold text-foreground">90%</div>
              </CardContent>
            </Card>

            <Card className="bg-background-secondary border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-6 h-6 bg-primary rounded-full"></div>
                  ))}
                </div>
                <p className="text-sm text-foreground-secondary">
                  Our users span across the different continents of the world.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background-secondary border-border">
              <CardContent className="p-6">
                <h4 className="text-primary font-semibold mb-2">Analytics and Insights</h4>
                <p className="text-sm text-foreground-secondary">
                  Gain valuable insights through built-in analytics tools for data-driven decision-making and optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background-secondary border-border">
              <CardContent className="p-6">
                <h4 className="text-primary font-semibold mb-2">Cost-effectiveness</h4>
                <p className="text-sm text-foreground-secondary">
                  Reduce upfront costs with a subscription-based model and avoid hardware maintenance expenses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">
              Ready to transform your business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of companies already using our AI-powered solutions
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-secondary py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Index</span>
              </div>
              <p className="text-foreground-secondary text-sm">
                Empowering businesses with AI-driven solutions for the future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">Status</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-foreground-secondary text-sm">
              &copy; 2024 Index. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 