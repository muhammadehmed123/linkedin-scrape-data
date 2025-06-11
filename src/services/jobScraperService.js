const { chromium } = require('playwright');
const { updateSheet } = require('../utils/sheetUpdater');
require('dotenv').config();
const axios = require('axios');



const scrapeJobs = async ({
    keywords,
    location,
    isRemote = true
}) => {
    console.log(keywords, location, isRemote)
    try {

        const options = {
            method: 'GET',
            url: 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-7d',
            params: {
                offset: '0',
                title_filter: keywords,
                location_filter: location,
                remote: isRemote?.toString()
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST
            }
        };
        const response = await axios.request(options);
		return (response.data);
    } catch (e) {
        return {
            status: 500,
            message: e.message
        }
    }

    //return updateSheet(jobs)

}

module.exports = { scrapeJobs }