const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const suitePath = path.join(root, 'suite.xml');

if (!fs.existsSync(suitePath)) {
  console.error(`Suite file not found: ${suitePath}`);
  process.exit(1);
}

const xml = fs.readFileSync(suitePath, 'utf-8');
const fileMatches = [...xml.matchAll(/<file>(.*?)<\/file>/gs)].map((match) => match[1].trim());

if (fileMatches.length === 0) {
  console.error('No <file> entries found in suite.xml.');
  process.exit(1);
}

for (const file of fileMatches) {
  const absolutePath = path.join(root, file);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Test file not found: ${absolutePath}`);
    process.exit(1);
  }
  console.log(`\n=== Running suite file: ${file} ===`);
  execSync(`npx playwright test ${file}`, { stdio: 'inherit', cwd: root });
}
