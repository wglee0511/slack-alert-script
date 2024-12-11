

import { google } from "googleapis";
import AWS from 'aws-sdk'

const init = async () => {
  const downloadKeyFileFromS3 = async () => {
    const s3 = new AWS.S3({accessKeyId: S3_ACCESS_KEY, secretAccessKey: S3_ACCESS_SECRET_KEY, region: S3_REGION});
    const params = { Bucket: S3_BUCKET_NAME, Key: JSON_FILE_NAME };
    
    const data = await s3.getObject(params).promise();
    const jsonContent = JSON.parse(data.Body.toString('utf-8'));
    return jsonContent
  }

  const baseRandom = (lower, upper) => {
    return lower + Math.floor(Math.random() * (upper - lower + 1));
  }

  const shuffle = (array, size) => {
    let index = -1,
        length = array.length,
        lastIndex = length - 1;

    size = size === undefined ? length : size;
    while (++index < size) {
      let rand = baseRandom(index, lastIndex),
          value = array[rand];

      array[rand] = array[index];
      array[index] = value;
    }
    array.length = size;
    return array;
  }
  
  const { client_email, private_key }  = await downloadKeyFileFromS3()


  const authorize = new google.auth.JWT(client_email, null, private_key, [
    SPREAD_SHEET_AUTH_URI,
  ]);

  const googleSheet = google.sheets({
    version: 'v4',
    auth: authorize,
  });
  
  const context = await googleSheet.spreadsheets.values.get({
    spreadsheetId: SPREAD_SHEET_ID,
    range: '시트1!A1:B1000',
  });
  const shuffleData = shuffle(context.data.values)
}

init()

    // "googleapis": "^144.0.0",
    // "@slack/web-api": "^7.8.0",     "aws-sdk": "^2.1692.0",