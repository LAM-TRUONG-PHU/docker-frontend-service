import { useEffect, useState } from "react";
import ModalNote from "../components/ModalNote";
import { NoteCard } from "../components/NoteCard";
import { Note, useNotes } from "../hooks/useNotes";

export enum EModal {
    CREATE,
    UPDATE,
    DELETE,
    VIEW,
    NONE,
}
export default function Home() {
    const [visible, setVisible] = useState<EModal>(EModal.NONE);
    const { notes, getPrivateNotes } = useNotes();

    const [currentNote, setCurrentNote] = useState<Note | null>(null);

    useEffect(() => {
        console.log(notes);
        console.log("currentNote", currentNote);
    }, [notes, currentNote]);

    useEffect(() => {
        getPrivateNotes();
    }, []);

    return (
        <div className="w-full">
            <div
                className="backdrop-filter-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mx-auto mt-4 w-11/12
                overflow-y-auto scrollable-container"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(10px) saturate(150%)",
                    borderRadius: "8px",
                    padding: "30px",
                    height: "80vh",
                }}
            >
                {notes.map((note) => (
                    <NoteCard
                        key={note._id}
                        note={note}
                        bgColor="#7EACB5"
                        setVisible={() => {
                            setCurrentNote(note);
                            setVisible(EModal.UPDATE);
                        }}
                    />
                ))}
            </div>

            <ModalNote currentNote={currentNote} visible={visible} onClose={() => setVisible(EModal.NONE)} />
        </div>
    );
}
