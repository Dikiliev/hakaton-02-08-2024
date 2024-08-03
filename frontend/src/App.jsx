import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainWrapper from "@/layouts/MainWrapper.jsx";
import Logout from "@/pages/Logout.jsx";
import RegisterForm from "@components/auth/RegisterForm.jsx";
import LoginForm from "@components/auth/LoginForm.jsx";

import'@styles/global.css';

import theme from '@styles/theme';
import {CssBaseline, ThemeProvider} from "@mui/material";
import Header from "@components/header/Header.jsx";
import HomePage from "@pages/homePage/HomePage.jsx";
import CourseDetail from "@components/courseDetail/CourseDetail.jsx";
import LessonDetail from "@components/lessonDetail/LessonDetail.jsx";
import UserCourses from "@components/userCourses/UserCourses.jsx";
import LessonEditor from "@components/lessonEditor/LessonEditor.jsx";

function App() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <MainWrapper>
                    <Header></Header>
                    <Routes>
                        <Route path="/" element={<HomePage ></HomePage> } />
                        <Route path="/user-courses" element={<UserCourses />} />

                        <Route path="/courses/:courseId" element={<CourseDetail />} />
                        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonEditor />} />

                        <Route path="/login" element={<LoginForm/> } />
                        <Route path="/register" element={<RegisterForm/> } />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </MainWrapper>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
