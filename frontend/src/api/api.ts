const baseUrl = import.meta.env.VITE_SERVER;

export async function api(path: string, init?: RequestInit) {
    const url = new URL(baseUrl);
    url.pathname = path;
    init = init || {};
    init.headers = init.headers || {};
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        // @ts-ignore
        init.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    const res = await fetch(url.toString(), init);
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth";
    }
    return res;
}
