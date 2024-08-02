import Basket from "@components/layout/basket/Basket.jsx";
import {useEffect, useState} from "react";
import useBasket from "@/hooks/useBasket.js";


function BasketPage() {
    const {getBasket, updateBasketItem, removeProductFromBasket} = useBasket()
    const [items, setItems] = useState([]);

    useEffect(() => {
        getBasket().then(data => {
            if (data) {
                setItems(data.items);

                console.log(data.items);
            }
        });
    }, []);

    return (
        <Basket items={items}
                updateBasketItem={updateBasketItem}
                removeProductFromBasket={removeProductFromBasket}
        />
    );
}

export default BasketPage;
