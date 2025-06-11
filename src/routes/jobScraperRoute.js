const jobScraperController= require('../controllers/jobScraperController');

const scraperRoute = [
    {
        url: '/get-linkedin-jobs',
        method: 'GET',
        handler: jobScraperController.getLinkedinJobsController
    },
]

module.exports= scraperRoute