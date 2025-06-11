const jobScraperService= require('../services/jobScraperService');

const getLinkedinJobsController= async(req,res)=>{
    const {job_title,location,isRemote}= req.query;
    const result= await jobScraperService.scrapeJobs({
        keywords:job_title,
        location,
        isRemote: isRemote??true
    });
    res.send(result)
}

module.exports={getLinkedinJobsController}