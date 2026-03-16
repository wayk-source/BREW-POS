import { Coffee, TrendingUp, Users, Package, CreditCard, BarChart, Clock, Shield } from 'lucide-react'

const features = [
  {
    icon: Coffee,
    title: 'Fast Order Processing',
    description: 'Streamline your café operations with intuitive order management and quick checkout.',
    color: 'bg-[#6F4E37]/10 text-[#6F4E37]',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Analytics',
    description: 'Track sales, monitor trends, and make data-driven decisions with live dashboards.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Users,
    title: 'Staff Management',
    description: 'Manage employee schedules, roles, permissions, and performance tracking.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Package,
    title: 'Inventory Control',
    description: 'Monitor stock levels, track ingredients, and receive low-stock alerts automatically.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: CreditCard,
    title: 'Multiple Payment Options',
    description: 'Accept cash, cards, and mobile payments with secure payment processing.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: BarChart,
    title: 'Sales Reports',
    description: 'Generate detailed reports on sales, revenue, and customer behavior patterns.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: Clock,
    title: '24/7 Cloud Access',
    description: 'Access your POS from anywhere, anytime with cloud-based infrastructure.',
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with automatic backups and data encryption.',
    color: 'bg-indigo-100 text-indigo-600',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#F5EFE6] border border-[#C19A6B]/30 rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-semibold text-[#6F4E37]">FEATURES</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4B2E2B] mb-4">
            Everything You Need to Run Your Café
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            BREW POS provides all the tools and features you need to manage your café efficiently and grow your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-[#F5EFE6] rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-[#C19A6B]/20 group hover:border-[#6F4E37]/40"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#4B2E2B] mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

