import styles from './ImagePreview.module.css';

function ImagePreview({ images = [], onRemove }) {
    return (
        <div className={styles.list}>
            {images.map((image, index) => (
                <div key={index} className={styles.preview}>
                    <img src={image} alt={`Uploaded ${index}`} className={styles.image}/>
                    <button onClick={() => onRemove(index)} className={styles.removeButton}>⛌</button>
                </div>
            ))}
        </div>
    );
}

export default ImagePreview;
