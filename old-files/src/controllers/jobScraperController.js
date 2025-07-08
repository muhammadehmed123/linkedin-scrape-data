const jobScraperService= require('../services/jobScraperService');

const getLinkedinJobsController= async(req,res)=>{
    const {job_title, location, datePosted, isRemote}= req.query;
    const result= await jobScraperService.scrapeJobs({
        keywords:job_title,
        location,
        datePosted,
        isRemote: isRemote?true:false
    });
    res.send(result)
}

module.exports={getLinkedinJobsController}