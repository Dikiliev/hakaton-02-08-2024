import styles from './Textes.module.css'


function Text({children}) {
    return (
        <p className={styles.text}>{children}</p>
    );
}

export {Text};
