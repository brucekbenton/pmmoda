

function getCookieOrgID() {
    var orgID = 0;
    cookie_String = document.cookie;
    if (cookie_String != "") {
        var re = /project/;

        pos = cookie_String.indexOf("currentOrg");
        var project = cookie_String.substring(pos);
        var regex = /\d+/;
        var id = project.match(regex);
        orgID = id;
    }
    return orgID;
}

function getCookieCurrentUser() {
    var pos1 = 0;
    var pos2 = undefined;
    cookie_String = document.cookie;
    if (cookie_String != "") {
        var re = /project/;

        pos1 = cookie_String.indexOf("currentUser");
        var user = cookie_String.substring(pos1);
        pos1 = user.indexOf("=");
        pos2 = user.indexOf(";");
        if (pos2 == undefined || pos2 == -1) {
            user = user.substring(pos1+1);
        }
        else {
            user = user.substring(pos1+1, pos2);
        }
//        var regex = /\d+/;
//        var id = user.match(regex);
//        orgID = id;
    }
    return user;
}

/*
function getCookieWBSID() {
    var wbsID = 0;
    cookie_String = document.cookie;
    if (cookie_String != "") {
        var re = /project/;

        pos = cookie_String.indexOf("currentWBS");
        if (pos >= 0) {
            var project = cookie_String.substring(pos);
            var regex = /\d+/;
            var id = project.match(regex);
            wbsID = id;
        }
        else {
            wbsID = -1;
        }
    }
    return wbsID;
}
*/

function getCookieProjectID() {
    var projectID = 0;
    cookie_String = document.cookie;
    if (cookie_String != "") {
        var re = /project/;

        pos = cookie_String.indexOf("currentProject");
        if (pos >= 0) {
            var project = cookie_String.substring(pos);
            var regex = /\d+/;
            var id = project.match(regex);
            projectID = id;
        }
        else {
            projectID = -1;
        }
    }
    return projectID;
}


