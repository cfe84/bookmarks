function CallBackendAsync(apiUrl, method = "GET", body = null) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.open(method, "/api" + apiUrl, true);
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status === 200) {
                    if (xhttp.responseText) {
                        var response = JSON.parse(xhttp.responseText);
                        resolve(response);
                    } else {
                        resolve();
                    }
                }
                else {
                    reject({
                        status: 200
                    })
                }
            }
        };
        xhttp.setRequestHeader("userid", "0ff4c5d9-41b3-47bb-84e7-75ef3593c5de");
        if (body) {
            xhttp.setRequestHeader("content-type", "application/json");
        }
        xhttp.send(body);
    })
}

apiOperations = {
    getRootFolder: () => CallBackendAsync(`/folders`),
    getSubfolders: (parentFolderId) => CallBackendAsync(`/folders/${parentFolderId}/folders`),
    getBookmarks: (parentFolderId) => CallBackendAsync(`/folders/${parentFolderId}/bookmarks`),
    getUserInfo: () => CallBackendAsync(`users/me`),
    putBookmark: (parentFolderId, bookmark) => CallBackendAsync(`/folders/${parentFolderId}/bookmarks`, 
        "PUT", JSON.stringify(bookmark))
}