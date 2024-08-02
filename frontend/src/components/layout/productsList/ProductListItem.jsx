import style from './ProductListItem.module.css'
import Rating from "@components/layout/rating/Rating.jsx";
import LikeButton from "@components/common/likeButton/LikeButton.jsx";
import {Button} from "@components/common/button/Button.jsx";
import {trimStringToLength} from "@utils/stringUtils.js";
import useBasket from "@/hooks/useBasket.js";

import defaultPhoto from '@/assets/no-photo.png';
import HeaderText from "@components/common/headerText/HeaderText.jsx";
import {Box, Card, CardContent, CardMedia, Checkbox, IconButton, Typography} from "@mui/material";
import {Favorite, FavoriteBorder} from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite.js";


function ProductListItem({onClick, id, name, short_characteristics, price, photos, average_rating, count_of_reviews, count_of_orders=0}) {
    price = price.toString();

    const {addProductToBasket} = useBasket()

    function handleAddProductToBasket() {
        addProductToBasket(id).then((data) => {
            console.log(data);
        });
    }


    return (
        <Card sx={{display: 'flex', marginBottom: 2, width: '100%', maxWidth: 800}}>
            <CardMedia
                component="img"
                sx={{width: 151}}
                image={photos.length > 0 ? photos[0].photo : defaultPhoto}
                alt={name}
            />
            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div" variant="h5">
                        {name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {short_characteristics}
                    </Typography>
                </CardContent>
                <Box sx={{display: 'flex', alignItems: 'center', pl: 2, pb: 2}}>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {price} ₽
                    </Typography>
                    <Button variant="contained" color="primary" sx={{marginRight: 1}}>
                        Купить
                    </Button>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon/>
                    </IconButton>
                </Box>
            </Box>
        </Card>
    );

    return (
        <div onClick={onClick} className={style.product}>
            <div className={style.imageDiv}>
                {photos.length > 0 ?
                    <img className={style.image} src={photos[0].photo}></img>
                    :
                    <img className={style.image} style={{padding: '30px', overflow: 'visible'}}
                         src={defaultPhoto}></img>}
            </div>
            <div className={style.textSection}>

                <div className={style.textSectionInfo}>
                    <HeaderText extraClasses={[style.title]}>{name}</HeaderText>
                    <span className={style.description}>{trimStringToLength(short_characteristics, 375)}</span>
                </div>

                <div className={style.textSectionStatistics}>
                    <span className={style.productInfo}>Заказано: {count_of_orders}</span>
                    <Rating average={average_rating} count={count_of_reviews}></Rating>
                </div>

            </div>
            <div className={style.buySection}>

                <HeaderText variant={'h2'} extraClasses={[style.price]}>
                    {/*<span className={style.pastPrice}>{info.price + 2000}</span>&nbsp;&nbsp;*/}
                    {price.slice(0, -3)} {price.slice(-3)}
                    <span className={style.rub}>₽</span>
                </HeaderText>
                <div className={style.buttons}>
                    {/*<LikeButton></LikeButton>*/}
                    <Checkbox
                        icon={<FavoriteBorder/>} checkedIcon={<Favorite/>}/>
                    <Button extraClasses={[style.buyButton]} onClick={handleAddProductToBasket}>Купить</Button>
                </div>

            </div>
        </div>
    );
}

export default ProductListItem;
