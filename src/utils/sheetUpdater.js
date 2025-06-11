const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const filePath = path.join(process.cwd(), process.env.GOOGLE_CREDENTIALS_JSON);

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(fs.readFileSync(filePath)),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function updateSheet(data) {
  try{

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Convert array of objects to array of arrays
    // Assumes each object has the same keys: title, company, location
    const values = data.map(item => [item.title, item.company.name, item.location]);
  
    sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values,
      },
    });
  
    return ':white_tick: Data added to Google Sheet.';
  }catch(e){
    return e
  }
}

module.exports = { updateSheet };
