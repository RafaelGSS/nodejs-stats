// Modified version of: https://gist.github.com/cjihrig/74eb55c25c752cf7e5db23567baf8d32
// Aggregate "downloads" by year-month (Since 01/01/2022)
'use strict';

const assert = require('node:assert');
const fs = require('node:fs/promises');
const DATA_HOME_URL = 'https://storage.googleapis.com/access-logs-summaries-nodejs/index.html';
const DATA_FILE_PATH = 'data.json';
const AGGREGATED_JSON_PATH = 'aggregated.json';
const LINES = ['14', '16', '18', '20'];

async function main() {
  const data = await loadJsonData();
  const series = getDownloadsSeries(data);
  console.log(series)

  await writeJsonFile(series);
}

async function writeJsonFile(series) {
  await fs.writeFile(AGGREGATED_JSON_PATH, JSON.stringify(series, null, 2));
}

function getDownloadsSeries(data) {
  const values = { total: 0 };

  for (const yearMonth of Object.keys(data)) {
    for (let i = 0; i < data[yearMonth].length; i++) {
      const d = data[yearMonth][i];
      const versions = d.version;
      const counts = new Map();

      values.total += d.total;

      for (let i = 0; i < LINES.length; i++) {
        counts.set(LINES[i], 0);
      }

      for (const [version, count] of Object.entries(versions)) {
        const major = version.match(/^v(\d+)\./)?.[1];
        const curCount = counts.get(major);

        if (curCount !== undefined) {
          counts.set(major, curCount + count);
        }
      }

      if (!values[yearMonth]) values[yearMonth] = {}

      for (const [version, count] of counts) {
        if (!values[yearMonth][version]) values[yearMonth][version] = 0
        values[yearMonth][version] += count
      }
    }
  }

  return values;
}

async function loadJsonData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8');

    return JSON.parse(data);
  } catch (err) {
    assert.strictEqual(err.code, 'ENOENT');

    const jsonUrls = await getJsonUrls();
    const data = await getJsonData(jsonUrls);

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return data;
  }
}

async function getJsonData(urls) {
  const data = {};
  // Define the regex pattern to match the date at the end of the URL
  const pattern = /(\d{8})\.json$/;

  for (let i = 0; i < urls.length; i++) {
    const match = urls[i].match(pattern);
    assert(match, urls[i])
    const dateStr = match[1];
    const year = dateStr.substring(0, 4);
    // Collect data from 01/01/2022
    if (year === '2021') continue;
    const month = dateStr.substring(4, 6);
    const yearMonth = `${year}-${month}`;

    const res = await fetch(urls[i]);
    const json = await res.json();

    if (!data[yearMonth]) data[yearMonth] = []
    data[yearMonth].push(json);
  }

  return data;
}

async function getJsonUrls() {
  const res = await fetch(DATA_HOME_URL);
  const html = await res.text();
  const jsonUrls = Array.from(html.matchAll(/\<a href=\"(?<url>.+)\">/g));

  return jsonUrls.map((match) => {
    const url = match.groups?.url;
    assert(url);
    return url;
  });
}

main();
