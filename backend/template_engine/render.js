const fs = require('fs');

const themeName = process.argv[2];
const jsonPath = process.argv[3];

if (!themeName || !jsonPath) {
    console.error("Usage: node render.js <themeName> <jsonPath>");
    process.exit(1);
}

async function run() {
    try {
        const resumeJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const theme = require(`jsonresume-theme-${themeName}`);
        
        let html;
        if (theme.render) {
            html = theme.render(resumeJson);
        } else {
            console.error(`Theme jsonresume-theme-${themeName} does not export a render function`);
            process.exit(1);
        }
        
        // Print the HTML string to standard output
        console.log(html);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

run();
