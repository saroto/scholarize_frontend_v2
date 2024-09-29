import React, { useEffect, useState } from "react";
interface SafeHtmlComponentProps {
  html: string;
}

function SafeHtmlComponent({ html }: SafeHtmlComponentProps) {
  const [cleanHtml, setCleanHtml] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const DOMPurify = require("dompurify");
      setCleanHtml(DOMPurify.sanitize(html));
    }
  }, [html]);

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

export default SafeHtmlComponent;
