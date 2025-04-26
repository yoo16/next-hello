import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full bg-blue-600 text-white shadow">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* サイトタイトル */}
                <h1 className="text-2xl font-bold tracking-tight">
                    Next.js Sample
                </h1>

                {/* メニューリンク */}
                <nav className="flex gap-4 text-sm font-medium">
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                    <Link href="/counter" className="hover:underline">
                        Counter
                    </Link>
                    <Link href="/todo" className="hover:underline">
                        To‑Do
                    </Link>
                </nav>
            </div>
        </header>
    );
}
