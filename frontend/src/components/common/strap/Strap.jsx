import styles from './Strap.module.css'

function Strap({children, extraClasses = [], reverse=false, secondary=false, padding='2rem'}) {
    return (
        <div className={[styles.strap, reverse && styles.reverse, secondary && styles.secondary, ...extraClasses].join(' ')} style={{padding: padding}}>
            {children}
        </div>
    );
}

export default Strap;
