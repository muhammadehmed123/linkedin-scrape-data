// // controllers/pipelineController.js

// const { saveJobs,getFilteredJobs,scoreJobs} = require('./apifyController'); // your saveJobs function

// exports.runFullPipeline = async (req, res) => {
//   try {
//     // 1. Filter jobs
//     await getFilteredJobs(req, res);
//     // You may need to capture the filtered data, depending on your implementation

//     // 2. Score jobs using AIML
//     await scoreJobs(req, res);
//     // Again, capture output if needed

//     // 3. Save scored jobs to database
//     await saveJobs(req, res);

//     // 4. Respond with success
//     res.status(200).json({ message: 'Pipeline completed: filtered, scored, and saved jobs.' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// controllers/pipelineController.js
const axios = require('axios');

exports.runFullPipeline = async (req, res) => {
  try {
    // 1. Call filter API
    await axios.get('http://localhost:3001/api/apify/filtered'); // adjust URL as needed

    // 2. Call AIML scoring API
    await axios.get('http://localhost:3001/api/apify/score'); // adjust URL as needed

    const scoreResponse = await axios.get('http://localhost:3001/api/apify/scored'); // adjust as needed
    const scoredJobs = scoreResponse.data.jobs; // adjust this if your API returns a different structure

    if (!Array.isArray(scoredJobs) || scoredJobs.length === 0) {
      return res.status(400).json({ error: 'No scored jobs returned from score API.' });
    }


    // 3. Call save jobs API
    await axios.post('http://localhost:3001/api/save-jobs', { jobs: scoredJobs }, {
      headers: {
        // If you need to pass user info, add headers here
      }
    });

    res.status(200).json({ message: 'Pipeline completed: filtered, scored, and saved jobs.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};