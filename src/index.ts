import * as dotenv from 'dotenv';
import { launch, Page, Browser } from 'puppeteer';

import { passStory } from './pageObjects/storyPage';
import { logIn } from './pageObjects/indexPage';
import { findStories } from './pageObjects/storiesPage';
import { getRandomFromArray } from './utils/data';
import { disableCSSAnimations } from './utils/animation';
import { useRequestInterceptor } from './utils/requestInterceptor';

import { DUO_URL, STORIES_TO_PASS, STORY_TO_START, STORY_TO_END } from './config';

// Don't forget to create relevant .env file
dotenv.config();

(async () => {
    const browser: Browser = await launch({
        // headless: false,
        ignoreDefaultArgs: [
            // "--mute-audio",
        ],
        // , slowMo: 250
    });
    const page: Page = await browser.newPage();
    await page.evaluateOnNewDocument(disableCSSAnimations);

    await useRequestInterceptor(page);

    await page.goto(DUO_URL);
    await logIn(page);
    const stories = await findStories(page);

    console.log(`${stories.length} active stories found`);

    if (!stories || !stories.length) return;

    let storiesToPass = STORIES_TO_PASS;
    while (storiesToPass) {
        const story = getRandomFromArray(stories.slice(STORY_TO_START, STORY_TO_END - STORY_TO_START));
        await passStory(page, story);
        storiesToPass -= 1;
    }

    await browser.close();
})();
