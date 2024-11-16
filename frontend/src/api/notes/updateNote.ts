import { Note } from "../../hooks/useNotes";
import { api } from "../api";

export function updateNote(note: Note) {
    return api(`/api/note/${note._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: note.title,
            content: note.content,
            status: note.status,
        }),
    }).then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("Failed to update note");
        }
    });
}
