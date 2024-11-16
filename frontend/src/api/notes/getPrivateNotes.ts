import { api } from "../api";

export function getPrivateNotes() {
    return api(`/api/note/${localStorage.getItem("userId")}`).then((res) => res.json());
}
