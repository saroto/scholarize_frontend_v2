const fse = require("fs-extra");
const path = require("path");
const tinymceDir = path.dirname(require.resolve("tinymce/package.json"));
const publicDir = path.join(__dirname, "public", "tinymce");

fse.emptyDirSync(publicDir);
fse.copySync(tinymceDir, publicDir, { overwrite: true, dereference: true });
