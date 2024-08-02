import {Product} from "@components/layout/product/Product.jsx"
import apiInstance from "@utils/axios.js";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Container} from "@components/common/layouts/Layouts.jsx";

function ProductPage() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);

    async function fetchProducts() {
        try {
            const response = await apiInstance.get(`products/list/${id}`);
            console.log(response);
            return await response.data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    useEffect(() => {
        fetchProducts().then(data => {
            const results = data;
            console.log(results);
            setProduct(results);
        });
    }, []);

    return (
        <Container>
            {!product ?
                <>
                    <h1>Загрузка...</h1>
                </>
                :
                <>
                    <Product {...product}></Product>
                </>
            }
        </Container>
    );
}

export default ProductPage;