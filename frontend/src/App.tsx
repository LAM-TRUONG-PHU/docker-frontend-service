import { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Public from "./pages/Public";
import "@coreui/coreui/dist/css/coreui.min.css";
import "highlight.js/styles/androidstudio.css";
import Header from "./components/Header";
import ChangePassword from "./pages/ChangePassword";
import PrivateRoutes from "./routes/PrivateRoutes";

function App() {
    const location = useLocation();
    const routes = ["/home", "/public", "/change-password"];

    return (
        <>
            {!routes.includes(location.pathname) ? (
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            ) : (
                <>
                    <Header />
                    <Routes>
                        <Route path="/" element={<PrivateRoutes />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/public" element={<Public />} />
                            <Route path="/change-password" element={<ChangePassword />} />
                        </Route>
                    </Routes>
                </>
            )}
        </>
    );
}

export default App;
