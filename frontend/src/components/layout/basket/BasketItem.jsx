import style from './BasketItem.module.css'
import LikeButton from "@components/common/likeButton/LikeButton.jsx";
import {FieldsGroup} from "@components/layout/fieldsGroup/FieldGroup.jsx";
import CounterInput from "@components/common/сounterInput/CounterInput.jsx";


function BasketItem({onClick, id, title, price, photo, count, updateBasketItem}) {
    price = price.toString();

    function setCount(value){
        count = value;

        updateBasketItem(id, value).then(data => {
            if (data) {
                console.log(data);
            }
        });
    }

    return (
        <div onClick={onClick} className={style.item}>
            <img className={style.image} src={photo}></img>

            <div className={style.infoSection}>
                <h3 className={style.title}>{title}</h3>
                <CounterInput defaultValue={count} onChange={setCount}></CounterInput>
            </div>
            <div className={style.buySection}>

                <span className={style.price}>
                    {/*<span className={style.pastPrice}>{info.price + 2000}</span>&nbsp;&nbsp;*/}
                    {price.slice(0, -3)}.
                    <span className={style.smallPrice}>{price.slice(-3)}</span>
                    <span className={style.rub}>₽</span>
                </span>



                <FieldsGroup>
                    <LikeButton></LikeButton>
                    <LikeButton></LikeButton>
                </FieldsGroup>

            </div>
        </div>
    );
}

export default BasketItem;
