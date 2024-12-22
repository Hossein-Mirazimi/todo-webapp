import path from 'path';
import { fileURLToPath } from 'url';
import { IS_PROD } from '../config/env'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const REPOSITORY_ROOT = path.resolve(__dirname, IS_PROD ? '../../../../' : '../../');

export const absoluteFromRoot = (...str: string[]) => path.resolve(REPOSITORY_ROOT, ...str);