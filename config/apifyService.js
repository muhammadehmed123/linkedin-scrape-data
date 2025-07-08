import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

export async function fetchJobsFromApify(input) {
  const run = await client.actor("harvestapi/linkedin-job-search").call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items;
}