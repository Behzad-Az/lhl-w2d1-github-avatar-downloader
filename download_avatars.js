const userName = process.argv[2];
const repoName = process.argv[3];

// Receives the git hub user name and the repo name, requests access to
// the corresponding GitHub API. Calls back a function that uses the
// response from the GitHub API.
function getRepoContributors(repoOwner, repoName, cb) {
  const request = require('request');
  const GITHUB_USER = "Bhezad-Az";

  // Access code replaced with XXXXXX before submitting to GitHub.
  const GITHUB_TOKEN = "XXXXXXXXXXXXXXXXXXXXXXXXXXX";

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

  if (!error && response.statusCode === 200) {
    var jsonBody = JSON.parse(body);

    for (item in jsonBody) {
      getAndSaveAvatars(jsonBody[item].avatar_url, jsonBody[item].login, './avatars/');
    }
  } else {
    console.log("Error occured - " + error);
  }
}

// Receives https url to a user's GitHub avatar. Requests access to
// that url and if okay, it will save it to a local folder.
function getAndSaveAvatars (url, user, filePath) {
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

// Run the code for the given user name and repo name.
getRepoContributors(userName,repoName,getContributorAvatar);