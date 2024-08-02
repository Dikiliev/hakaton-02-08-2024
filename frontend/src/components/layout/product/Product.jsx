import style from './Product.module.css'
import {trimStringToLength} from "@utils/stringUtils.js";
import Rating from "@components/layout/rating/Rating.jsx";
import LikeButton from "@components/common/likeButton/LikeButton.jsx";
import {Button} from "@components/common/button/Button.jsx";
import {Container, RowContainer} from "@components/common/layouts/Layouts.jsx";
import Strap from "@components/common/strap/Strap.jsx";
import defaultPhoto from '@/assets/no-photo.png';
import HeaderText from "@components/common/headerText/HeaderText.jsx";



function Product({name, short_characteristics, description, price, photos, average_rating, count_of_reviews, count_of_orders=0}) {
    const photo = photos.length > 0 ? photos[0].photo : defaultPhoto;

    return (
        <Strap secondary={true}>

            <div className={style.productCardTopFull}>

                <HeaderText className={style.headerSection}>{name}</HeaderText>

                <div className={style.imagesSection}>
                    <picture className={style.picture}>
                        {photos.length > 0 ?
                            <img className={style.image} alt="product main image" src={photos[0].photo}/>
                            :
                            <img className={style.image} style={{padding: '30px', overflow: 'visible'}}
                                 src={defaultPhoto}></img>}
                    </picture>
                </div>

                <div className={style.specBrandSection}>
                    <p>{short_characteristics ? short_characteristics : 'Краткое описание отсутсвует.'}</p>
                    <a href={'#'}>Подробнее</a>
                </div>

                <div className={style.statSection}>
                    <RowContainer margin={'0 auto'}>

                        <Strap padding={'0.7rem 1rem'}>
                            <Rating average={average_rating} count={count_of_reviews}/>
                        </Strap>

                        <Strap padding={'0.7rem 1rem'}>
                            <p>Заказано: {count_of_orders}</p>
                        </Strap>

                        <Strap padding={'0.7rem 1rem'}>
                            <p>Отличная надежность</p>
                        </Strap>

                    </RowContainer>
                </div>

                <div className={style.buySection}>

                    <Strap padding={'0.7rem 1rem'} width={'100%'}>
                        <h2>{price} ₽</h2>
                    </Strap>
                    <LikeButton></LikeButton>
                    <Button extraClasses={[style.buyButton]}>Купить</Button>

                </div>

                <div className={style.infoSection}>
                    <Strap padding={'0.7rem 1rem'} width={'50%'}>
                        <p>В налачии 1 шт</p>
                    </Strap>
                </div>

                <div>

                </div>

            </div>

        </Strap>
    );
}

export {Product};
