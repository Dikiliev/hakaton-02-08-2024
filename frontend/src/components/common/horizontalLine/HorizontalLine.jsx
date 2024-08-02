import styles from './HorizontalLine.module.css';

function HorizontalLine({dashed}){
    return (
        <hr className={[styles.horizontalLine, dashed && styles.dashed].join(' ')} />
    );
}

export {HorizontalLine}