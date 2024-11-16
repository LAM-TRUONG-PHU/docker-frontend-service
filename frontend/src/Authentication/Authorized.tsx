import React from "react";
import { Navigate } from "react-router-dom";

interface AuthorizedProps {
    children: React.ReactNode;
}

export default function Authorized({ children }: AuthorizedProps) {
    const checkTokenExpiration = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return false;

        try {
            // Decode the JWT token to get the expiration time
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds

            return Date.now() < expirationTime;
        } catch {
            return false;
        }
    };

    if (!checkTokenExpiration()) {
        localStorage.removeItem("accessToken"); // Clear invalid token
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
}
