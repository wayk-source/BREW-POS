import Link from 'next/link'
import { ArrowRight, Coffee } from 'lucide-react'

export function CTASection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-[#F5EFE6] to-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gradient-to-br from-[#4B2E2B] to-[#6F4E37] rounded-2xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />

          <div className="relative z-10 p-12 md:p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C19A6B] rounded-xl mb-6">
              <Coffee className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Café?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Discover a modern café POS built for speed, clarity, and day-to-day operations.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="group bg-[#C19A6B] hover:bg-white text-white hover:text-[#4B2E2B] px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
