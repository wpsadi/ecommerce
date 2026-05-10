import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-canvas text-ink border-t border-hairline">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {/* Resources */}
          <div className="py-6">
            <h3 className="text-[16px] text-ink mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/organization"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Organization
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="py-6 border-l border-hairline">
            <h3 className="text-[16px] text-ink mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="py-6 border-l border-hairline">
            <h3 className="text-[16px] text-ink mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Promotions & Discounts */}
          <div className="py-6 border-l border-hairline">
            <h3 className="text-[16px] text-ink mb-4">
              Promotions & Discounts
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sales"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Current Sales
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Newsletter
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="text-[14px] text-mute hover:text-ink"
                >
                  Promotions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-hairline mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] text-mute">
              © 2025 Ecomm. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-[9px] text-mute hover:text-ink"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-[9px] text-mute hover:text-ink"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
