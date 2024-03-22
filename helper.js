// Puppeteer is a promise-based library
// It performs asynchronous calls to the headless Chrome instance under hood.

import puppeteer from "puppeteer";

(async () => {
    // Launch a headless browser
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    // open a new page
    const page = await browser.newPage();

    // navigate to the node.js topic page on gitHub
    await page.goto("https://github.com/topics/nodejs");

    const extractedRepos = await page.evaluate(() => {
        // select all repository elements
        const repos = Array.from(document.querySelectorAll("article.border"));

        // Create an empty array to store extracted data
        const repoData = [];

        // Loop through each repository element
        repos.forEach((repo) => {
            const user = repo
                .querySelector("h3 > a:first-child")
                .textContent.trim();

            // use nth-child() select elements in the DOM by their index
            const repoName = repo
                .querySelector("h3 > a:nth-child(2)")
                .textContent.trim();

            const repoLink = repo
                .querySelector("h3 > a:nth-child(2)")
                .getAttribute("href");

            const urlRepo = `https://github.com${repoLink}`;

            const repoStar = repo
                .querySelector("#repo-stars-counter-star")
                .textContent.trim();

            const repoTitle = repo
                .querySelector("#repo-stars-counter-star")
                .getAttribute("title");

            const repoDesc = repo
                .querySelector("div.px-3 > p")
                .textContent.trim();

            const tagsElements = Array.from(
                repo.querySelectorAll("a.topic-tag")
            );
            const tags = tagsElements.map((tag) => tag.textContent.trim());

            repoData.push({
                user,
                repoName,
                urlRepo,
                repoStar,
                repoTitle,
                repoDesc,
                tags,
            });
        });

        return repoData;
    });

    console.log(`We extracted ${extractedRepos.length} repositories.\\n`);

    // Print the extracted data to the console
    console.dir(extractedRepos, { depth: null }); // Show all nested data

    console.log(extractedRepos);

    await browser.close();
})();

// await page.screenshot({
//     path: "images/foto.png",
//     fullPage: true,
// });

// run().then(console.log).catch(console.error);
