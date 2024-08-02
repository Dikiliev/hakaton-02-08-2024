import styles from './Layout.module.css'

function BaseLayout({children, className, gap= '1rem', margin='3rem auto', ...props}) {
    return (
        <div className={className} style={{margin: margin, gap: gap}} {...props}>
            {children}
        </div>
    )
}

function Grid({children, gap= '1rem', margin='1rem auto'}) {
    return (
        <BaseLayout className={styles.grid} gap={gap} margin={margin}>{children}</BaseLayout>
    );
}

function Container({children, gap= '1rem', margin='3rem auto'}) {
    return (
        <BaseLayout className={styles.container} gap={gap} margin={margin}>{children}</BaseLayout>
    );
}

function RowContainer({children, gap= '1rem', margin='3rem auto', spaceBetween=false}){
    return (
        <BaseLayout className={[styles.container, styles.row, spaceBetween && styles.spaceBetween].join(' ')} gap={gap} margin={margin}>{children}</BaseLayout>
    );
}



export {BaseLayout, Container, RowContainer, Grid};
