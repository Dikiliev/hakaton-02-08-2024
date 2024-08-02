import styles from './Card.module.css';



function SimpleCard({children, image, ...props}) {
    return (
        <div className={styles.card} {...props}>
            <div className={styles.imageDiv}>
                <img className={styles.image} src={image} />
            </div>
            <h3>{children}</h3>
        </div>
    );
}

export {SimpleCard};
