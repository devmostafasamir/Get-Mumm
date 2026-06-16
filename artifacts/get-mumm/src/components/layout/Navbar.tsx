import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Globe, User, Phone } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { t, language, setLanguage, isRtl } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const navLinks = [
    { href: "/", label: t("Home", "الرئيسية") },
    { href: "/menu", label: t("Menu", "المنيو") },
    { href: "/for-offices", label: t("For Offices", "للشركات") },
    { href: "/about", label: t("About Us", "من نحن") },
    { href: "/blog", label: t("Blog", "المدونة") },
    { href: "/contact", label: t("Contact", "تواصل") },
  ];

  const toggleLanguage = () => setLanguage(language === "en" ? "ar" : "en");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex flex-col items-start shrink-0 z-50">
          <span className="text-xl sm:text-2xl font-serif font-bold text-primary tracking-tight leading-none">
            Get Mumm
          </span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground hidden sm:block mt-0.5">
            {t("Homemade Meals Delivered with Love", "وجبات منزلية بنكهة الحب")}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:text-primary hover:bg-primary/8 ${
                location === link.href ? "text-primary" : "text-foreground/80"
              }`}
            >
              {link.label}
              {location === link.href && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 35 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 z-50">
          {/* Language toggle — always visible */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border border-border hover:border-primary hover:text-primary transition-colors"
            aria-label="Toggle language"
            data-testid="button-toggle-language"
          >
            <Globe className="h-3.5 w-3.5" />
            {language === "en" ? "عر" : "EN"}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
            data-testid="button-toggle-theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Auth icon — desktop only */}
          <button className="hidden sm:flex p-2 rounded-full hover:bg-muted transition-colors" aria-label="Account">
            <User className="h-4 w-4" />
          </button>

          {/* Phone — md+ only */}
          <a
            href="tel:+201027671111"
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2"
          >
            <Phone className="h-3.5 w-3.5" />
            010 2767 1111
          </a>

          {/* Order Now CTA */}
          <Link href="/menu">
            <Button
              size="sm"
              className="hidden sm:inline-flex rounded-full bg-primary text-primary-foreground hover:bg-primary/85 font-bold shadow-sm px-5"
              data-testid="button-order-now"
            >
              {t("Order Now", "اطلب الآن")}
            </Button>
          </Link>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Full-screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 top-0 bg-background z-40 lg:hidden flex flex-col overflow-y-auto"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Header row inside mobile menu */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
              <span className="text-xl font-serif font-bold text-primary">Get Mumm</span>
              <button
                className="p-2 rounded-full hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col px-5 pt-6 gap-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3.5 px-4 rounded-xl text-lg font-medium transition-colors ${
                    location === link.href
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground hover:bg-muted"
                  }`}
                  data-testid={`link-mobile-${link.href.replace("/", "") || "home"}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Bottom actions in mobile menu */}
            <div className="px-5 pb-8 pt-4 space-y-3 border-t border-border mt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleLanguage}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                >
                  <Globe className="h-4 w-4" />
                  {language === "en" ? "العربية" : "English"}
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? t("Light Mode", "الوضع الفاتح") : t("Dark Mode", "الوضع الداكن")}
                </button>
              </div>
              <Link href="/menu" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-xl h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/85">
                  {t("Order Now", "اطلب الآن")}
                </Button>
              </Link>
              <a href="tel:+201027671111" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2">
                <Phone className="h-4 w-4" />
                +20 10 2767 1111
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
