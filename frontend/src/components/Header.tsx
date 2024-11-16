import {
    CCollapse,
    CContainer,
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CHeader,
    CHeaderBrand,
    CHeaderNav,
    CTab,
    CTabList,
    CTabs,
} from "@coreui/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotes } from "../hooks/useNotes";
import { EModal } from "../pages/Home";
import ModalNote from "./ModalNote";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState<EModal>(EModal.NONE);
    // Determine active tab based on the current URL
    const getActiveTab = () => {
        if (location.pathname === "/home") return "home";
        if (location.pathname === "/public") return "public";
        return ""; // No tab selected if path is not defined
    };

    return (
        <>
            <CHeader className="!bg-transparent !border-0">
                <CContainer fluid>
                    <CHeaderBrand href="#">
                        <img src="/logo.png" alt="" className="h-12" />
                    </CHeaderBrand>
                    <CCollapse className="header-collapse flex justify-between flex-1" visible={true}>
                        <CTabs activeItemKey={getActiveTab()}>
                            <CTabList variant="pills">
                                <CTab
                                    itemKey="home"
                                    onClick={() => {
                                        navigate("/home");
                                    }}
                                >
                                    Home
                                </CTab>
                                <CTab
                                    itemKey="profile"
                                    onClick={() => {
                                        navigate("/public");
                                    }}
                                >
                                    Public
                                </CTab>
                            </CTabList>
                        </CTabs>
                        <CHeaderNav className="gap-10">
                            {location.pathname === "/home" && (
                                <button
                                    className="px-3  w-full  bg-gradient-to-r from-indigo-600 to-indigo-400 text-white font-semibold rounded-md shadow-lg transition-transform transform hover:scale-105"
                                    onClick={() => setVisible(EModal.CREATE)}
                                    type="submit"
                                >
                                    Create Note
                                </button>
                            )}

                            <ModalNote visible={visible} onClose={() => setVisible(EModal.NONE)} />

                            <CDropdown variant="nav-item">
                                <CDropdownToggle className="!text-white">
                                    {localStorage.getItem("username")}
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem
                                        onClick={() => {
                                            navigate("/change-password");
                                        }}
                                    >
                                        Change Password
                                    </CDropdownItem>
                                    <CDropdownDivider />
                                    <CDropdownItem
                                        onClick={() => {
                                            localStorage.removeItem("accessToken");
                                            navigate("/auth");
                                        }}
                                    >
                                        Logout
                                    </CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </CHeaderNav>
                    </CCollapse>
                </CContainer>
            </CHeader>
        </>
    );
}
