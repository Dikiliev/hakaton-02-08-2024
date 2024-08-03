import ReactQuill from 'react-quill';


const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
        ['clean'],
    ],
    imageResize: {
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
    },
};

const TextStepEditor = ({ content, setContent }) => (
    <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} />
);

export default TextStepEditor;