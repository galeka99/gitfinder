'use strict';

const path = require('path');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios').default;
const chalk = require('chalk');

function print(msg, isError = false) {
  const now = moment().format('yyyy/MM/DD HH:mm:ss');
  if (isError) {
    console.log(`[${now}]`, chalk.red(msg));
  } else {
    console.log(`[${now}]`, chalk.green(msg));
  }
}

const results = [];

(async () => {
  // MAIN CODE BELOW

  const urlFilePath = path.join(__dirname, 'url.txt');
  if (!fs.existsSync(urlFilePath)) fs.writeFileSync(urlFilePath, '', 'utf-8');

  const urls = fs.readFileSync(urlFilePath, 'utf-8').split('\n');
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    try {
      const baseUrl = url.includes('://') ? url : `http://${url}`;
      const response = await axios({
        method: 'GET',
        baseURL: baseUrl,
        url: '/.git/HEAD',
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_2_1 like Mac OS X; sl-SI) AppleWebKit/535.45.4 (KHTML, like Gecko) Version/4.0.5 Mobile/8B112 Safari/6535.45.4'
        }
      });
  
      if (response.status === 200 || response.data.includes('ref: refs/heads')) {
        print(url);
        results.push(url);
      }else {
        print(url, true);
      }
    } catch (err) {
      print(url, true);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'result.txt'), results.join('\n'));
  console.log();
  print(`Found ${results.length} urls saved in ${chalk.bold('result.txt')} file.`);

  // MAIN CODE ABOVE
})();