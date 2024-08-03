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
import CourseCatalog from "@components/courseCatalog/CourseCatalog.jsx";
import CourseModulesEditor from "@components/courseModulesEditor/CourseModulesEditor.jsx";
import LessonStepEditor from "@components/lessonStepEditor/LessonStepEditor.jsx";

function App() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <MainWrapper>
                    <Header />
                    <Routes>
                        {/* Главная страница */}
                        <Route path="/" element={<HomePage />} />

                        {/* Каталог курсов для пользователей */}
                        <Route path="/courses" element={<CourseCatalog />} />

                        {/* Страница модуля курса для преподавателей */}
                        <Route path="/user-courses" element={<UserCourses />} />
                        <Route path="/courses/:courseId/modules" element={<CourseModulesEditor />} />

                        <Route path="/courses/:courseId/modules/:moduleId/lessons/:lessonId/edit" element={<LessonStepEditor />} />

                        {/* Аутентификация */}
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </MainWrapper>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
