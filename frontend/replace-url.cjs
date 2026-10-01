const fs = require('fs');
const path = require('path');

const searchDir = 'c:\\Users\\DELL\\Desktop\\Wakeel-app\\frontend\\src';
const oldUrl = 'https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api';
const replacement = "import.meta.env.VITE_API_URL || 'http://localhost:5000/api'";
const replacementExpr = "${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}";

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes(oldUrl)) continue;

      // 1. const API_URL = import.meta.env.VITE_API_URL || 'https://.../api';
      // in services/api.js and api/client.js
      content = content.replace(
        /const API_URL = import\.meta\.env\.VITE_API_URL \|\| 'https:\/\/2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50\.ngrok-free\.app\/api';/g,
        "const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';"
      );

      // 2. const API_URL = 'https://.../api';
      // in useClients.js, useCases.js, etc.
      content = content.replace(
        /const API_URL = 'https:\/\/2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50\.ngrok-free\.app\/api';/g,
        "const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';"
      );

      // 3. fetch('https://.../api/auth/me') -> fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`)
      // Match single quotes containing the url
      const singleQuoteRegex = /'https:\/\/2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50\.ngrok-free\.app\/api([^']*)'/g;
      content = content.replace(singleQuoteRegex, (match, p1) => {
        return `\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${p1}\``;
      });

      // 4. fetch(`https://.../api/events/${id}`) -> fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/events/${id}`)
      // Match inside backticks
      const backtickRegex = /https:\/\/2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50\.ngrok-free\.app\/api/g;
      content = content.replace(backtickRegex, "${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}");
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('Updated', fullPath);
    }
  }
}

processDirectory(searchDir);
