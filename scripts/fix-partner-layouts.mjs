#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definiere das Basis-Verzeichnis für Partner-Seiten
const partnerDir = path.join(__dirname, '../frontend/src/app/partner');

// Ausgeschlossene Dateien (Layout-Dateien behalten ihre PartnerPageLayout)
const excludedFiles = [
  'layout.tsx',
  'login/page.tsx', // Login Seite braucht kein Partner Layout
];

// Funktion zum rekursiven Finden aller .tsx Dateien
function findTsxFiles(dir) {
  let results = [];

  if (!fs.existsSync(dir)) {
    console.log(`Verzeichnis existiert nicht: ${dir}`);
    return results;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findTsxFiles(filePath));
    } else if (file.endsWith('.tsx')) {
      // Relativer Pfad für Exclude-Check
      const relativePath = path.relative(partnerDir, filePath);

      if (
        !excludedFiles.includes(relativePath) &&
        !excludedFiles.includes(file)
      ) {
        results.push(filePath);
      }
    }
  }

  return results;
}

// Funktion zum Bereinigen einer Datei
function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let modified = false;

    // 1. Entferne PartnerPageLayout Imports
    const importPatterns = [
      /import\s+PartnerPageLayout\s+from\s+['"]@\/components\/partner\/layout\/PartnerPageLayout['"];\s*\n/g,
      /import\s+PartnerPageLayout\s+from\s+['"][^'"]*\/PartnerPageLayout['"];\s*\n/g,
    ];

    for (const pattern of importPatterns) {
      const newContent = content.replace(pattern, '');
      if (newContent !== content) {
        content = newContent;
        modified = true;
        console.log(`✓ Entferne PartnerPageLayout Import aus: ${filePath}`);
      }
    }

    // 2. Entferne PartnerPageLayout JSX Wrapper
    // Suche nach return statement mit PartnerPageLayout
    const jsxPattern =
      /return\s*\(\s*<PartnerPageLayout>\s*(<div[^>]*>[\s\S]*?<\/div>)\s*<\/PartnerPageLayout>\s*\);/g;
    const newContent = content.replace(jsxPattern, (match, innerContent) => {
      modified = true;
      console.log(`✓ Entferne PartnerPageLayout JSX Wrapper aus: ${filePath}`);
      return `return (\n    ${innerContent}\n  );`;
    });

    if (newContent !== content) {
      content = newContent;
    }

    // 3. Entferne Loading State PartnerPageLayout Wrapper
    const loadingPattern =
      /return\s*\(\s*<PartnerPageLayout>\s*(<div[^>]*>[\s\S]*?<\/div>)\s*<\/PartnerPageLayout>\s*\);/g;
    content = content.replace(loadingPattern, (match, innerContent) => {
      modified = true;
      console.log(
        `✓ Entferne Loading State PartnerPageLayout Wrapper aus: ${filePath}`
      );
      return `return (\n      ${innerContent}\n    );`;
    });

    // 4. Bereinige if loading return statements
    const ifLoadingPattern =
      /if\s*\([^)]+\)\s*{\s*return\s*\(\s*<PartnerPageLayout>\s*([\s\S]*?)<\/PartnerPageLayout>\s*\);\s*}/g;
    content = content.replace(ifLoadingPattern, (match, innerContent) => {
      modified = true;
      console.log(`✓ Entferne if loading PartnerPageLayout aus: ${filePath}`);
      return match
        .replace(/<PartnerPageLayout>\s*/, '')
        .replace(/\s*<\/PartnerPageLayout>/, '');
    });

    // 5. Schreibe Datei nur zurück wenn Änderungen gemacht wurden
    if (modified && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Erfolgreich bereinigt: ${filePath}`);
      return true;
    } else if (content.includes('PartnerPageLayout')) {
      console.log(
        `⚠️  PartnerPageLayout noch vorhanden, manuelle Prüfung erforderlich: ${filePath}`
      );
      return false;
    }

    return false;
  } catch (error) {
    console.error(`❌ Fehler beim Bearbeiten von ${filePath}:`, error.message);
    return false;
  }
}

// Hauptfunktion
function main() {
  console.log('🚀 Starte Bereinigung der Partner-Seiten...\n');

  const tsxFiles = findTsxFiles(partnerDir);
  console.log(`📁 Gefunden: ${tsxFiles.length} .tsx Dateien\n`);

  let cleanedCount = 0;
  let errorCount = 0;

  for (const file of tsxFiles) {
    if (cleanFile(file)) {
      cleanedCount++;
    }
  }

  console.log('\n📊 Zusammenfassung:');
  console.log(`✅ Erfolgreich bereinigt: ${cleanedCount} Dateien`);
  console.log(`📄 Insgesamt verarbeitet: ${tsxFiles.length} Dateien`);

  if (cleanedCount > 0) {
    console.log(
      '\n🎉 Partner-Seiten wurden erfolgreich vom doppelten Layout befreit!'
    );
  } else {
    console.log('\n✨ Alle Dateien sind bereits korrekt!');
  }
}

// Skript ausführen
main();
