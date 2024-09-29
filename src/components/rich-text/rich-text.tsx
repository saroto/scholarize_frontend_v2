/** @format */

import { Editor } from "@tinymce/tinymce-react";
import { table } from "console";
import React, { useEffect, useState, useRef } from "react";

interface AppProps {
  onEditorChange: (content: string) => void;
  rich_text: string | undefined;
}

const App: React.FC<AppProps> = ({ onEditorChange, rich_text }) => {
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
          onEditorChange={(content, editor) => {
            onEditorChange(content); // Update the parent component's state
          }}
          initialValue={rich_text}
          tinymceScriptSrc={`/tinymce/tinymce.min.js`}
          init={{
            height: 800,
            menubar: false,
            license_key: "gpl" as any,
            paste_data_images: false, // Disable pasting images directly into the editor
            images_upload_url: null as any, // Make sure no URL is provided for image uploads
            automatic_uploads: false, // Disable automatic uploads
            // paste_as_text: true, // Paste as plain text
            paste_tab_spaces: 4, // Tab spaces
            smart_paste: true,

            // visual_table_class: `border: 1px solid #e0e0e0; `,
            // visual_table_class: `text-blue-500 hover:underline border border-blue-500 p-2 rounded-md`,

            plugins: [
              "advlist",
              "autolink",
              "lists",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "fullscreen",
              "insertdatetime",
              "table",
              "help",
              "wordcount",
              // "font-family",
              // "font-size",
              // "line-height",

              // "paste",
              "accordion",
              // "lists advlist",
              "pagebreak",
              "link",
            ],
            font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
            font_size_input_default_unit: "pt",

            font_family_formats:
              "'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats'",
            toolbar:
              "undo redo | blocks | fontfamily " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | fontsize | fontsizeinput |" +
              "table | charmap | link | code | fullscreen" +
              "lineheight | searchreplace | help | preview",

            content_style: `
              body { font-family: Helvetica,Arial,sans-serif; font-size:14px }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #000; padding: 8px; }
              th { background-color: #f2f2f2; }
            `,
            branding: false,
            fullscreen_native: true,

            paste_preprocess: (plugin, args) => {
              // Remove all images

              const content = args.content.replace(/<img[^>]*>/g, "");
              const contentDiv = document.createElement("div");
              contentDiv.innerHTML = content;

              // Apply solid borders to all tables, th, and td elements
              const tables = contentDiv.getElementsByTagName("table");
              for (let i = 0; i < tables.length; i++) {
                tables[i].style.border = "1px solid #000";
                tables[i].style.borderCollapse = "collapse";
              }
              const ths = contentDiv.getElementsByTagName("th");
              for (let i = 0; i < ths.length; i++) {
                ths[i].style.border = "1px solid #000";
              }
              const tds = contentDiv.getElementsByTagName("td");
              for (let i = 0; i < tds.length; i++) {
                tds[i].style.border = "1px solid #000";
              }

              args.content = contentDiv.innerHTML;
            },
            valid_elements: "*[*]", // Allows all elements and attributes
            extended_valid_elements: "*[*]",
          }}
        />
      )}
    </>
  );
};

export default App;
