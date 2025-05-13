export async function addMemo(text: string): Promise<boolean> {
    const res = await fetch("/api/memo/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    return res.ok;
}