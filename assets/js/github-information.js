function fetchGitHubInformation (event) {
//pass event argument use jquery
    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a Github username</h2>`);
        return;
    }

    $("#gh-user-data").html (
        `<div id="loader">
            <img src="assets/css/gg.gif" alt="loaidng..." />
        </div>`);
};