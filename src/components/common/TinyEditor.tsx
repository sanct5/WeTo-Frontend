import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyEditorProps {
  value: string;
  onEditorChange: (content: string, editor: any) => void;
}

const TinyEditor: React.FC<TinyEditorProps> = ({ value, onEditorChange }) => {
  return (
    <Editor
      apiKey='bfqew20400z8yzz2jqkg6yp4p7f6ur54kqikor53k2betw6u'
      value={value}
      init={{
        height: 500,
        menubar: false,
        plugins: 'image',
        toolbar: 'link image | undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | fontsize | styles ',
        Body_css: 'https://www.tiny.cloud/css/codepen.min.css',
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        file_picker_callback: (cb) => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.onchange = () => {
            const file = input.files![0];
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              cb(base64, { title: file.name });
            };
            reader.readAsDataURL(file);
          };
          input.click();
        },
      }}
      onEditorChange={onEditorChange}
    />
  );
};

export default TinyEditor;