import styles from './Rating.module.css';

import Star from './star.svg?react';
import StarEmpty from './star-empty.svg?react';
import SecondaryText from "@components/common/textes/SecondaryText.jsx";

const Rating = ({ average, count }) => {
    const stars = Array.from({ length: 5 }, (_, index) => {
        const fillLevel = Math.max(0, Math.min(1, average - index));
        return (
            <div className={styles.star} key={index}>
                <StarEmpty className={[styles.star, styles.empty].join(' ')}/>
                <Star className={[styles.star, styles.fill].join(' ')} style={{clipPath: `polygon(0 0, ${fillLevel * 100}% 0, ${fillLevel * 100}% 100%, 0 100%)`}}/>
            </div>
        );
    });

    return (
        <div className={styles.rating}>
            <div className={styles.stars}>
                {stars}
            </div>
            <span>{average ? parseFloat(average).toFixed(1) : 0} <span style={{opacity: 0.7}}>● {count} оценки</span></span>
        </div>);
};

export default Rating;
