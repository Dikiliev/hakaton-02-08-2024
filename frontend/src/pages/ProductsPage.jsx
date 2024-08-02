import { Container, RowContainer } from "@components/common/layouts/Layouts.jsx";
import { useSearchParams } from "react-router-dom";
import apiInstance from "@utils/axios.js";
import { useEffect, useState, useCallback, useRef } from "react";
import { ProductList } from "@components/layout/productsList/ProductList.jsx";
import HeaderText from "@components/common/headerText/HeaderText.jsx";
import FilterPanel from "@components/layout/filterPanel/FilterPanel.jsx";

function ProductPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({ category: searchParams.get('c'), attributes: [] });
    const isFirstRender = useRef(true);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await apiInstance.get(`products/list?${searchParams.toString()}`);
            setProducts(response.data.results);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, [searchParams, fetchProducts]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        console.log(searchParams);
        const params = new URLSearchParams(searchParams);
        selectedFilters.category !== undefined ? params.set('c', selectedFilters.category) : params.delete('c');
        selectedFilters.minPrice !== undefined && selectedFilters.minPrice ? params.set('minp', selectedFilters.minPrice) : params.delete('minp');
        selectedFilters.maxPrice !== undefined && selectedFilters.maxPrice ? params.set('maxp', selectedFilters.maxPrice) : params.delete('maxp');

        params.delete('attribute');
        if (selectedFilters.attributes) {
            selectedFilters.attributes.forEach(attr => {
                params.append('attribute', `${attr.id}:${attr.value}`);
            });
        }

        setSearchParams(params);

    }, [selectedFilters, searchParams, setSearchParams]);

    const handleSetSelectedFilters = useCallback((filters) => {
        console.log('SET_SELECTED_FILTERS', filters);
        setSelectedFilters(filters);
    }, []);

    return (
        <Container>
            <HeaderText secondFont>Каталог товаров</HeaderText>
            <RowContainer>
                <FilterPanel selectedFilters={selectedFilters} setSelectedFilters={handleSetSelectedFilters} />
                <ProductList products={products} />
            </RowContainer>
        </Container>
    );
}

export default ProductPage;
