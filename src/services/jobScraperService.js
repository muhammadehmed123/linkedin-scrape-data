const { chromium } = require('playwright');
const { updateSheet } = require('../utils/sheetUpdater');
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');



const scrapeJobs= async({
    keywords,
    location,
    time
})=>{
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const SCRAPE_URL = `${process.env.LINKEDIN_JOB_SEARCH_API}?keywords=${keywords}&origin=JOB_SEARCH_PAGE_KEYWORD_AUTOCOMPLETE&refresh=true&f_WT=2&location=${location}`;
        
    await page.goto(SCRAPE_URL, {
        waitUntil: 'networkidle2',
    });

    const jobs = await page.evaluate(() => {
        const jobCards = document.querySelectorAll('ul.jobs-search__results-list > li');
        const results = [];

        jobCards.forEach(card => {
            const title = card.querySelector('h3.base-search-card__title')?.innerText.trim();
            const company = card.querySelector('h4.base-search-card__subtitle')?.innerText.trim();
            const location = card.querySelector('.job-search-card__location')?.innerText.trim();
            if (title && company) {
                results.push({ title, company, location });
            }
        });

        return results;
    });

    await browser.close();
    return updateSheet(jobs)

}

module.exports = { scrapeJobs }