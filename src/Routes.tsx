import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Management from "./pages/Management";
import Login from "./pages/Auth/Login";
import { AuthRequired } from "./hooks/auth";
import SessionGroups from "./pages/Management/SessionGroups";
import { SessionGroupPage } from "./pages/Management/SessionGroup";
import SessionProgressManagementPage from "./pages/Management/SessionProgress";
import Students from "./pages/Management/Students";
import TrackingData from "./pages/Management/TrackingData";
import Budget from "./pages/Budget";
import FailedSessions from "./pages/Management/FailedSessions";

export enum RouteNames {
    BASENAME = '/lsuadhd-managers-frontend',
    HOME = '/',
    LOGIN = '/login',
    SESSION_PROGRESS = '/session-progress',
    MANAGEMENT = '/management',
    SESSION_GROUPS = '/session-groups',
    INDIVIDUAL_SESSION_GROUP = '/session-group',
    MANAGEMENT__STUDENTS = '/students',
    TRACKING_STATS = '/tracking',
    BUDGET = '/budget',
    FAILED_SESSIONS = '/failed-sessions',
}

export default function Routes() {
    const router = createBrowserRouter([
        {
            path: RouteNames.LOGIN,
            element: <Login />
        },
        {
            path: RouteNames.HOME,
            element: (
                <AuthRequired authRoute={RouteNames.LOGIN}>
                    <Management />
                </AuthRequired>
            )
        },
        {
            path: RouteNames.SESSION_PROGRESS,
            element: (
                <AuthRequired authRoute={RouteNames.LOGIN}>
                    <SessionProgressManagementPage />
                </AuthRequired>
            )
        },
        {
            path: RouteNames.MANAGEMENT,
            element: (
                <AuthRequired authRoute={RouteNames.LOGIN}>
                    <Management />
                </AuthRequired>
            ),
        },
        {
            path: RouteNames.SESSION_GROUPS,
            element: (
                <AuthRequired authRoute={RouteNames.LOGIN}>
                    <SessionGroups />
                </AuthRequired>
            ),
        },
        {
            path: RouteNames.INDIVIDUAL_SESSION_GROUP,
            element: (
                <AuthRequired authRoute={RouteNames.LOGIN}>
                    <SessionGroupPage />
                </AuthRequired>
            ),
        },
        {
            path: RouteNames.MANAGEMENT__STUDENTS,
            element: (
                <AuthRequired authRoute={RouteNames.LOGIN}>
                    <Students />
                </AuthRequired>
            )
        },
        {
            path: RouteNames.TRACKING_STATS,
            element: (
                <AuthRequired authRoute={RouteNames.LOGIN}>
                    <TrackingData />
                </AuthRequired>
            )
        },
        {
            path: RouteNames.BUDGET,
            element: (
                <AuthRequired authRoute={RouteNames.LOGIN}>
                <Budget />
                </AuthRequired>
            )
        },
        {
            path: RouteNames.FAILED_SESSIONS,
            element: (
                <AuthRequired authRoute={RouteNames.LOGIN}>
                    <FailedSessions />
                </AuthRequired>
            )
        },
    ], {
        basename: RouteNames.BASENAME
    });

    return (
        <RouterProvider router={router} />
    )
}