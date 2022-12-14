//useer object been return from githubAPI
function userInformationHTML(user) {
    return `
    <h2>${user.name}
        <span class="small-name">
            (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
        </span>
    </h2>
    <div class="gh-content">
        <div class="gh-avatar">
            <a href="${user.html_url}" target="_blank">
                <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
            </a>
        </div>
<p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos} </p>
    </div>`;
}

function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });

    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

function fetchGitHubInformation(event) {
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    //pass event argument use jquery
    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a Github username</h2>`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/gg.gif" alt="loaidng..." />
        </div>`);

    // We can use the when() and then() methods to create promises. 
    /* When one thing is done, then do another thing.
    Or in our case, when we've got a response from the GitHub API, then run a function to display it in the gh-user-data div.
    Just like in real life though, sometimes promises don't work out as we expect.
    And in coding, it's the same.
    So for that, we also need to pass in an error() function that will handle the error response.
    So let's see how we can do this in our code.
    As we said, we're already displaying our loader.
    So now we can issue the promise.
    We do that by using $.when().
    And the when() method takes a function as its first argument.
    So what we're going to do here is pass in a function.
    And that function is going to be the getJSON() function.
    In here, we can pass in the address of our GitHub API: https://api.github.com/users.
    And then the value of username that we've obtained from our input box.
    So when that is done, then what we want to do is to display it somehow in our gh-user-data div.
    For that, we have another function, response(), which the first argument is the response that came back from our getJSON() method.
    And we're going to store that in another variable called userData.
    Then we can use our jQuery selectors to select the gh-user-data div and set the HTML to the results of another function called userInformationHTML().
    This is something that we're going to write in our next video.
    Into that function, we set userData as the argument.
    As we said though, maybe the promise doesn't work out.
    So let's add an error() function here.
    Our function takes an errorResponse.
    And we're going to say that if the errorResponse.status === 404 (remember, that's a not found error), then what we're going to do is select our gh-user-data div and set its HTML to an error message that says the user wasn't found.
    So in our case, we'll put an h2 heading.
    And then say "No info found for user".
    Because we're using template literals, remember that we can pass in the username here by using the $ and {} notation.
    So we'll close that off.
    Now, the error that comes back may not be a 404 error.
    So if that happens, then what we'll do we'll console.log out the error, just the entire error response.
    And we'll also set our gh-user-data div to the JSON response that we got back.
    So "#gh-user-data" selector in jQuery again.
    And we're going to set the HTML to say Error.
    And then using our template literal format here of $ {}.
    Then we can get the JSON response from our error response variable.
    We'll close off our <h2>.
    Put a semicolon at the end.
    And there we go.
    This will get our data for us.
    At the moment, of course, anything that's not an error message is not rendering to the DOM.
    **/

    /**  $.when(
         //passing function thats getJson
         $.getJSON(`https://api.github.com/users/${username}`)
     ).then(
         function(response) {
             var userData = response;
             // jquery selector to select user-data div 
             $("#gh-user-data").html(userInformationHTML(userData));
         }, funtion(errorResponse) {
             if (errorResponse.status === 404) {
                 $("#gh-user-data").html(`
                     <h2>No info found for user ${username}</h2>`);
             } else {
                 console.log(errorResponse);
                 $("#gh-user-data").html(
                     `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
             }
         });

     } */

     $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        },
        function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(
                    `<h2>No info found for user ${username}</h2>`);
                    //403 means forbidden, when acces denied from github
            } else if (errorResponse.status === 403) {
                //x-ratelimit-reset header , provided by github to know when it reset. its presented to as UNIX time stamp
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000);
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}
$(document).ready(fetchGitHubInformation);


