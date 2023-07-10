const puppeteer = require('puppeteer');
const automationCtrl = {
  getAutomation: async (req, res) => {
    try {
      const browser = await puppeteer.launch({
        headless: false,
      });
      const page = await browser.newPage();
      await page.goto('https://mail.google.com/mail/u/0/#inbox');
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', 'lola@email-alomarstaffing.com');
      await page.click('#identifierNext');
      await page.waitForSelector('input[type="password"]', { visible: true });

      // Set the password value directly using JavaScript injection
      await page.evaluate(() => {
        const passwordInput = document.querySelector('input[type="password"]');
        passwordInput.value = '846h\\BSj{bkd.9@r';
      });
      await page.click('#passwordNext');
      await page.waitForNavigation({ timeout: 60000, waitUntil: 'domcontentloaded' });
      await page.waitForSelector('div[role="button"]', { timeout: 10000, waitUntil: 'domcontentloaded' });

      // Find and open Indeed Apply emails
      const indeedApplyEmails = await page.$x('//span[contains(text(), "Indeed")]');
      for (const email of indeedApplyEmails) {
        await page.evaluate((element) => {
          element.click();
        }, email);
        await page.waitForNavigation({ timeout: 60000, waitUntil: 'domcontentloaded' });
        // Find and click the "View Your Application" button
        const viewApplicationButton = await page.$x('//a[contains(text(), "Send message")]');
        if (viewApplicationButton.length > 0) {
          await page.evaluate((element) => {
            element.click();
          }, viewApplicationButton[0]);
          // Wait for the new tab to open

          const newTarget = await browser.waitForTarget((target) => target.opener() === page.target());

          // Get the page object for the new tab
          const newPagePromise = newTarget.page();

          // Wait for the new page to load
          const newPage = await newPagePromise;

          // Find and click the "Continue with Google" button in the new tab
          await newPage.waitForSelector('#login-google-button');
          await newPage.click('#login-google-button');

          // Wait for the Google login page to load
          await newPage.waitForNavigation({ waitUntil: 'domcontentloaded' });
          // Send messages
          // const messages = ['test1', 'test2', 'test3']
          // for (const message of messages) {
          //   await newPage.waitForSelector('textarea[placeholder="Write your message"][aria-label="Message collapsed"]');
          //   await newPage.type('textarea[placeholder="Write your message"][aria-label="Message collapsed"]', message);
          // }
          const messages = [`Thanks for reaching out to me.
          Here is my Resume
          https://yeslola.com/resume`,
            `My Portfolio - https://yeslola.com/#portfolio`

            , `Can I be your live chat receptionist? `];
          await newPage.waitForSelector('textarea[placeholder="Write your message"][aria-label="Message collapsed"]');
          await newPage.type('textarea[placeholder="Write your message"][aria-label="Message collapsed"]', messages[0]);
          await newPage.click('.msg-Button.msg-MessageCompose-sendButton.css-1tzd0q6.e8ju0x51');
          // await newPage.waitForNavigation({ waitUntil: 'networkidle0' }); // Wait for the message to be sent
          await newPage.waitForSelector('textarea[placeholder="Write your message"][aria-label="Message collapsed"]');
          await newPage.type('textarea[placeholder="Write your message"][aria-label="Message collapsed"]', messages[1]);
          await newPage.click('.msg-Button.msg-MessageCompose-sendButton.css-1tzd0q6.e8ju0x51');
          // await newPage.waitForNavigation({ waitUntil: 'networkidle0' }); // Wait for the message to be sent
          setTimeout(async () => {
            await newPage.waitForSelector('textarea[placeholder="Write your message"][aria-label="Message collapsed"]');
            await newPage.type('textarea[placeholder="Write your message"][aria-label="Message collapsed"]', messages[2]);
            await newPage.click('.msg-Button.msg-MessageCompose-sendButton.css-1tzd0q6.e8ju0x51');
          }, 3000);
          // await newPage.waitForNavigation({ waitUntil: 'networkidle0' }); // Wait for the message to be sent
          setTimeout(async () => {
            await newPage.close();
          }, 5000);
        }
        //now delete the email
        await page.waitForSelector('[aria-label="Delete"]');
        await page.click('[aria-label="Delete"]');
      }

      // Close the new tab after processing

      res.send('Gmail automation completed successfully!');
      // await browser.close();
    } catch (error) {
      console.error('An error occurred during Gmail automation:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = automationCtrl;
