import styles from './Textes.module.css'


const SecondaryText = ({children}) => {
    return (
        <span className={styles.secondary}>{children}</span>
    );
};

export default SecondaryText;
