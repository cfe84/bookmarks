const path = require("path");
const fs = require("fs");

const bookmarkletFile = process.argv[2];
if (!fs.existsSync(bookmarkletFile)){
    console.error(`File not found: ${bookmarkletFile}`);
    return;
}

const file = fs.readFileSync(bookmarkletFile);
const relativePath = path.dirname(bookmarkletFile);
const template = JSON.parse(file);
console.log(`Building bookmarklet ${template.name}`);

const loadRelativeFile = (filename) => {
    const filepath = path.join(relativePath, filename);
    if (!fs.existsSync(filepath)){
        console.error(`File not found: ${filepath}`);
        process.exit(1);
    }
    return fs.readFileSync(filepath).toString();
}

const loadAll = (filenames) => filenames
    .map((filename) => loadRelativeFile(filename))
    .join("\n");

const html = loadRelativeFile(template.html);
const stylesheets = loadAll(template.stylesheets);
const scripts = loadAll(template.scripts);

let htmlOutput = html.replace("%STYLE%", stylesheets);
htmlOutput = htmlOutput.replace(/"/g, "\\\"");
let scriptsOutput = scripts.replace(/\r?\n/gm, " ");
let output = `javascript:(function(){const%20html="${htmlOutput}";
const%20div%20=%20document.createElement("div");div.id='bookmark-div-injected';
div.innerHTML=html;document.lastElementChild.appendChild(div);
${scriptsOutput}})()`;
fs.writeFileSync(path.join(relativePath, template.output + ".html"), htmlOutput);
fs.writeFileSync(path.join(relativePath, template.output), output);
console.log("Done");