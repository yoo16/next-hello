import MemoList from "@/app/components/MemoList";

export default function HomePage() {
    return (
        <div className="container mx-auto bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-center mb-6">📝 簡単メモアプリ</h1>
            <MemoList />
        </div>
    );
}
