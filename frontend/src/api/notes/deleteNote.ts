import { Note } from "../../hooks/useNotes";
import { api } from "../api";

export function deleteNote(id: string) {
    return api(`/api/note/${id}/`, {
        method: "DELETE",
    }).then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("Failed to delete note");
        }
    });
}
