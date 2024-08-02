import {useAuthStore} from "../store/auth";
import {ProductList} from "@components/layout/productsList/ProductList.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import apiInstance from "@utils/axios.js";
import HeaderText from "@components/common/headerText/HeaderText.jsx";
import {Box, Button, Container, Typography} from "@mui/material";
import { Link } from 'react-router-dom';

function MainPage() {
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    const [products, setProducts] = useState([]);

    async function fetchProducts() {
        try {
            const response = await apiInstance.get(`products/list`);
            return await response.data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    useEffect(() => {
        fetchProducts().then(data => {
            const results = data.results;
            console.log(results);
            setProducts(results);
        });
    }, []);

    return (
        <Container>
            <Box
                gap={'20px'}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    paddingY: '4rem',
                }}>

                <Typography variant={'h2'}>Добро Пожаловать!</Typography>

                <Box paddingY={'2rem'}>
                    <Box
                        component="img"
                        sx={{
                            height: 200,
                            width: '100%',
                            maxWidth: { xs: 300, md: 600 },
                        }}
                        alt="Logo"
                        src={'/estech_logo.svg'}
                    />

                    <Typography variant={'h3'}>Estech PC</Typography>
                    <Typography variant={'body1'}>Магазин компьютерной техники</Typography>
                </Box>

                <Button component={Link}
                        to="/categories"
                        variant="contained" color="primary" size={'large'}>
                    Перейти в каталог
                </Button>

            </Box>

        </Container>
    );
}

export default MainPage;
