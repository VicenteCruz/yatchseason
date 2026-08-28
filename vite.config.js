import fs from 'fs';
import path from 'path';

function htmlIncludePlugin() {
  return {
    name: 'html-include',
    transformIndexHtml(html) {
      // Basic recursive include parser up to 3 levels deep
      let result = html;
      for (let i = 0; i < 3; i++) {
        const matches = result.match(/<include src="([^"]+)"><\/include>/g);
        if (!matches) break;
        
        result = result.replace(/<include src="([^"]+)"><\/include>/g, (match, src) => {
          const filePath = path.resolve(__dirname, src);
          if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf-8');
          }
          console.warn(`[html-include] File not found: ${filePath}`);
          return match;
        });
      }
      return result;
    }
  }
}

export default {
  plugins: [htmlIncludePlugin()],
  server: {
    open: true
  }
}
