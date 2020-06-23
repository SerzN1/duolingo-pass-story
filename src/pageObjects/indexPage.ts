import { Page } from "puppeteer";

const indexPageObject = {
    loginBtn: 'a[data-test="have-account"]',
    popupEmailInput: 'input[data-test="email-input"]',
    popupPasswordInput: 'input[data-test="password-input"]',
    popupLoginBtn: 'button[data-test="register-button"]',
};

export const logIn = async (page: Page) => {
    await page.click(indexPageObject.loginBtn);
    await page.waitForSelector(indexPageObject.popupEmailInput);
    await page.type(indexPageObject.popupEmailInput, process.env.DUO_USER);
    await page.type(indexPageObject.popupPasswordInput, process.env.DUO_PWD);
    await page.waitFor(100);
    await page.click(indexPageObject.popupLoginBtn);
    await page.waitForNavigation();
}
