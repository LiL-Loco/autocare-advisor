#!/usr/bin/env node

/**
 * Script to convert formal German ("Sie") to informal ("Du") addressing
 * in CLEANtastic frontend files
 */

import fs from 'fs/promises';
import path from 'path';

const replacements = [
  // Basic patterns
  { from: /\bSie\b/g, to: 'du' },
  { from: /\bIhr\b/g, to: 'dein' },
  { from: /\bIhre\b/g, to: 'deine' },
  { from: /\bIhren\b/g, to: 'deinen' },
  { from: /\bIhrem\b/g, to: 'deinem' },
  { from: /\bIhrer\b/g, to: 'deiner' },
  { from: /\bIhres\b/g, to: 'deines' },
  { from: /\bIhnen\b/g, to: 'dir' },

  // Verb patterns - common imperatives
  { from: /\bVerwenden Sie\b/g, to: 'Verwende' },
  { from: /\bArbeiten Sie\b/g, to: 'Arbeite' },
  { from: /\bTragen Sie\b/g, to: 'Trage' },
  { from: /\bEntfernen Sie\b/g, to: 'Entferne' },
  { from: /\bWenden Sie\b/g, to: 'Wende' },
  { from: /\bSpülen Sie\b/g, to: 'Spüle' },
  { from: /\bReinigen Sie\b/g, to: 'Reinige' },
  { from: /\bBeginnen Sie\b/g, to: 'Beginne' },
  { from: /\bTauchen Sie\b/g, to: 'Tauche' },
  { from: /\bTesten Sie\b/g, to: 'Teste' },
  { from: /\bLassen Sie\b/g, to: 'Lass' },
  { from: /\bStarten Sie\b/g, to: 'Starte' },
  { from: /\bHalten Sie\b/g, to: 'Halte' },
  { from: /\bPrüfen Sie\b/g, to: 'Prüfe' },
  { from: /\bBleiben Sie\b/g, to: 'Bleib' },
  { from: /\bSchreiben Sie\b/g, to: 'Schreib' },
  { from: /\bHaben Sie\b/g, to: 'Hast du' },
  { from: /\bBenötigen Sie\b/g, to: 'benötigst du' },
  { from: /\bKönnen Sie\b/g, to: 'kannst du' },

  // Other common patterns
  { from: /\bsich\b/g, to: 'dich' },
  { from: /\bfür Sie\b/g, to: 'für dich' },
  { from: /\bmit Ihnen\b/g, to: 'mit dir' },
  { from: /\bvon Ihnen\b/g, to: 'von dir' },
  { from: /\ban Sie\b/g, to: 'an dich' },
  { from: /\bzu Ihnen\b/g, to: 'zu dir' },
];

async function convertFile(filePath) {
  try {
    console.log(`Converting ${filePath}...`);

    let content = await fs.readFile(filePath, 'utf-8');
    let changed = false;

    // Apply all replacements
    for (const replacement of replacements) {
      const originalContent = content;
      content = content.replace(replacement.from, replacement.to);
      if (content !== originalContent) {
        changed = true;
      }
    }

    if (changed) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

async function main() {
  const filesToProcess = [
    'frontend/src/app/pflegeanleitungen/page.tsx',
    // Add more files as needed
  ];

  for (const file of filesToProcess) {
    const fullPath = path.resolve(file);
    try {
      await fs.access(fullPath);
      await convertFile(fullPath);
    } catch (error) {
      console.error(`❌ Cannot access ${fullPath}:`, error.message);
    }
  }

  console.log('\n🎉 Conversion complete!');
}

main().catch(console.error);
