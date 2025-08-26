const fs = require('fs');
const path = require('path');

// Pfad zu den SVG-Dateien und zum Zielordner
const svgDir = path.join(__dirname, '../../docs/SVG');
const iconDir = path.join(__dirname, '../frontend/src/components/icons');

// Funktion zum Konvertieren von SVG-Dateinamen in PascalCase
function toPascalCase(str) {
  return str
    .replace(/[\s\-_\.]/g, ' ') // Ersetze Leerzeichen, Bindestriche, Unterstriche und Punkte
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// Funktion zum Extrahieren des SVG-Pfads
function extractSvgPath(svgContent) {
  const pathMatch = svgContent.match(/<path[^>]*d="([^"]*)"[^>]*\/>/g);
  if (pathMatch) {
    return pathMatch
      .map((path) => path.replace(/class="[^"]*"/g, '').trim())
      .join('\n    ');
  }
  return '';
}

// React-Komponenten-Template
function createIconComponent(name, paths, viewBox = '0 0 24 24') {
  return `import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const ${name}Icon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="${viewBox}"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    ${paths}
  </svg>
);

export default ${name}Icon;`;
}

// Hauptfunktion
async function generateIcons() {
  try {
    // Stelle sicher, dass der Icon-Ordner existiert
    if (!fs.existsSync(iconDir)) {
      fs.mkdirSync(iconDir, { recursive: true });
    }

    // Lese alle SVG-Dateien
    const svgFiles = fs
      .readdirSync(svgDir)
      .filter((file) => file.endsWith('.svg'));

    let exports = '// Auto-generated icon exports\n';

    for (const svgFile of svgFiles) {
      const svgPath = path.join(svgDir, svgFile);
      const svgContent = fs.readFileSync(svgPath, 'utf8');

      // Extrahiere ViewBox
      const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
      const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

      // Extrahiere SVG-Pfade
      const paths = extractSvgPath(svgContent);

      if (paths) {
        const iconName = toPascalCase(path.basename(svgFile, '.svg'));
        const componentName = `${iconName}Icon`;
        const fileName = `${componentName}.tsx`;

        // Erstelle React-Komponente
        const componentCode = createIconComponent(iconName, paths, viewBox);

        // Schreibe Datei
        fs.writeFileSync(path.join(iconDir, fileName), componentCode);

        // Füge Export hinzu
        exports += `export { default as ${componentName} } from './${componentName}';\n`;

        console.log(`✓ Created ${componentName}`);
      }
    }

    // Schreibe Index-Datei
    fs.writeFileSync(path.join(iconDir, 'index.ts'), exports);

    console.log(
      `\n🎉 Successfully generated ${svgFiles.length} icon components!`
    );
    console.log(`📁 Icons are available at: ${iconDir}`);
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();
