import { Page } from "puppeteer";
import { DUO_STORIES_URL } from "../config";

const storiesPageObject = {
    storiesSection: '._2TrHy',
    storiesActiveLink: 'a._4BXNs[href]',
    activeStoryTitle: '._4LzCD'
};

type Story = {
    url: string,
    title: string,
}

export const findStories = async (page: Page) => {
    await page.goto(DUO_STORIES_URL);
    await page.waitForSelector(storiesPageObject.storiesSection);
    const stories: Story[] = await page.$$eval(storiesPageObject.storiesActiveLink, (storiesActiveLinks: Array<HTMLLinkElement>) => {
        return storiesActiveLinks.map((storiesActiveLink: HTMLLinkElement) => {
            return {
                url: storiesActiveLink.href,
                title: storiesActiveLink.textContent
            };
        });
    })
    return stories;
}
