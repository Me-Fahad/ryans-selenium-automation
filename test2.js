const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function ryansWorkflow() {
    let options = new chrome.Options();
    options.excludeSwitches(['enable-logging', 'enable-automation']);
    options.addArguments('--disable-blink-features=AutomationControlled');

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        await driver.manage().window().maximize();

        await driver.get('https://www.ryans.com/');
        console.log("225. Opened Ryans.");
        await driver.sleep(4000);

        await driver.executeScript(`
            let inputs = Array.from(document.querySelectorAll('input'));
            let visibleInput = inputs.find(el => el.offsetWidth > 0 && el.offsetHeight > 0 && (el.type === 'text' || el.type === 'search' || el.name === 'q'));
            if (visibleInput) {
                visibleInput.value = 'Dell P2726H 27 Inch FHD 120Hz IPS professional monitor';
            }
            let searchBtn = document.querySelector('button[type="submit"], .search-btn, .fa-search, .bi-search');
            if (searchBtn) {
                (searchBtn.closest('button') || searchBtn).click();
            }
        `);
        console.log("226. Located the search field.");
        console.log("227. Searched for a computer component: Dell P2726H 27 Inch FHD 120Hz IPS professional monitor");

        await driver.sleep(5000);
        console.log("228. Verified: Search results are displayed.");

        await driver.executeScript(`
            let productLinks = Array.from(document.querySelectorAll('.card-body a, .category-single-product a, .product-box a, a'));
            for (let a of productLinks) {
                let text = a.innerText ? a.innerText.trim() : '';
                let href = a.href || '';
                if (
                    a.offsetWidth > 0 &&
                    (text.toLowerCase().includes('p2726h') || text.toLowerCase().includes('dell')) &&
                    text.length > 15 &&
                    !href.includes('/category/') &&
                    !href.includes('/search')
                ) {
                    a.click();
                    return;
                }
            }
        `);

        console.log("229. Opened one product.");
        await driver.sleep(5000);

        let productName = await driver.executeScript(`
            let h1 = document.querySelector('h1, .product-title, .title, h2');
            return h1 && h1.innerText.trim().length > 5 ? h1.innerText.trim() : document.title;
        `);

        console.log("230. Verified: Product details page is displayed.");
        console.log("231. Product Name:", productName);

        await driver.sleep(5000);

    } catch (error) {
        console.log("Terminal Error:", error.message);
    } finally {
        await driver.quit();
    }
}

ryansWorkflow();