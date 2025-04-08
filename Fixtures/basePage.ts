import { Page } from '@playwright/test';
import { waitTime } from '../General/constants';

export class BasePage {
    constructor(protected page: Page) {
        this.page = page;
    }

    protected async waitForElementWithRetry(
        locator: any,
        action: () => Promise<void>,
        maxRetries: number = 3,
        timeout: number = waitTime.MEDIUM
    ): Promise<void> {
        let retryCount = 0;
        let lastError: Error | null = null;

        while (retryCount < maxRetries) {
            try {
                await locator.waitFor({ state: 'visible', timeout });
                await action();
                return;
            } catch (error) {
                lastError = error as Error;
                retryCount++;
                console.log(`Retry attempt ${retryCount} failed: ${(error as Error).message}`);
                await this.page.waitForTimeout(waitTime.SHORT);
            }
        }

        throw new Error(`Action failed after ${maxRetries} retries. Last error: ${lastError?.message}`);
    }

    protected async waitForNavigationWithTimeout(timeout: number = waitTime.MEDIUM): Promise<void> {
        try {
            await this.page.waitForNavigation({ timeout });
        } catch (error) {
            console.log(`Navigation timeout after ${timeout}ms`);
            throw error;
        }
    }
}

export { expect, Page } from '@playwright/test';
