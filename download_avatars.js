var userName = process.argv[2];
var repoName = process.argv[3];

// Receives the git hub user name and the repo name, requests access to
// the corresponding GitHub API. Calls back a function that uses the
// response from the GitHub API.
function getRepoContributors(repoOwner, repoName, cb) {
  const request = require('request');
  const GITHUB_USER = "Bhezad-Az";
  const GITHUB_TOKEN = "2a2b74ad7c5b2979c34f36c0a51a9d8e9cb05693";

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
      //console.log(jsonBody);
      getAndSaveAvatars(jsonBody[item].avatar_url,jsonBody[item].login);
    }
  } else {
    console.log("Error occured.");
  }
}

// Receives https url to a user's GitHub avatar. Requests access to
// that url and if okay, it will save it to a local folder.
function getAndSaveAvatars (link, user) {
  var request = require('request');
  var fs = require('fs');

  request.get(link)

         .on('error', function (err) {
            console.log("Error Occured!!!!! - " + err);
            throw err;
         })

         .on('response', function (response) {
            console.log('Download for ' + user + ' is Complete.');
         })

         .pipe(fs.createWriteStream('./avatars/' + user + '.jpg'));
}

// Run the code for the given user name and repo name.
getRepoContributors(userName,repoName,getContributorAvatar);