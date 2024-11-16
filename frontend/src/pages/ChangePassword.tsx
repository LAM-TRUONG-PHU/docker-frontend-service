import { CFormInput, CToast, CToastBody, CToastClose } from "@coreui/react";
import React, { useState } from "react";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const validatePassword = () => {
        const hasLetter = /[a-zA-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const isValidLength = newPassword.length >= 6;

        if (!isValidLength) {
            setPasswordError("Password must be at least 6 characters long.");
            return false;
        } else if (!hasLetter || !hasNumber) {
            setPasswordError("Password must contain at least one letter and one number.");
            return false;
        } else {
            setPasswordError("");
            return true;
        }
    };

    const validateConfirmPassword = () => {
        if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return false;
        } else {
            setConfirmPasswordError("");
            return true;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validatePassword() || !validateConfirmPassword()) return;

        setIsLoading(true);

        fetch(`${import.meta.env.VITE_SERVER}/api/auth/changePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            credentials: "include",
            body: JSON.stringify({
                oldPwr: currentPassword,
                newPwr: newPassword,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Wrong password");
                }

                setIsLoading(false);
                setError("");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setSuccess(true);
            })
            .catch((error) => {
                setIsLoading(false);
                setError(error.message);
            });
    };

    return (
        <>
            <CToast
                autohide={false}
                visible={success}
                color="success"
                className="text-white align-items-center  absolute top-0 right-0 m-5"
            >
                <div className="d-flex">
                    <CToastBody>Change password successfully</CToastBody>
                    <CToastClose className="me-2 m-auto" white />
                </div>
            </CToast>
            <div
                className="backdrop-filter-container mx-auto w-2/5 "
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px) saturate(200%)",
                    borderRadius: "12px",
                    padding: "40px",
                    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
                }}
            >
                <div className="flex items-center justify-center ">
                    <div className="w-full max-w-md">
                        <h2 className="text-gray-800 text-xl font-semibold py-3">Change Password</h2>

                        {/* Current Password */}
                        <form method="POST" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-500 text-white p-2 mb-4 rounded-md text-center">
                                    {error}
                                </div>
                            )}
                            <div className="mb-3">
                                <label
                                    className="text-gray-600 text-sm font-medium"
                                    htmlFor="current-password"
                                >
                                    Current Password
                                </label>
                                <CFormInput
                                    type="password"
                                    placeholder="Enter your current password"
                                    aria-label="Current password"
                                    className="border-gray-300 rounded-md mt-2 shadow-sm"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>

                            {/* New Password */}
                            <div className="mb-3">
                                <label className="text-gray-600 text-sm font-medium" htmlFor="new-password">
                                    New Password
                                </label>
                                <CFormInput
                                    type="password"
                                    placeholder="Enter a new password"
                                    aria-label="New password"
                                    className="border-gray-300 rounded-md mt-2 shadow-sm"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onBlur={validatePassword}
                                />
                                {passwordError && (
                                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div className="mb-6">
                                <label
                                    className="text-gray-600 text-sm font-medium"
                                    htmlFor="confirm-password"
                                >
                                    Confirm New Password
                                </label>
                                <CFormInput
                                    type="password"
                                    placeholder="Confirm your new password"
                                    aria-label="Confirm password"
                                    className="border-gray-300 rounded-md mt-2 shadow-sm"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={validateConfirmPassword}
                                />
                                {confirmPasswordError && (
                                    <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
                                )}
                            </div>

                            {/* Save Changes Button */}
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
                                    "Save changes"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
