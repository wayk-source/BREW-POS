import { Coffee } from 'lucide-react'

interface BrewPosLogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  subtitleClassName?: string
}

export function BrewPosLogo({
  className = '',
  iconClassName = 'h-10 w-10',
  textClassName = 'text-xl',
  subtitleClassName = 'text-xs',
}: BrewPosLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`bg-[#6F4E37] text-white flex items-center justify-center rounded-xl shadow-sm ${iconClassName}`}
      >
        <Coffee className="h-3/5 w-3/5" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight text-[#3E2723] ${textClassName}`}>
          BREW POS
        </span>
        <span className={`font-medium text-[#795548] mt-0.5 ${subtitleClassName}`}>
          Café Point of Sale
        </span>
      </div>
    </div>
  )
}
