import { Coffee, Users, TrendingUp, Award } from 'lucide-react'

const stats = [
  {
    icon: Coffee,
    value: '500+',
    label: 'Active Cafés',
    description: 'Worldwide',
  },
  {
    icon: Users,
    value: '10K+',
    label: 'Daily Transactions',
    description: 'Processed',
  },
  {
    icon: TrendingUp,
    value: '47%',
    label: 'Avg. Revenue Growth',
    description: 'For clients',
  },
  {
    icon: Award,
    value: '99.9%',
    label: 'Uptime',
    description: 'Guaranteed',
  },
]

export function StatsSection() {
  return (
    <section id="pricing" className="py-16 bg-gradient-to-br from-[#4B2E2B] to-[#6F4E37] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-xl mb-4 group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Icon className="w-8 h-8 text-[#C19A6B]" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-[#C19A6B] mb-1">{stat.label}</div>
                <div className="text-sm text-white/70">{stat.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

