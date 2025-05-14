import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-green-500/20 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="https://quantumone.b-cdn.net/resendit/resend-it-svg.svg"
                alt="Resend-It Logo"
                className="h-5 w-18 fill-current"
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
            
              </span>
            </div>
            <p className="text-gray-500 max-w-md">
              Smart reusable packaging as a service powered by multi-context AI and blockchain technologies.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-500 hover:text-green-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-green-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-gray-500 hover:text-green-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-500 hover:text-green-400 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Resend-It. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-green-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-green-400 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
