// components/LessonDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import useAxios from '@utils/useAxios';

const LessonDetail = () => {
    const { courseId, lessonId } = useParams(); // Получаем параметры из URL
    const [lesson, setLesson] = useState(null);
    const [textBlocks, setTextBlocks] = useState([]);
    const [imageBlocks, setImageBlocks] = useState([]);
    const [videoBlocks, setVideoBlocks] = useState([]);
    const [questionBlocks, setQuestionBlocks] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [contentType, setContentType] = useState('');
    const axiosInstance = useAxios();

    useEffect(() => {
        // Загружаем данные урока и связанные с ним блоки
        axiosInstance
            .get(`/courses/${courseId}/lessons/${lessonId}/`)
            .then((response) => {
                setLesson(response.data);
                setTextBlocks(response.data.text_blocks || []);
                setImageBlocks(response.data.image_blocks || []);
                setVideoBlocks(response.data.video_blocks || []);
                setQuestionBlocks(response.data.question_blocks || []);
            })
            .catch((error) => console.error('Error fetching lesson details:', error));
    }, [courseId, lessonId, axiosInstance]);

    const handleAddContent = (type) => {
        setContentType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewContent('');
    };

    const handleCreateContent = () => {
        let url = '';
        let data = {};

        switch (contentType) {
            case 'text':
                url = `/lessons/${lessonId}/textblocks/`;
                data = { content: newContent };
                break;
            case 'image':
                url = `/lessons/${lessonId}/imageblocks/`;
                data = { image_url: newContent }; // или используйте image_file для загрузки
                break;
            case 'video':
                url = `/lessons/${lessonId}/videoblocks/`;
                data = { video_url: newContent }; // или используйте video_file для загрузки
                break;
            case 'question':
                url = `/lessons/${lessonId}/questionblocks/`;
                data = { question_text: newContent };
                break;
            default:
                return;
        }

        axiosInstance
            .post(url, data)
            .then((response) => {
                switch (contentType) {
                    case 'text':
                        setTextBlocks([...textBlocks, response.data]);
                        break;
                    case 'image':
                        setImageBlocks([...imageBlocks, response.data]);
                        break;
                    case 'video':
                        setVideoBlocks([...videoBlocks, response.data]);
                        break;
                    case 'question':
                        setQuestionBlocks([...questionBlocks, response.data]);
                        break;
                    default:
                        break;
                }
                handleCloseDialog();
            })
            .catch((error) => console.error('Error creating content block:', error));
    };

    const handleDeleteContent = (type, id) => {
        let url = '';
        switch (type) {
            case 'text':
                url = `/textblocks/${id}/`;
                break;
            case 'image':
                url = `/imageblocks/${id}/`;
                break;
            case 'video':
                url = `/videoblocks/${id}/`;
                break;
            case 'question':
                url = `/questionblocks/${id}/`;
                break;
            default:
                return;
        }

        axiosInstance
            .delete(url)
            .then(() => {
                switch (type) {
                    case 'text':
                        setTextBlocks(textBlocks.filter((block) => block.id !== id));
                        break;
                    case 'image':
                        setImageBlocks(imageBlocks.filter((block) => block.id !== id));
                        break;
                    case 'video':
                        setVideoBlocks(videoBlocks.filter((block) => block.id !== id));
                        break;
                    case 'question':
                        setQuestionBlocks(questionBlocks.filter((block) => block.id !== id));
                        break;
                    default:
                        break;
                }
            })
            .catch((error) => console.error('Error deleting content block:', error));
    };

    return (
        <Container>
            {lesson && (
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        {lesson.title}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Управление блоками контента
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleAddContent('text')}>
                        Добавить текст
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleAddContent('image')}>
                        Добавить изображение
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleAddContent('video')}>
                        Добавить видео
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleAddContent('question')}>
                        Добавить вопрос
                    </Button>

                    <Typography variant="h6" sx={{ mt: 4 }}>
                        Текстовые блоки
                    </Typography>
                    <List>
                        {textBlocks.map((block) => (
                            <ListItem key={block.id}>
                                <ListItemText primary={block.content} />
                                <Button size="small" color="secondary" onClick={() => handleDeleteContent('text', block.id)}>
                                    Удалить
                                </Button>
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="h6" sx={{ mt: 4 }}>
                        Изображения
                    </Typography>
                    <List>
                        {imageBlocks.map((block) => (
                            <ListItem key={block.id}>
                                <ListItemText primary={block.image_url || block.image_file} />
                                <Button size="small" color="secondary" onClick={() => handleDeleteContent('image', block.id)}>
                                    Удалить
                                </Button>
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="h6" sx={{ mt: 4 }}>
                        Видео
                    </Typography>
                    <List>
                        {videoBlocks.map((block) => (
                            <ListItem key={block.id}>
                                <ListItemText primary={block.video_url || block.video_file} />
                                <Button size="small" color="secondary" onClick={() => handleDeleteContent('video', block.id)}>
                                    Удалить
                                </Button>
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="h6" sx={{ mt: 4 }}>
                        Вопросы
                    </Typography>
                    <List>
                        {questionBlocks.map((block) => (
                            <ListItem key={block.id}>
                                <ListItemText primary={block.question_text} />
                                <Button size="small" color="secondary" onClick={() => handleDeleteContent('question', block.id)}>
                                    Удалить
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Диалог для добавления нового контент-блока */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Создать новый блок</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={`Введите ${contentType}`}
                        type="text"
                        fullWidth
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleCreateContent} color="primary">
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default LessonDetail;
