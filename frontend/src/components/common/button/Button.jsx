import styles from './Button.module.css'


function Button({children, onClick, className = styles.button, extraClasses = [], ...props}) {

    function click(event){
        if (!onClick){
            console.warn(`[Button] [click] onClick is ${onClick}`);
            return;
        }

        event.stopPropagation();
        onClick(event);
    }

    const classes = [className, ...extraClasses];

    return (
        <button className={classes.join(' ')} onClick={click} {...props}>
            {children}
        </button>
    );
}

function OutlineButton({reverse = false, extraClasses = [], ...props}) {
    reverse && extraClasses.push(styles.reverse);

    return (
        <Button className={styles.transparentButton} extraClasses={extraClasses} {...props}></Button>
    );
}


export {Button, OutlineButton};