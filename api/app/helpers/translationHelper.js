import fs from 'fs';
import Path from 'path';

export default (language, field) => {
    let lang = language ? language : 'en';
    const transaltionsPath = Path.resolve(__dirname, `../translations/${lang}.json`);
    const translationFile = JSON.parse(fs.readFileSync(transaltionsPath, 'utf8'));
    return translationFile[field];
}