import styles from './Basket.module.css'
import {Container, RowContainer} from "@components/common/layouts/Layouts.jsx";
import Strap from "@components/common/strap/Strap.jsx";
import BasketItem from "@components/layout/basket/BasketItem.jsx";


function Basket({items, updateBasketItem}){
    return (
        <Container>
            <h1>Корзина</h1>

            <RowContainer>
                <div className={styles.items}>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <BasketItem key={item.id}
                                        id={item.id}
                                        product={item}
                                        title={item.product.title}
                                        photo={item.product.photos[0].photo}
                                        price={item.product.price}
                                        count={item.quantity}
                                        updateBasketItem={updateBasketItem}
                            />
                        ))
                    ) : (
                        <p>Ничего не найдено</p>
                    )}
                </div>

                <Strap extraClasses={[styles.check]}>

                </Strap>
            </RowContainer>

        </Container>
    );
}

export default Basket;
