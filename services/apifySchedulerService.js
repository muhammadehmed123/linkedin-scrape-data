const axios = require('axios');

let nextRunTimeout = null;
let nextRun = null;
const API_BASE_URL = process.env.API_BASE_URL;

console.log(API_BASE_URL);

async function runApifyJobAndScheduleNext() {
  try {
    // Call your own endpoint (adjust port if needed)
    await axios.get(`${API_BASE_URL}/api/apify`);
    console.log('Apify job run at', new Date().toISOString());
  } catch (err) {
    console.error('Failed to run Apify job:', err.message);
  }
  // Schedule next run 24 hours from now
  nextRun = new Date(Date.now() + 24 * 60 * 60 * 1000);
  scheduleNextRun();
}

function scheduleNextRun() {
  if (nextRunTimeout) clearTimeout(nextRunTimeout);
  const msUntilNext = nextRun - new Date();
  nextRunTimeout = setTimeout(runApifyJobAndScheduleNext, msUntilNext);
}

function startApifyScheduler() {
  nextRun = new Date(Date.now() + 24 * 60 * 60 * 1000);
  scheduleNextRun();
  // Optionally, run immediately on server start:
  // runApifyJobAndScheduleNext();
}

function getNextRunInfo() {
  if (!nextRun) {
    return { nextRun: null, secondsRemaining: null };
  }
  const now = new Date();
  const secondsRemaining = Math.max(0, Math.floor((nextRun - now) / 1000));
  return { nextRun, secondsRemaining };
}

module.exports = {
  startApifyScheduler,
  getNextRunInfo,
};