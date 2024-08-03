// components/VideoStepEditor.jsx

import { Box, TextField } from '@mui/material';

const VideoStepEditor = ({ content, setContent }) => (
    <Box sx={{ my: 2 }}>
        <TextField
            label="URL видео"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
        />
    </Box>
);

export default VideoStepEditor;
