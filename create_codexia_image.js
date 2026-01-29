// Simple script to generate a placeholder for Codexia's image
// In a real implementation, we would create an actual image file
// For now, we'll update the HTML to use a data URL

const fs = require('fs');

// Update the HTML to use a data URL for Codexia's image instead of a file
const htmlContent = fs.readFileSync('index.html', 'utf8');
const updatedHtml = htmlContent.replace(
    '<img src="images/codexia.png" alt="Codexia, the AI Guide" id="codexia-img">',
    '<div id="codexia-img" style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg, #00c6ff, #0072ff);display:flex;align-items:center;justify-content:center;font-size:24px;">C</div>'
);

fs.writeFileSync('index.html', updatedHtml);