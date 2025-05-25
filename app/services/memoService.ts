/**
 * @param text メモのテキスト
 * @description メモを追加するAPIを呼び出す
 * @returns 
 */
export async function addMemo(text: string) {
    const res = await fetch("/api/memo/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    const result = await res.json();
    if (res.ok) {
        return result;
    } else {
        return { message: "メモの追加に失敗しました" };
    }
}

/**
 * @description メモ一覧を取得する
 * @returns メモ一覧
 */
export async function loadMemos(){
    const res = await fetch("/api/memo/list");
    const result = await res.json();
    if (res.ok) {
        return result;
    } else {
        return { message: "メモ一覧取得に失敗しました", memos: [] };
    }
}

/**
 * @param text メモのテキスト
 * @description メモを削除するAPIを呼び出す
 * @returns 
 */
export async function removeMemo(index: number) {
    const res = await fetch("/api/memo/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
    });
    const result = await res.json();
    if (res.ok) {
        return result;
    } else {
        return { message: "メモの削除に失敗しました" };
    }
}