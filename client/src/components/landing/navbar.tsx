"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

export default function Navbar() {

  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold">PP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Ping-Park</span>
          </Link>
        </div>

        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-4 shadow-lg">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="#features"
                    className="text-gray-600 hover:text-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="text-gray-600 hover:text-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                 
                  <Link
                    href="#faq"
                    className="text-gray-600 hover:text-emerald-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <div className="pt-2 flex flex-col space-y-2">
                    <Button variant="secondary" onClick={() => router.push('/account/auth?tab=login')}>Log In</Button>
                    <Button onClick={() => router.push('/account/auth?tab=signup')}>Sign Up</Button>
                  </div>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-emerald-500">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-emerald-500">
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-emerald-500">
                Pricing
              </Link>
              <Link href="#faq" className="text-sm font-medium text-gray-600 hover:text-emerald-500">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" onClick={() => router.push('/account/auth?tab=login')}>Log In</Button>
              <Button onClick={() => router.push('/account/auth?tab=signup')}>Sign Up</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
