import styles from './Logo.module.css';

let title_1 = 'Es';
let title_2 = 'Tech';

export function Logo() {
    return (
        <>
            {/*<h1 className={styles.logo}>*/}
            {/*    <span className={styles.part1}>{title_1}</span>*/}
            {/*    <span className={styles.part2}>{title_2}</span>*/}
            {/*</h1>*/}

            <img className={styles.logo} src="/estech_logo.svg" alt="Logo"/>
        </>
    );
}