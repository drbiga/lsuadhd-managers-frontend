import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Management from "./pages/Management";
import Login from "./pages/Login";
import { AuthRequired } from "./hooks/auth";
import SignUp from "./pages/SignUp";
import NextSession from "./pages/NextSession";
import SessionProgress from "./pages/SessionProgress";

function App() {
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
            path: "/session-progress",
            element: (
                <AuthRequired authRoute="/login">
                    <SessionProgress />
                </AuthRequired>
            )
        },
        {
            path: "/",
            element: (
                <AuthRequired authRoute="/login">
                    <NextSession />
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
