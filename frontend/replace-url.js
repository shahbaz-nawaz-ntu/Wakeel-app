import fs from 'fs';
import path from 'path';

const searchDir = 'c:\\Users\\DELL\\Desktop\\Wakeel-app\\frontend\\src';
const oldUrl = 'https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api';
const replacement = "import.meta.env.VITE_API_URL || 'http://localhost:5000/api'";

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (!content.includes(oldUrl)) continue;
      
      // 1. Replace exact matching 'oldUrl' -> import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      // Note: when it's assigned to API_URL:
      // const API_URL = 'oldUrl'; -> const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      content = content.replace(new RegExp(`'${oldUrl}'`, 'g'), replacement);
      
      // 2. Replace occurrences inside backticks: `oldUrl/events` -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/events`
      content = content.replace(new RegExp(oldUrl, 'g'), `\${${replacement}}`);
      
      // 3. For any single quotes like 'oldUrl/auth/me', convert them to template literals:
      // fetch('oldUrl/auth/me') -> fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`)
      // The previous replace already replaced `oldUrl` with `${...}` inside the string, so it would look like:
      // '`${...}`/auth/me'  <-- this is syntactically invalid!
      // Let's rollback and do a smarter regex:
    }
  }
}
