import styles from './Input.module.css'



function Input({value, onChange, type, placeholder,  multiple = false, required = true, ...props}) {
    return (
        <div className={styles.inputBox}>
            <input className={styles.input} type={type} multiple={multiple} required={required} value={value} onChange={onChange} {...props}/>
            <span className={styles.placeholder}>{placeholder}</span>
        </div>
    );
}

function OutlineInput({value, onChange, type, placeholder, required = true, ...props}) {
    return (
        <div className={styles.inputBox}>
            <input className={[styles.input, styles.outline].join(' ')} type={type} required={required} value={value} onChange={onChange} placeholder={placeholder} {...props}/>
        </div>
    );
}

export {Input, OutlineInput};
