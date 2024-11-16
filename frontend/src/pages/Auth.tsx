import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

export default function Auth() {
    const [account, setAccount] = useState({
        email: "",
        password: "",
        name: "",
        username: localStorage.getItem("email")?.split("@")[0] || "",
    });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [side, setSide] = useState(0);
    const [styleImg, setStyleImg] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            navigate("/home");
        }
    }, [navigate]);
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const url =
            side === 0
                ? `${import.meta.env.VITE_SERVER}/api/auth/login`
                : `${import.meta.env.VITE_SERVER}/api/auth/`;
        const bodyData =
            side === 0
                ? { username: account.username, password: account.password }
                : { email: account.email, password: account.password, name: account.name };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong!");
            }

            const data = await response.json();
            if (side === 0) {
                localStorage.setItem("accessToken", data.data.accessToken);
                localStorage.setItem("userId", data.data.user._id);
                localStorage.setItem("username", data.data.user.username);
                navigate("/");
            } else {
                localStorage.setItem("email", account.email);
                setSide(0);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (localStorage.getItem("email") && inputRef.current) {
            inputRef.current.value = localStorage.getItem("email") as string;
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setStyleImg(side ? true : false);
        }, 100);
    }, [side]);

    return (
        <>
            <div className="bg-gray-100 flex justify-center items-center h-screen relative">
                <div
                    className="absolute data-[side=0]:left-1/2 data-[side=1]:left-0 transition-all duration-300 ease-in-out w-1/2 h-screen hidden lg:block"
                    data-side={side}
                >
                    {styleImg ? (
                        <img
                            src="/background_login.jpg"
                            alt="Placeholder Image"
                            className="object-cover w-full h-full "
                        />
                    ) : (
                        <img
                            src="background_signup.jpg"
                            alt="Placeholder Image"
                            className="object-cover w-full h-full"
                        />
                    )}
                </div>

                <div
                    className="absolute xl:p-28 md:p-20 sm:20 p-8 w-full lg:w-1/2 flex justify-center items-center bg-gray-100 data-[side=0]:left-0 lg:data-[side=1]:left-1/2 transition-all duration-300 ease-in-out"
                    data-side={side}
                >
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full 2xl:w-3/4">
                        <a href="/home" className="inline-block mb-4 text-blue-500 hover:text-blue-600">
                            <FaHome size={24} />
                        </a>
                        {side == 0 ? (
                            <div>
                                <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
                                <form action="#" method="POST" onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="bg-red-500 text-white p-2 mb-4 rounded-md text-center">
                                            {error}
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <label className="block text-gray-600">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                            onChange={(e) => {
                                                if (error) setError("");
                                                setAccount({ ...account, username: e.target.value });
                                            }}
                                            ref={inputRef}
                                        />
                                    </div>

                                    <div className="mb-4 relative">
                                        <label className="block text-gray-600">Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 pr-10"
                                            onChange={(e) => {
                                                if (error) setError("");
                                                setAccount({ ...account, password: e.target.value });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="text-gray-500" />
                                            ) : (
                                                <FaEye className="text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="mb-4 flex items-center">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            name="remember"
                                            className="text-blue-500"
                                            onChange={(e) => setIsSignedIn(e.target.checked)}
                                        />
                                        <label className="text-gray-600 ml-2">Stay signed in</label>
                                    </div>
                                    <div className="mb-6 text-blue-500">
                                        <a href="/forgot-password" className="hover:underline">
                                            Forgot Password?
                                        </a>
                                    </div>
                                    <button
                                        disabled={isLoading}
                                        type="submit"
                                        className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full flex justify-center items-center ${
                                            isLoading ? "opacity-50" : ""
                                        }`}
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
                                            "Sign In"
                                        )}
                                    </button>
                                </form>
                                <div className="mt-6 text-blue-500 text-center">
                                    <button
                                        className="hover:underline"
                                        onClick={() => {
                                            if (error) setError("");

                                            setSide(side ? 0 : 1);
                                        }}
                                    >
                                        Sign up Here
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
                                <form action="#" method="POST" onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="bg-red-500 text-white p-2 mb-4 rounded-md text-center">
                                            {error}
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <label className="block text-gray-600">Email</label>
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                            onChange={(e) => {
                                                if (error) setError("");
                                                setAccount({ ...account, email: e.target.value });
                                            }}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                            onChange={(e) => {
                                                if (error) setError("");
                                                setAccount({ ...account, name: e.target.value });
                                            }}
                                        />
                                    </div>
                                    <div className="mb-4 relative">
                                        <label className="block text-gray-600">Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 pr-10"
                                            onChange={(e) => {
                                                if (error) setError("");
                                                setAccount({ ...account, password: e.target.value });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="text-gray-500" />
                                            ) : (
                                                <FaEye className="text-gray-500" />
                                            )}
                                        </button>
                                    </div>

                                    <button
                                        disabled={isLoading} // Disable button when loading
                                        type="submit"
                                        className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full flex justify-center items-center ${
                                            isLoading ? "opacity-50" : ""
                                        }`}
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
                                            "Create Account"
                                        )}
                                    </button>
                                </form>
                                <div className="mt-6 text-blue-500 text-center">
                                    Already have an account?{" "}
                                    <button
                                        className="hover:underline"
                                        onClick={() => {
                                            if (error) setError("");
                                            setSide(side ? 0 : 1);
                                        }}
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
