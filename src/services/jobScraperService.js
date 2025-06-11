const { chromium } = require('playwright');
const { updateSheet } = require('../utils/sheetUpdater');
require('dotenv').config();
const axios = require('axios');

const scrapeJobs = async ({
    keywords,
    location,
    datePosted,
    isRemote
}) => {
    console.log(keywords, location, isRemote)
    try {

        const options = {
            method: 'GET',
            url: 'https://linkedin-data-api.p.rapidapi.com/search-jobs',
            params: {
                keywords,
                locationId:location,
                datePosted,
                onsiteRemote: isRemote?"remote":"onSite",
                sort: 'mostRecent'
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST
            }
        };
        const response = await axios.request(options);
        const updatedSheet = updateSheet(response.data.data)
        return updatedSheet;
    } catch (e) {
        console.log(e)
        return {
            status: 500,
            message: e.message
        }
    }

    //return updateSheet(jobs)

}

module.exports = { scrapeJobs }