import styles from './Dropdown.module.css'
import {Children, cloneElement, useState} from "react";

function Dropdown({children, placeholder}) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState('')

    function handleSetValue(value){
        setValue(value)
    }

    function handleSwitchDropdown(){
        console.log(isOpen)
        setIsOpen(prev => !prev)
    }

    return (
        <div className={[styles.dropdown, isOpen && styles.active].join(' ')} onClick={() => handleSwitchDropdown()}>

            <input type={'text'} className={styles.textBox} placeholder={placeholder} value={value} readOnly={true}/>
            <div className={styles.optionsList}>

                {Children.map(children, child => {
                    if (child.type.displayName === 'DropdownOption') {
                        return cloneElement(child, {
                            onClick: handleSetValue
                        });
                    }
                    return child;
                })}

            </div>

        </div>
    );
}

function DropdownOption({children, value, onClick}) {
    return (
        <div onClick={() => onClick(value)} className={styles.option}>
            {children ? children : value}
        </div>
    );
}

DropdownOption.displayName = 'DropdownOption';

export {Dropdown, DropdownOption};