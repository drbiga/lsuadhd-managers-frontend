import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useCallback, useEffect } from "react";
import MySessions from "./pages/MySessions";
import Management from "./pages/Management";
import Login from "./pages/Login";
import { AuthRequired, useAuth } from "./hooks/auth";
import SignUp from "./pages/SignUp";

function App() {
    const { authState } = useAuth();

    const router = createBrowserRouter([
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/signup",
            element: <SignUp />
        },
        {
            path: "/",
            element: (
                <AuthRequired authRoute="/login">
                    <MySessions />
                </AuthRequired>
            )
        },
        {
            path: "/management",
            element: (
                <AuthRequired authRoute="/login">
                    <Management />
                </AuthRequired>
            ),
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}

export default App
