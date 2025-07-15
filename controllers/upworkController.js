// const { fetchUpworkJobs } = require('../services/upworkService');

// exports.fetchAndSaveJobs = async (req, res) => {
//     try {
//         // Optionally, allow custom input via req.body
//         const { items, datasetUrl } = await fetchUpworkJobs();
//         res.json({
//             message: 'Upwork jobs fetched and saved to JSON file',
//             count: items.length,
//             datasetUrl
//         });
//     } catch (error) {
//         console.error('Error fetching or saving jobs:', error);
//         res.status(500).json({ message: 'Error fetching or saving jobs', error: error.message });
//     }
// };

const { fetchUpworkJobs } = require('../services/upworkService');

exports.fetchAndSaveJobs = async (req, res) => {
    try {
        const input = req.body; // Accepts JSON input from POST
        const { items, count } = await fetchUpworkJobs(input);
        res.json({
            message: 'Upwork jobs fetched and saved to JSON file',
            count,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching or saving jobs', error: error.message });
    }
};