function CallBackendAsync(apiUrl) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/api" + apiUrl, true);
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status === 200) {
                    var response = JSON.parse(xhttp.responseText);
                    resolve(response);
                }
                else {
                    reject({
                        status: 200
                    })
                }
            }
        };
        xhttp.setRequestHeader("userid", "0ff4c5d9-41b3-47bb-84e7-75ef3593c5de");
        xhttp.send();
    })
}

apiOperations = {
    getRootFolder: () => CallBackendAsync(`/folders`),
    getSubfolders: (parentFolderId) => CallBackendAsync(`/folders/${parentFolderId}/folders`),
    getBookmarks: (parentFolderId) => CallBackendAsync(`/folders/${parentFolderId}/bookmarks`),
    getUserInfo: () => CallBackendAsync(`users/me`),
}