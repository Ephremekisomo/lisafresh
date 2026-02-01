const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const dirs = [
  path.join(__dirname, '..', 'assets', 'images', 'Produits'),
  path.join(__dirname, '..', 'assets', 'images', 'temoignages'),
];

const exts = ['.jpg', '.jpeg', '.png'];

async function optimizeFile(filePath){
  const ext = path.extname(filePath).toLowerCase();
  if(!exts.includes(ext)) return;
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ext);

  const smallJpg = path.join(dir, `${base}-sm.jpg`);
  const mdJpg = path.join(dir, `${base}-md.jpg`);
  const mdWebp = path.join(dir, `${base}-md.webp`);

  try{
    // small jpg
    await sharp(filePath).resize({width:600}).jpeg({quality:70}).toFile(smallJpg);
    // medium jpg
    await sharp(filePath).resize({width:1200}).jpeg({quality:80}).toFile(mdJpg);
    // medium webp
    await sharp(filePath).resize({width:1200}).webp({quality:80}).toFile(mdWebp);
    console.log('Optimized:', filePath);
  }catch(err){
    console.error('Error optimizing', filePath, err.message);
  }
}

async function run(){
  for(const dir of dirs){
    try{
      const files = await fs.readdir(dir);
      const imageFiles = files.filter(f => exts.includes(path.extname(f).toLowerCase()));
      await Promise.all(imageFiles.map(f => optimizeFile(path.join(dir,f))));
    }catch(err){
      console.error('Error reading dir', dir, err.message);
    }
  }
}

run();
