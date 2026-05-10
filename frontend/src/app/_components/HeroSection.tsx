import { motion } from "motion/react";
import Link from "next/link";
import { useSearchStore } from "../products/_store/search-store";

function HeroSection() {
  const { searchTerm, setSearchTerm } = useSearchStore();

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="font-[Bebas_Neue,Inter,Helvetica,sans-serif] uppercase text-white text-[64px] sm:text-[80px] lg:text-[96px] leading-[0.9] tracking-tight mb-8"
            style={{ fontWeight: 500 }}
          >
            JUST DO IT
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="bg-soft-cloud rounded-md h-[40px] px-4 flex items-center w-full max-w-md mt-8"
          >
            <svg
              className="h-4 w-4 text-charcoal mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              role="img"
              aria-label="Search"
            >
              <title>Search</title>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search our collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-ink placeholder:text-mute text-[16px] flex-1"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="mt-8"
          >
            <Link href="/products">
              <button
                type="button"
                className="bg-ink text-canvas text-body-strong rounded-full px-8 h-[48px] uppercase tracking-[0.05em] hover:bg-charcoal transition-colors"
              >
                Shop Now
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
