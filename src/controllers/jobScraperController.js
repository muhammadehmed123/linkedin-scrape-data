const jobScraperService= require('../services/jobScraperService');

const getLinkedinJobsController= async(req,res)=>{
    const {job_title,location,time}= req.query;
    const result= await jobScraperService.scrapeJobs({
        keywords:job_title,
        location,
        time
    });
    res.send(result)
}

module.exports={getLinkedinJobsController}