import { Note } from "../../hooks/useNotes";
import { api } from "../api";

export function createNote(note: Note) {
    return api(`/api/note/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: note.title,
            content: note.content,
            status: note.status,
            owner: note.owner,
        }),
    }).then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("Failed to create note");
        }
    });
}
