import Link from "next/link";
import { TerminalSquare } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  Account: [
    { label: "Log in", href: ROUTES.login },
    { label: "Sign up", href: ROUTES.signup },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-shell grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-ink text-paper">
              <TerminalSquare className="size-4" />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
              interview<span className="text-cobalt">.engine</span>
            </span>
          </Link>
          <p className="mt-3 max-w-[220px] text-sm text-ink-soft">
            Mock interviews, graded like the real thing.
          </p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink-soft">{heading}</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-ink-soft transition-colors hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border py-6">
        <p className="container-shell text-xs text-ink-soft">
          © {new Date().getFullYear()} AI Interview Platform. Built for students, not for show.
        </p>
      </div>
    </footer>
  );
}
