import {useState} from "react";
import styles from './FileUploader.module.css';

import AddIcon from '../../../assets/addIcon.svg?react';
import ImagePreview from "@components/common/imagePreview/ImagePreview.jsx";
import useAxios from "@utils/useAxios.js";

function FileUploader({ onFileSelect = null }) {
    const [files, setFiles] = useState([]);

    const axiosInstance = useAxios();

    const handleImageChange = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    function deleteImage(index) {
        let newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        const response = await axiosInstance.post('/test-request/', formData);

        console.log('response:', response.data);

        // const result = await response.json();
    };


    return (
        <>
            <ImagePreview images={files.map(file => URL.createObjectURL(file))} onRemove={deleteImage}></ImagePreview>
            <div className={styles.container}>
                <label className={styles.fileButton}>
                    <span className={styles.text}>Загрузить фото<AddIcon className={styles.icon}></AddIcon></span>
                    <input type="file" accept="image/*" onChange={handleImageChange} multiple
                           className={styles.fileInput}/>
                </label>
            </div>
            <button type="submit" className={styles.submitButton}>Отправить на сервер</button>
        </>
    );
}

export {FileUploader};
