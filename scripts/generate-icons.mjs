import fs from 'fs';
import path from 'path';

const svgDir = 'e:/00000001_TRIXI/CLEAN/docs/SVG';
const iconDir = 'e:/00000001_TRIXI/CLEAN/frontend/src/components/icons';

function toPascalCase(str) {
  return str
    .replace(/[\s\-_\.]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

const svgFiles = fs.readdirSync(svgDir).filter((f) => f.endsWith('.svg'));
const exports = ['// Auto-generated icon exports'];

svgFiles.forEach((file) => {
  console.log(`Processing ${file}...`);

  const content = fs.readFileSync(path.join(svgDir, file), 'utf8');
  const viewBoxMatch = content.match(/viewBox="([^"]*)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  const pathMatches = content.matchAll(/<path[^>]*d="([^"]*)"/g);
  const paths = Array.from(pathMatches)
    .map((m) => `    <path d="${m[1]}" />`)
    .join('\n');

  if (paths) {
    const name = toPascalCase(path.basename(file, '.svg'));
    const component = `import React from 'react';

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

    fs.writeFileSync(path.join(iconDir, `${name}Icon.tsx`), component);
    exports.push(`export { default as ${name}Icon } from './${name}Icon';`);
    console.log(`✓ Created ${name}Icon`);
  }
});

fs.writeFileSync(path.join(iconDir, 'index.ts'), exports.join('\n'));
console.log(`\n🎉 Generated ${svgFiles.length} icons!`);
