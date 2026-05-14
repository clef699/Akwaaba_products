import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-(--dark) text-white px-6 sm:px-12 lg:px-20 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/">
          <img src="/logo.png" alt="Akwaaba Products" className="h-16 w-auto" />
        </Link>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <li className="hover:text-(--primary)">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-(--primary)">
            <Link href="/shop">Shop</Link>
          </li>
          <li className="hover:text-(--primary)">
            <Link href="/vendors">Vendors</Link>
          </li>
          <li className="hover:text-(--primary)">
            <Link href="/help">Help</Link>
          </li>
          <li className="hover:text-(--primary)">
            <Link href="/privacy">Privacy</Link>
          </li>
        </ul>
        <p className="text-sm text-(--gray) text-center">
          © 2026 Akwaaba Products. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
