import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CPopover,
    CFormInput,
    CInputGroup,
    CInputGroupText,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import markdownit from "markdown-it";
import { IoIosLink, IoIosSearch } from "react-icons/io";
import hljs from "highlight.js";
import "highlight.js/styles/default.css";
import { EModal } from "../pages/Home";
import { Note, useNotes } from "../hooks/useNotes";
import { IoIosTrash } from "react-icons/io";

type TProps = {
    visible: EModal;
    onClose: () => void;
    currentNote?: Note | null;
};

export const mdParser = new markdownit({
    html: true,
    linkify: true,
    typographer: true,
    xhtmlOut: true,
    breaks: true,
    langPrefix: "language-",
    highlight: function (str: string, lang: string): string {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return (
                    '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    "</code></pre>"
                );
            } catch (__) {}
        }

        return '<pre class="hljs"><code>' + mdParser.utils.escapeHtml(str) + "</code></pre>";
    },
});

export default function ModalNote(props: TProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(``);
    const [search, setSearch] = useState("");
    const [noti, setNoti] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const renderedMarkdown = mdParser.render(content);
    const [userId, setUserId] = useState("");
    const { createNote, updateNote, deleteNote } = useNotes();

    useEffect(() => {
        if (props.visible === EModal.CREATE) {
            setTitle("");
            setContent("");
        } else if (props.currentNote) {
            setTitle(props.currentNote.title!);
            setContent(props.currentNote.content!);
        }
    }, [props.visible, props.currentNote]);

    const handleSendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_SERVER}/api/note/share`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                email: search,
                noteId: props.currentNote!._id,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error sending email");
                }
                updateNote({
                    _id: props.currentNote!._id,
                    status: "2",
                });
                setIsLoading(false);
                setNoti("Email sent");
            })
            .catch((error) => {
                setIsLoading(false);
                setNoti(error.message);
            });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_SERVER}/api/auth/searchUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                query: search,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    setNoti("User not found");
                    return;
                }
                return res.json();
            })
            .then((data) => {
                setNoti(data.message);
                setUserId(data.data._id);
                console.log(data);
            });
    };

    const handleCreateNote = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createNote({
            title: title,
            content: content,
            status: "1",
            owner: localStorage.getItem("userId")!,
        });
        props.onClose();
    };

    const handleUpdateNote = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateNote({
            _id: props.currentNote!._id,
            title: title,
            content: content,
            status: "1",
        });
        props.onClose();
    };

    const handleDeleteNote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        deleteNote(props.currentNote!._id!);
        props.onClose();
    };

    return (
        <CModal
            alignment="center"
            scrollable
            size="xl"
            visible={
                props.visible === EModal.CREATE ||
                props.visible === EModal.UPDATE ||
                props.visible === EModal.VIEW
            }
            onClose={() => props.onClose()}
            aria-labelledby="VerticallyCenteredScrollableExample2"
        >
            <CModalHeader className="flex justify-between">
                <input
                    type="text"
                    className="border-none focus:ring-0 outline-none rounded text-xl px-2 flex-1"
                    placeholder="Enter title"
                    value={title || ""}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {props.visible == EModal.UPDATE && (
                    <div className="flex gap-3">
                        <CPopover
                            title="Sharing"
                            onHide={() => setNoti("")}
                            content={
                                <div>
                                    <form
                                        method="POST"
                                        onSubmit={handleSearch}
                                        className="flex items-center gap-2"
                                    >
                                        <CInputGroup>
                                            <CInputGroupText id="basic-addon1">@</CInputGroupText>
                                            <CFormInput
                                                placeholder="Username"
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                                onChange={(e) => {
                                                    setNoti("");
                                                    setSearch(e.target.value);
                                                }}
                                            />
                                        </CInputGroup>

                                        <button
                                            color="secondary"
                                            type="submit"
                                            className="bg-slate-300 rounded-full p-1 hover:bg-slate-400 active:bg-slate-500"
                                        >
                                            <IoIosSearch size={32} />
                                        </button>
                                    </form>
                                    <div
                                        className={`${
                                            noti === "Successfully! search user" || "Email sent"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        } `}
                                    >
                                        {noti}
                                    </div>
                                    <form method="POST" onSubmit={handleSendEmail}>
                                        <input type="hidden" value={userId} required name="username" />
                                        <button
                                            className=" flex justify-center w-full mt-10 py-3 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white font-semibold rounded-md shadow-lg transition-transform transform hover:scale-105"
                                            // onClick={handleSaveChanges}
                                            type="submit"
                                        >
                                            {isLoading ? (
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white "
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                "Send email"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            }
                            placement="right"
                        >
                            <button
                                type="button"
                                className="flex items-center bg-indigo-300 text-black font-medium py-2 px-3 rounded 
               transition transform duration-200 ease-in-out
               hover:bg-indigo-400 hover:scale-105 active:bg-indigo-500 active:scale-95"
                            >
                                <IoIosLink />
                                Share note
                            </button>
                        </CPopover>
                        <button
                            onClick={handleDeleteNote}
                            type="button"
                            className="flex items-center bg-red-300 text-black font-medium py-2 px-3 rounded 
               transition transform duration-200 ease-in-out
               hover:bg-red-400 hover:scale-105 active:bg-red-500 active:scale-95"
                        >
                            <IoIosTrash />
                            Delete
                        </button>
                    </div>
                )}
            </CModalHeader>
            <form
                method="POST"
                onSubmit={props.visible == EModal.CREATE ? handleCreateNote : handleUpdateNote}
            >
                <CModalBody className="!flex gap-x-4">
                    <textarea
                        className="border-none focus:ring-0 outline-none p-2 rounded w-1/2 resize-none"
                        rows={8}
                        placeholder="Enter text"
                        value={content || ""}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div
                        className="w-1/2 p-2 bg-gray-100 rounded overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                    />
                </CModalBody>

                <CModalFooter className="flex justify-between w-full">
                    <div className="flex-1">
                        {props.visible == EModal.UPDATE && (
                            <div className="text-sm text-gray-400">
                                Last edited on {props.currentNote?.createdAt?.toString()}
                            </div>
                        )}
                    </div>
                    {props.visible != EModal.VIEW && (
                        <div className="flex gap-2">
                            <CButton color="secondary" onClick={() => props.onClose()}>
                                Close
                            </CButton>
                            <CButton color="success" className="!text-white" type="submit">
                                {props.visible == EModal.CREATE ? "Create Note" : "Save changes"}
                            </CButton>
                        </div>
                    )}
                </CModalFooter>
            </form>
        </CModal>
    );
}
