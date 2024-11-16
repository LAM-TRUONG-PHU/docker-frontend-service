import React, { useEffect, useState } from "react";
import { NoteCard } from "../components/NoteCard";
import ModalNote from "../components/ModalNote";
import { EModal } from "./Home";
import { Note, useNotes } from "../hooks/useNotes";

export default function Public() {
    const [visible, setVisible] = useState<EModal>(EModal.NONE);
    const { notes, getPublicNotes, publicNotes } = useNotes();
    const [currentNote, setCurrentNote] = useState<Note | null>(null);

    useEffect(() => {
        console.log("public notes", publicNotes);
        console.log("currentNote", currentNote);
    }, [publicNotes, currentNote]);

    useEffect(() => {
        getPublicNotes();
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
                {publicNotes.map((note) => (
                    <NoteCard
                        key={note._id}
                        note={note}
                        bgColor="#7EACB5"
                        setVisible={() => {
                            setCurrentNote(note);
                            setVisible(EModal.VIEW);
                        }}
                    />
                ))}
            </div>

            <ModalNote currentNote={currentNote} visible={visible} onClose={() => setVisible(EModal.NONE)} />
        </div>
    );
}
