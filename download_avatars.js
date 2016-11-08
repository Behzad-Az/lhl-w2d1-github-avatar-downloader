const userName = process.argv[2];
const repoName = process.argv[3];
const avatarDir = './avatars/';

// Receives the git hub user name and the repo name, requests access to
// the corresponding GitHub API. Calls back a function that uses the
// response from the GitHub API.
function getRepoContributors(repoOwner, repoName, cb) {
  const EXPECTED_ARG_COUNT = 3;
  checkNumOfFcnArguments(EXPECTED_ARG_COUNT, arguments.length, getRepoContributors.name);

  checkEnvData(['gh_TOKEN']);

  const request = require('request');
  require('dotenv').config();
  const GITHUB_USER = "Bhezad-Az";
  const GITHUB_TOKEN = process.env.gh_TOKEN;

  console.log(GITHUB_TOKEN);

  console.log('Welcome to GitHub Avatar Downloader!');

  var options = {
    url: 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'Behzad'
    }
  };

  request(options, getContributorAvatar);
}

// Processes the response from the GitHub API
// Checks for errors and status of response from GitHub
// If okay, parses the response into JSON and find the user avatar
// url, which is then passed to another callback fcn.
function getContributorAvatar (error, response, body) {
  const EXPECTED_ARG_COUNT = 3;
  checkNumOfFcnArguments(EXPECTED_ARG_COUNT, arguments.length, getRepoContributors.name);

  if (!error && response.statusCode === 200) {
    var jsonBody = JSON.parse(body);

    checkDirectoryExist (avatarDir);

    for (item in jsonBody) {
      getAndSaveAvatars(jsonBody[item].avatar_url, jsonBody[item].login, avatarDir);
    }
  } else {
    var error = "Error occured - repo name or user name does not exist";
    throw error;
  }
}

// Receives https url to a user's GitHub avatar. Requests access to
// that url and if okay, it will save it to a local folder.
function getAndSaveAvatars (url, user, filePath) {
  const EXPECTED_ARG_COUNT = 3;
  checkNumOfFcnArguments(EXPECTED_ARG_COUNT, arguments.length, getRepoContributors.name);

  var request = require('request');
  var fs = require('fs');

  request.get(url)

         .on('error', function (err) {
            console.log("Error Occured!!!!! - " + err);
            throw err;
         })

         .on('response', function (response) {
            console.log('Download for ' + user + ' is Complete.');
         })

         .pipe(fs.createWriteStream(filePath + user + '.jpg'));
}


// receives directoy name and checks to see if it exists.
// throws an error if dir does not exist
function checkDirectoryExist (dirName) {
  const EXPECTED_ARG_COUNT = 1;
  checkNumOfFcnArguments(EXPECTED_ARG_COUNT, arguments.length, getRepoContributors.name);

  var fs = require('fs');
  try {
    stats = fs.lstatSync(dirName);

    if(stats.isDirectory()) {
      console.log("Directory or file exists, code is proceeding...");
    }
  } catch (error) {
    console.log("Directory or file " + dirName + " does not exist!");
    throw error;
  }
}

// Receives expected number of a arguments in a function, the actual number of
// arguments in that fcn, and the fcn name.
// Throws an error if incorrect number of arguments were passed.
function checkNumOfFcnArguments (expectedCount, actualCount, fcnName) {
  const ARG_COUNT = expectedCount;
  if (ARG_COUNT !== actualCount) {
    var error = "Invalid number of arguments for " + fcnName + " function. Expected "
          + ARG_COUNT + ", received " + actualCount;
    throw error;
  }
}

// checks to see if the .env file exists.
// Then checks the contents of the .env file against an array of credentials
// for example, when passed ['gh_TOKEN', 'gh_CREDITCARD'], it will verify that
// those two credentials are included in the .env file.
function checkEnvData (arrOfCredentials) {
  require('dotenv').config();

  checkDirectoryExist('./.env');

  arrOfCredentials.forEach ( (element) => {
    if (process.env[element] === undefined) {
      var error = "Invalid or missing credential " + element + " in .env file";
      throw error;
    }
  });
}

// Run the code for the given user name and repo name.
getRepoContributors(userName,repoName,getContributorAvatar);