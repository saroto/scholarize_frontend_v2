import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState, useRef } from "react";

interface RichTextProps {
  rich_text: string | undefined;
}

const RichTextViewPaper: React.FC<RichTextProps> = ({ rich_text }) => {
  const editorRef = useRef<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      {isHydrated && (
        <Editor
          onInit={(evt, editor) => {
            editorRef.current = editor;
          }}
          initialValue={rich_text}
          tinymceScriptSrc={`/tinymce/tinymce.min.js`}
          init={{
            min_height: 200,
            max_height: 1000,
            menubar: false,
            license_key: "gpl" as any,
            selector: "textarea" as any,
            paste_data_images: false, // Disable pasting images directly into the editor
            images_upload_url: null as any, // Make sure no URL is provided for image uploads
            automatic_uploads: false, // Disable automatic uploads
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "table",
              "help",
              "wordcount",
              "autoresize",
              "searchreplace",
              "link",
            ],
            toolbar: false,
            statusbar: false,
            fullscreen_native: true,
            branding: false,
            editable_root: false,
            autoresize_bottom_margin: 20,
            autoresize_max_height: 1000, // Set the maximum height of the editor
            autoresize_min_height: 200, // Set the minimum height of the editor
            // autoresize_on_init: true,
            autoresize_overflow_padding: 20,
          }}
        />
      )}
    </>
  );
};

export default RichTextViewPaper;
