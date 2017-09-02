/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const pack = require('../package.json');

const rootDir = path.dirname(__dirname);
const distFilePath = path.join(rootDir, pack.main);
const readmePath = path.join(rootDir, 'README.md');
const readmeDraftPath = path.join(rootDir, 'tools', 'README.draft.md');

const distFile = fs.readFileSync(distFilePath);
const readmeDraftFile = fs.readFileSync(readmeDraftPath, 'utf8');

const bytesToKiB = bytes => (bytes / 1024).toFixed(1);

const algo = 'sha384';
const size = bytesToKiB(distFile.byteLength);
const gzipSize = bytesToKiB(zlib.gzipSync(distFile).byteLength);
const digest = crypto.createHash(algo).update(distFile).digest('base64');

const readme = readmeDraftFile
    .replace('###gzip_size###', gzipSize)
    .replace('###version###', pack.version)
    .replace('###hash###', `${algo}-${digest}`);

fs.writeFileSync(readmePath, readme);

console.log(`File ${distFilePath}`);
console.log(`Version: ${pack.version}`);
console.log(`Hash: ${algo}-${digest}`);
console.log(`Size: ${size} KiB`);
console.log(`Gzip size: ${gzipSize} KiB`);
