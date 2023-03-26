import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

const emoji = require("node-emoji");

const TextEditor = ({ transcript }: { transcript: string }) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };

  return (
    <div>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINIMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={emoji.emojify(transcript)}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      {/* <button onClick={log}>Log editor content</button> */}
    </div>
  );
};

export default TextEditor;
