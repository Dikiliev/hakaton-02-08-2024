import styles from './HeaderText.module.css'

function HeaderText({children, variant='h1', extraClasses=[], secondFont}){
    const Tag = variant;

    return (
        <Tag className={[styles.headerText, secondFont && styles.secondFont, ...extraClasses].join(' ')}>
            {children}
        </Tag>
    );
}

export default HeaderText;