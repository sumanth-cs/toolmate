const fs = require('fs');
const glob = require('glob');

const files = glob.sync('client/src/**/*.jsx');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace hardcoded "http://localhost:5000" or 'http://localhost:5000' with API URL
    const changed = content.replace(/['"]http:\/\/localhost:5000(\/api\/[a-zA-Z0-9/-_]+)['"]/g, (match, path) => {
        return "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}" + path + "`";
    });

    if (content !== changed) {
        fs.writeFileSync(file, changed);
        console.log(`Updated ${file}`);
    }
});
