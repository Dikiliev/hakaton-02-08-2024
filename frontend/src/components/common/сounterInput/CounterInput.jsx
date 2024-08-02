import styles from './CounterInput.module.css';
import {useState} from "react";
import {Button} from "@components/common/button/Button.jsx";

function CounterInput({defaultValue= 1, onChange= null}) {
    const [count, setCount] = useState(defaultValue);

    const increment = () => {
        setCount(prevCount => {
            const newCount = prevCount + 1;
            onChange?.(newCount);
            return newCount;
        });
    };

    const decrement = () => {
        setCount(prevCount => {
            if (prevCount > 0) {
                const newCount = prevCount - 1;
                onChange?.(newCount);
                return newCount;
            }
            return prevCount; // если count <= 0, не изменяем состояние
        });
    };

    return (
        <div className={styles.counterContainer}>
            <Button extraClasses={[styles.counterButton]} onClick={decrement}>
                -
            </Button>
            <span className={styles.counterValue}>{count}</span>
            <Button extraClasses={[styles.counterButton]} onClick={increment}>
                +
            </Button>
        </div>
    );
}

export default CounterInput;
