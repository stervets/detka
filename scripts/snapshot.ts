import { writeFileSync } from 'node:fs';
import { readContent } from '../backend/content';
writeFileSync('frontend/content.json',JSON.stringify(readContent(),null,2));
