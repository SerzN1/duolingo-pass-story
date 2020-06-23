import { Page } from 'puppeteer';
import { getRandomFromArray } from '../utils/data';


const enum StoryItemType {
    Start = 'start',
    Continue = 'continue',
    Checkboxes = 'checkboxes',
    Pairs = 'pairs',
    MissingWord = 'missing',
    Meaning = 'meaning',
    OrderWords = 'order',
    Finale = 'finale',
    XP = 'xp',
    StoriesList = 'stories',
}

const storyPageObject = {
    startButton: '._1gvCI',
    continueButton: '._2Oelw button:not(:disabled)',
    continueButtonActive: '._215TQ button:not(:disabled)',
    continueButtonLoader: '._3Xtwv',
    activeStoryTitle: '._4LzCD',
    checkboxesList: '._33b24',
    checkboxesListItemActive: '._33b24 ._36eBZ:not(.pBu65):not(.SwV-2) button',
    pairsList: '.xLLhC',
    pairsItemActive: '.xLLhC button:not(.LTM6z):not(._1CGKV)',
    pairsItemPressed: '.xLLhC button.LTM6z',
    pairsItemDisabled: '.xLLhC button._1CGKV',
    missingWordList: '._15bvt',
    missingWordListItemActive: '._15bvt button:not(._2x1zc):not(_1KzTW):not(.GWRVc)',
    meaningSentence: '._1O1Yp ._1WWmh',
    meaningSentenceItemActive: '._1WWmh:not(._2llcE):not(._3RzxT):not(._3RzxT)',
    orderWords: '._2-hAU',
    orderWordsItemActive: '._2-hAU ._37G8A:not(.RGNlp)',
    finaleButton: '._36eBZ._33uuL',
    xpMessage: '._1bGUF',
    xpGainMessage: '._2IKDv._24KT4',
    storiesList: '._2TrHy',
};

export const passStory = async (page: Page, story: any) => {
    console.log('Pass story', story);
    await page.goto(story.url);

    let storyItemType = '';

    while (storyItemType !== StoryItemType.StoriesList) {
        storyItemType = await getStoryItemType(page);
        console.log(storyItemType);

        switch (storyItemType) {
            case StoryItemType.Start:
                await passStoryStart(page);
                break;

            case StoryItemType.Continue:
                await passStoryContinue(page);
                break;

            case StoryItemType.Checkboxes:
                await passStoryCheckboxes(page);
                break;

            case StoryItemType.Pairs:
                await passStoryPairs(page);
                break;

            case StoryItemType.MissingWord:
                await passStoryMissingWord(page);
                break;

            case StoryItemType.Meaning:
                await passStoryMeaningSentence(page);
                break;

            case StoryItemType.OrderWords:
                await passStoryOrderWords(page);
                break;

            case StoryItemType.XP:
                await passStoryXP(page);
                break;

            case StoryItemType.Finale:
                await passStoryFinale(page);
                break;

            default:
                return;
        }
    }

    return;
}

const getStoryItemType = (page: Page) => {
    return Promise.race([
        page.waitForSelector(storyPageObject.startButton).then(() => StoryItemType.Start),
        page.waitForSelector(storyPageObject.checkboxesList).then(() => StoryItemType.Checkboxes),
        page.waitForSelector(storyPageObject.pairsList).then(() => StoryItemType.Pairs),
        page.waitForSelector(storyPageObject.missingWordList).then(() => StoryItemType.MissingWord),
        page.waitForSelector(storyPageObject.meaningSentence).then(() => StoryItemType.Meaning),
        page.waitForSelector(storyPageObject.orderWords).then(() => StoryItemType.OrderWords),
        page.waitForSelector(storyPageObject.xpMessage).then(() => StoryItemType.XP),
        page.waitForSelector(storyPageObject.storiesList).then(() => StoryItemType.StoriesList),
        page.waitForSelector(storyPageObject.continueButton).then(() => StoryItemType.Continue),
        page.waitForSelector(storyPageObject.finaleButton).then(() => StoryItemType.Finale),
    ]);
}

const passStoryStart = async (page: Page) => {
    await page.click(storyPageObject.startButton);
}
const passStoryCheckboxes = async (page: Page) => {
    await passStoryItem(page, storyPageObject.checkboxesListItemActive, storyPageObject.continueButton);
}
const passStoryPairs = async (page: Page) => {
    await passStoryItem(page, storyPageObject.pairsItemActive, storyPageObject.continueButton);
}
const passStoryMissingWord = async (page: Page) => {
    await passStoryItem(page, storyPageObject.missingWordListItemActive, storyPageObject.continueButton);
}
const passStoryMeaningSentence = async (page: Page) => {
    await passStoryItem(page, storyPageObject.meaningSentenceItemActive, storyPageObject.continueButton);
}
const passStoryOrderWords = async (page: Page) => {
    await passStoryItem(page, storyPageObject.orderWordsItemActive, storyPageObject.continueButton);
}
const passStoryContinue = async (page: Page) => {
    await page.click(storyPageObject.continueButtonActive);
}
const passStoryXP = async (page: Page) => {
    const xpMessageElement = await page.waitForSelector(storyPageObject.xpMessage);
    const xpValue = await page.evaluate(xpMessageElement => xpMessageElement.textContent.replace(/\D/gi, ''), xpMessageElement);
    const xpGainMessage = await page.$(storyPageObject.xpGainMessage);
    let xpGain = '';
    if (xpGainMessage) {
        xpGain = await page.evaluate(xpGainMessage => xpGainMessage.textContent, xpGainMessage);
    }
    console.log(`XP total: ${xpValue}, XP gain: ${xpGain || 0}`);
    await page.click(storyPageObject.continueButtonActive);
    await page.waitFor(200); // Wait for the scroll animation
    return xpGain;
}
const passStoryFinale = async (page: Page) => {
    await page.waitForSelector(storyPageObject.finaleButton);
    await page.click(storyPageObject.finaleButton);
}

async function passStoryItem(page: Page, itemsSelector: string, continueSelector: string = storyPageObject.continueButtonActive) {
    do {
        var items = await page.$$(itemsSelector);
        if (items) {
            const randomItem = getRandomFromArray(items);
            if (randomItem) {
                await randomItem.click();
            }
        }
        var continueButton = await page.$(continueSelector);
        if (continueButton) {
            break;
        }
    } while (items.length);

    await page.waitForSelector(continueSelector)
    await page.click(continueSelector);
}
