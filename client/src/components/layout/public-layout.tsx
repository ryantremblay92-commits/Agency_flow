import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Zap } from "lucide-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          {children}
        </span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight">AgencyFlow</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/how-it-works">How it Works</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/case-studies">Case Studies</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold">Log in</Button>
            </Link>
            <Link href="/login">
              <Button className="font-semibold">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/how-it-works"><span className="text-lg font-medium">How it Works</span></Link>
                <Link href="/services"><span className="text-lg font-medium">Services</span></Link>
                <Link href="/case-studies"><span className="text-lg font-medium">Case Studies</span></Link>
                <Link href="/login">
                  <Button className="w-full mt-4">Login / Sign Up</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <span className="text-lg font-bold">AgencyFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The operating system for modern marketing agencies. Automate strategy, scale execution.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Integrations</li>
                <li>Pricing</li>
                <li>Changelog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 AgencyFlow Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
