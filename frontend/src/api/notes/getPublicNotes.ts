import { api } from "../api";

export function getPublicNotes() {
    return api(`/api/note/shared-notes/${localStorage.getItem("userId")}`).then((res) => res.json());
}
