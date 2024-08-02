import styles from './LikeButton.module.css'

import HeartIcon from '../../layout/productsList/heart.svg?react';
import {useState} from "react";
import {Button} from "@components/common/button/Button.jsx";


const FavoriteButton = () => {
    const [isFavorited, setIsFavorited] = useState(false);

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    return (
        <Button onClick={toggleFavorite} className={styles.likeButton}>
            <HeartIcon className={[styles.likeIcon, isFavorited && styles.active].join(' ')}/>
        </Button>
    );
};

export default FavoriteButton;
