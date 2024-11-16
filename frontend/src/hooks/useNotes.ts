import { useState } from "react";
import { useAtom } from "jotai";
import { notesAtom, publicNotesAtom } from "../atom";
import * as noteApi from "../api/notes/index";
export type Note = {
    _id?: string;
    title?: string;
    content?: string;
    status: string;
    owner?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export const useNotes = () => {
    const [notes, setNotes] = useAtom(notesAtom);
    const [publicNotes, setPublicNotes] = useAtom(publicNotesAtom);

    const createNote = (note: Note) => {
        noteApi.createNote(note).then((res) => {
            setNotes([...notes, res.note]);
        });
    };

    const getPrivateNotes = () => {
        noteApi.getPrivateNotes().then((res) => {
            setNotes(res);
        });
    };

    const getPublicNotes = () => {
        noteApi.getPublicNotes().then((res) => {
            setPublicNotes(res.notes);
        });
    };

    const updateNote = (note: Note) => {
        noteApi.updateNote(note).then((res) => {
            setNotes(notes.map((n) => (n._id === res.note._id ? res.note : n)));
        });
    };

    const deleteNote = (id: string) => {
        noteApi.deleteNote(id).then(() => {
            setNotes(notes.filter((n) => n._id !== id));
        });
    };

    return { notes, publicNotes, createNote, updateNote, deleteNote, getPrivateNotes, getPublicNotes };
};
