import { CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle } from "@coreui/react";
import { useEffect, useState } from "react";
import { Note } from "../hooks/useNotes";
import { MdPublic } from "react-icons/md";
import { EModal } from "../pages/Home";
import { IoIosLock } from "react-icons/io";
import { mdParser } from "./ModalNote";

type TProps = {
    bgColor?: string;
    setVisible: React.Dispatch<React.SetStateAction<EModal>>;
    note: Note;
};

export function NoteCard(props: TProps) {
    const [title, setTitle] = useState(props.note?.title || "Title");
    const [content, setContent] = useState(props.note?.content || "");
    const renderedMarkdown = mdParser.render(content);

    useEffect(() => {
        setTitle(props.note?.title || "Title");
        setContent(props.note?.content || "");
        console.log("status", props.note?.status);
    }, [props.note]);

    return (
        <>
            <CCard
                className="!border !shadow-lg w-11/12  !mx-auto !h-52"
                onClick={() => {
                    console.log("clicked");
                    props.setVisible(EModal.UPDATE || EModal.VIEW);
                }}
            >
                <CCardHeader style={{ backgroundColor: props.bgColor || "#007bff" }}>
                    <span className="text-white bg-[rgba(0,0,0,0.2)]  backdrop-blur-md rounded-lg px-2 flex items-center w-fit">
                        {props.note?.status === "1" ? (
                            <>
                                <IoIosLock className="inline-block mr-1" />
                                Private
                            </>
                        ) : (
                            <>
                                <MdPublic className="inline-block mr-1" />
                                Public
                            </>
                        )}
                    </span>
                </CCardHeader>
                <CCardBody className="!flex !flex-col justify-between overflow-hidden">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        <CCardTitle>{props.note?.title}</CCardTitle>
                        <CCardText
                            className="line-clamp-3 overflow-hidden text-ellipsis"
                            dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                        ></CCardText>
                    </div>
                    <div className="text-sm text-gray-400"> {props.note?.createdAt?.toString()}</div>
                </CCardBody>
            </CCard>
        </>
    );
}
