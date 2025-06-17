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
                    <nav className="space-x-4">
                        <Link href="/" className="text-white hover:underline">Home</Link>
                        <Link href="/counter" className="text-white hover:underline">Counter</Link>
                        <Link href="/profile" className="text-white hover:underline">Profile</Link>
                        <Link href="/memo" className="text-white hover:underline">Memo</Link>
                        <Link href="/webcam" className="text-white hover:underline">WebCamera</Link>
                        <Link href="/chat" className="text-white hover:underline">Chat</Link>
                    </nav>
                </nav>
            </div>
        </header>
    );
}
