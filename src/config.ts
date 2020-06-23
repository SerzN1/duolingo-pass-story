import * as path from 'path';
import * as fs from 'fs';

export const DUO_URL = 'https://www.duolingo.com/';
export const DUO_STORIES_URL = 'https://www.duolingo.com/stories/';
export const STORIES_TO_PASS = 250;
export const STORY_TO_START = 0;
export const STORY_TO_END = 50;

export const STATIC_FOLDER = '/static';

// TODO: Replace all the sounds with zero item
export const FAKE_MP3_URL = 'https://ccrma.stanford.edu/~jos/mp3/violin2.mp3';
export const FAKE_MP3_PATH = path.join('https://localhost:8080', STATIC_FOLDER, 'out.mp3');
export const FAKE_MP3_BUFFER = fs.readFileSync('static/out.mp3');