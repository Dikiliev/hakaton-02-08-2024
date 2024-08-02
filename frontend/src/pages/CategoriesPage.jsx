import { SimpleCard } from "@components/layout/card/Card.jsx";
import { Container, Grid } from "@components/common/layouts/Layouts.jsx";
import { useEffect, useState } from "react";
import apiInstance from "@utils/axios.js";
import {useNavigate, useLocation, useParams} from "react-router-dom";

function CategoriesPage() {
    const { id } = useParams();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    console.log(id);

    const fetchCategories = async (parentId = null) => {
        try {
            console.log(`products/categories/${id ? `${id}/` : ''}`);
            const response = await apiInstance.get(`products/categories/${id ? `${id}/` : ''}`, {
                params: { parent_id: parentId ? parentId : 0 }
            });
            console.log(response);
            setCategories(response.data);
            if (parentId) {
                const parentResponse = await apiInstance.get(`products/categories/${parentId}/parents/`);
                setBreadcrumb(parentResponse.data);
                console.log(parentResponse);
            } else {
                setBreadcrumb([]);
            }
        } catch (error) {
            setError('Ошибка при получении данных');
            console.error('Ошибка при получении данных:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const parentId = searchParams.get('parent_id');
        fetchCategories(parentId);
    }, [location.search]);

    const handleNavigateCategory = async (category) => {
        try {
            const response = await apiInstance.get('products/categories/', {
                params: { parent_id: category.id }
            });

            if (response.data.length > 0) {
                setCategories(response.data);
                setBreadcrumb([...breadcrumb, category]);
                navigate(`/categories/${category.id}`);
            } else {
                navigate(`/products?c=${category.id}`);
            }
        } catch (error) {
            console.error('Ошибка при получении дочерних категорий:', error);
        }
    };

    const handleBack = () => {
        const newBreadcrumb = [...breadcrumb];
        newBreadcrumb.pop();
        const newParentId = newBreadcrumb.length > 0 ? newBreadcrumb[newBreadcrumb.length - 1].id : null;
        setBreadcrumb(newBreadcrumb);
        fetchCategories(newParentId);
        if (newParentId) {
            navigate(`?parent_id=${newParentId}`);
        } else {
            navigate('');
        }
    };

    if (loading) {
        return (
            <Container>
                <h1>Загрузка...</h1>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <h1>{error}</h1>
            </Container>
        );
    }

    return (
        <Container>
            <h1>Каталог товаров</h1>
            <div>
                {breadcrumb.map((category, index) => (
                    <span key={category.id}>
                        {category.name}
                        {index < breadcrumb.length - 1 && ' > '}
                    </span>
                ))}
            </div>
            <Grid>
                {categories.map((category) => (
                    <SimpleCard
                        key={category.id}
                        image={category.image}
                        onClick={() => handleNavigateCategory(category)}
                    >
                        {category.name}
                    </SimpleCard>
                ))}
            </Grid>
            {breadcrumb.length > 0 && (
                <button onClick={handleBack}>Назад</button>
            )}
        </Container>
    );
}

export default CategoriesPage;
