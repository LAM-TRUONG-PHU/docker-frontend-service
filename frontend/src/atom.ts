import { atom } from "jotai";
import { Note } from "./hooks/useNotes";

export const notesAtom = atom<Note[]>([]);
export const publicNotesAtom = atom<Note[]>([]);
