import styles from './FieldsGroup.module.css'

function FieldsGroup({children, center=true}) {

    return (
        <div className={[styles.buttonsContainer, center && styles.center].join(' ')}>
            {children}
        </div>
    );
}


export {FieldsGroup};