"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const isClickScrolling = useRef(false)

  // Scroll-based section tracking via IntersectionObserver
  useEffect(() => {
    const sectionIds = items
      .map((item) => item.url.replace("#", ""))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return

        for (const entry of entries) {
          if (entry.isIntersecting) {
            const matchedItem = items.find(
              (item) => item.url === `#${entry.target.id}`
            )
            if (matchedItem) {
              setActiveTab(matchedItem.name)
            }
          }
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (item: NavItem) => {
    setActiveTab(item.name)
    isClickScrolling.current = true
    // Allow observer to resume after scroll animation settles
    setTimeout(() => {
      isClickScrolling.current = false
    }, 1000)
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 sm:bottom-auto left-1/2 -translate-x-1/2 z-50",
        "mb-4 sm:mb-0 sm:pt-4 md:pt-6 pb-[env(safe-area-inset-bottom)] sm:pb-0",
        "px-2 sm:px-0 max-w-[min(100vw,28rem)] sm:max-w-none",
        className,
      )}
    >
      <div className="flex items-center gap-1 sm:gap-3 bg-black/40 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={() => handleClick(item)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold rounded-full transition-colors",
                "px-3 py-2.5 sm:px-6 min-h-[44px] min-w-[44px] flex items-center justify-center",
                "text-white/70 hover:text-white active:text-white",
                isActive && "bg-white/10 text-white",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden flex items-center justify-center">
                <Icon size={20} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                    <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}

