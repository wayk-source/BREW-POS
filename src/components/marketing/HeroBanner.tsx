import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BarChart3, Coffee, TrendingUp, Users2 } from 'lucide-react'

export function HeroBanner() {
  const imgSrc = '/hero-dashboard.jpeg'
  return (
    <section id="about" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#F5EFE6]" />
        <div
          className="absolute inset-y-0 right-0 w-1/2 hidden lg:block opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 30%, rgba(75,46,43,0.12), transparent 55%), radial-gradient(circle at 65% 65%, rgba(193,154,107,0.18), transparent 55%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 items-stretch">
          <div className="py-10 sm:py-14 lg:py-16 lg:pr-12 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-[#4B2E2B]">
              Transform Your
              <br />
              Café Operations
              <br />
              with <span className="text-[#6F4E37]">BREW POS</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#4B2E2B]/70 max-w-xl leading-relaxed">
              BREW POS is a web-based point-of-sale system designed to help cafés manage orders, staff, inventory,
              and sales in one powerful platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#C19A6B] hover:bg-[#A98658] text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
              <div className="bg-white/65 border border-[#C19A6B]/25 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-[#C19A6B]/25 flex items-center justify-center text-[#4B2E2B]">
                  <Coffee className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-[#4B2E2B]">Fast Orders</div>
                  <div className="text-xs text-[#4B2E2B]/60">Quick service</div>
                </div>
              </div>
              <div className="bg-white/65 border border-[#C19A6B]/25 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-[#C19A6B]/25 flex items-center justify-center text-[#4B2E2B]">
                  <BarChart3 className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-[#4B2E2B]">Analytics</div>
                  <div className="text-xs text-[#4B2E2B]/60">Real-time data</div>
                </div>
              </div>
              <div className="bg-white/65 border border-[#C19A6B]/25 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-[#C19A6B]/25 flex items-center justify-center text-[#4B2E2B]">
                  <Users2 className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-[#4B2E2B]">Staff Mgmt</div>
                  <div className="text-xs text-[#4B2E2B]/60">Easy control</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative py-10 sm:py-14 lg:py-16 lg:pl-10 flex items-center justify-center">
            <div className="absolute inset-0 -z-10 hidden lg:block">
              <div
                className="absolute inset-0 opacity-25 animate-bg-pan"
                style={{
                  backgroundImage: `url(${imgSrc})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <div className="absolute inset-0 bg-[#F5EFE6]/40" />
            </div>

            <div className="relative w-full max-w-[560px] lg:max-w-[720px]">
              <div className="absolute -top-6 -right-6 hidden sm:block bg-white rounded-2xl shadow-xl border border-[#C19A6B]/25 px-4 py-3 animate-float-delayed z-20">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-[#F5EFE6] border border-[#C19A6B]/25 flex items-center justify-center text-[#4B2E2B]">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-lg font-bold text-[#4B2E2B]">2,847</div>
                    <div className="text-xs text-[#4B2E2B]/60">Orders Today</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden sm:block bg-white rounded-2xl shadow-xl border border-[#C19A6B]/25 px-4 py-3 animate-float z-20">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-700">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-lg font-bold text-[#4B2E2B]">+47%</div>
                    <div className="text-xs text-[#4B2E2B]/60">Sales Growth</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#0f172a] shadow-2xl border border-black/10 overflow-hidden animate-bounce-soft relative z-10">
                <div className="flex items-center justify-between px-4 py-3 bg-[#0b1225] border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs text-white/70">BREW POS Dashboard</div>
                </div>
                <div className="bg-white aspect-[16/10] overflow-hidden relative">
                  <Image
                    src={imgSrc}
                    alt="BREW POS dashboard preview"
                    fill
                    sizes="(min-width: 1024px) 640px, 92vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
