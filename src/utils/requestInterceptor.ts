import { Page } from "puppeteer";

export async function useRequestInterceptor(page: Page) {
    await page.setRequestInterception(true);

    page.on('request', request => {
        if (request.resourceType() === 'image') {
            request.continue({
                url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png'
            });
            return;
        }
        // TODO: Check possibility to use fake mp3
        // if (request.url().endsWith('mp3')) {
        //     request.respond({
        //         contentType: 'audio/mp3',
        //         headers: {"Access-Control-Allow-Origin": "*"},
        //         body: FAKE_MP3_BUFFER
        //     });
        // }
        request.continue();
    });
}
