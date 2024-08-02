import './App.css'
import './assets/global.css'

import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainWrapper from "@/layouts/MainWrapper.jsx";
import {Header} from "@components/layout/header/Header.jsx";
import MainPage from "@/pages/MainPage.jsx";
import ComponentDemonstration from "@/pages/ComponentDemonstration.jsx";
import Logout from "@/pages/Logout.jsx";
import Login from "@/pages/Login.jsx";
import CategoriesPage from "@/pages/CategoriesPage.jsx";
import ProductsPage from "@/pages/ProductsPage.jsx";
import ProductPage from "@/pages/ProductPage.jsx";
import BasketPage from "@/pages/BasketPage.jsx";
import ContactsPage from "@/pages/ContactsPage.jsx";

function App() {

    return (
        <BrowserRouter>
            <MainWrapper>
                <Header></Header>
                <Routes>
                    <Route path="/" element={<MainPage></MainPage> } />

                    <Route path="/categories" element={ <CategoriesPage /> } />
                    <Route path="/categories/:id" element={ <CategoriesPage /> } />

                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductPage />} />

                    <Route path="/basket/" element={<BasketPage />} />

                    <Route path="/component-demonstration" element={<ComponentDemonstration></ComponentDemonstration> } />
                    <Route path="/login" element={<Login/> } />
                    <Route path="/logout" element={<Logout />} />

                    <Route path="/contacts" element={<ContactsPage />} />
                </Routes>
            </MainWrapper>
        </BrowserRouter>
    )
}

export default App
