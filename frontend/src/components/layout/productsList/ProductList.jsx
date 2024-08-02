import styles from "./ProductsList.module.css";
import {Container} from "@components/common/layouts/Layouts.jsx";
import ProductListItem from "@components/layout/productsList/ProductListItem.jsx";
import {useNavigate} from "react-router-dom";
import {HorizontalLine} from "@components/common/horizontalLine/HorizontalLine.jsx";

function ProductList({products}) {
    const navigate = useNavigate();

    function handleNavigateProduct(event, id){
        return navigate(`/products/${id}`);
    }

    return (
        <Container margin={'0'}>
            {!products ?
                <h1>Загрузка...</h1>
                :
                <>
                    {products.map((product) => (
                        <>
                            <ProductListItem key={product.id} id={product.id}
                                             onClick={(event) => handleNavigateProduct(event, product.id)}
                                             {...product}></ProductListItem>
                        </>
                    ))}
                </>
            }
        </Container>
    );
}

export {ProductList};