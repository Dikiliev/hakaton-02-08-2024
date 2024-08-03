// components/TextStepEditor.jsx

import ReactQuill from 'react-quill';



const TextStepEditor = ({ content, setContent, modules }) => (
    <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} />
);

export default TextStepEditor;
