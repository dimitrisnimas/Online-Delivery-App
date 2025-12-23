import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, LayoutDashboard, ShoppingBag, Store, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                KubikDelivery
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-orange-600 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium hover:text-orange-600 transition-colors">Pricing</a>
              <a href="#about" className="text-sm font-medium hover:text-orange-600 transition-colors">About</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/superadmin/login" className="text-sm font-medium hover:text-orange-600 transition-colors">
                Login
              </Link>
              <Link
                href="/superadmin/login"
                className="px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-full hover:bg-orange-700 transition-all hover:shadow-lg hover:shadow-orange-500/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Launch Your <span className="text-orange-600">Delivery Empire</span> <br className="hidden md:block" />
            in Minutes, Not Months.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
            The all-in-one SaaS platform for multi-store food delivery management.
            Powerful analytics, seamless ordering, and unlimited scalability.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link
              href="/superadmin/login"
              className="px-8 py-4 text-lg font-bold text-white bg-orange-600 rounded-full hover:bg-orange-700 transition-all hover:scale-105 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://demo.kubikonlinedelivery.netlify.app"
              target="_blank"
              className="px-8 py-4 text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105"
            >
              View Live Demo
            </a>
          </div>

          <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video">
            {/* Replace with generated image */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <span className="text-slate-500">Hero Dashboard Preview</span>
              {/* <Image 
                    src="/hero_saas_dashboard_mobile.png" 
                    alt="Dashboard Preview" 
                    fill 
                    className="object-cover"
                /> */}
              {/* Note: I will uncomment this once image is moved to public */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Scale</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Built for aggregators, restaurant chains, and startups.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Store className="w-8 h-8 text-orange-600" />}
              title="Multi-Store Management"
              description="Manage unlimited stores from a single super admin dashboard. Each store gets its own secure environment."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
              title="Advanced Analytics"
              description="Track revenue, orders, and user growth across your entire platform with real-time visualized data."
            />
            <FeatureCard
              icon={<LayoutDashboard className="w-8 h-8 text-purple-600" />}
              title="Guest Checkout"
              description="Capture more sales with frictionless guest checkout. No account required for customers to order."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Choose the plan that fits your growth stage.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Starter"
              price="$29"
              features={["1 Store", "Basic Analytics", "Unlimited Orders", "Standard Support"]}
            />
            <PricingCard
              title="Growth"
              price="$99"
              isPopular
              features={["10 Stores", "Advanced Analytics", "Custom Domain Support", "Priority Support", "Guest Checkout"]}
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              features={["Unlimited Stores", "White Labeling", "Dedicated Account Manager", "API Access", "SLA"]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                <ShoppingBag className="text-white w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">KubikDelivery</span>
            </div>
            <p className="max-w-xs">Empowering food delivery businesses with next-gen technology.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-orange-500">Features</a></li>
              <li><a href="#" className="hover:text-orange-500">Pricing</a></li>
              <li><a href="#" className="hover:text-orange-500">Showcase</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-orange-500">About</a></li>
              <li><a href="#" className="hover:text-orange-500">Blog</a></li>
              <li><a href="#" className="hover:text-orange-500">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          © {new Date().getFullYear()} KubikDelivery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  )
}

function PricingCard({ title, price, features, isPopular }: { title: string, price: string, features: string[], isPopular?: boolean }) {
  return (
    <div className={`p-8 rounded-2xl border ${isPopular ? 'border-orange-500 ring-2 ring-orange-500/20 bg-white dark:bg-slate-900 relative' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'} flex flex-col`}>
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">MOST POPULAR</span>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-extrabold">{price}</span>
        {price !== "Custom" && <span className="text-slate-500">/month</span>}
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm text-slate-600 dark:text-slate-300">{feat}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-bold transition-all ${isPopular ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>
        Choose {title}
      </button>
    </div>
  )
}
