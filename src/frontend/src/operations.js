function CallBackendAsync(apiUrl, method = "GET", body = null, contentType = "application/json") {
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
        xhttp.setRequestHeader("userid", "user-2");
        if (body) {
            xhttp.setRequestHeader("content-type", contentType);
        }
        xhttp.send(body);
    })
}

export default {
    getRootFolder: () => CallBackendAsync(`/folders`),
    getSubfolders: (parentFolderId) => CallBackendAsync(`/folders/${parentFolderId}/folders`),
    getBookmarks: (parentFolderId) => CallBackendAsync(`/folders/${parentFolderId}/bookmarks`),
    getUserInfo: () => CallBackendAsync(`/users/me`),
    postBookmark: (parentFolderId, bookmark) => CallBackendAsync(`/folders/${parentFolderId}/bookmarks`, 
        "POST", JSON.stringify(bookmark)),
    postFolder: (parentFolderId, folder) => CallBackendAsync(`/folders/${parentFolderId}/folders`, 
        "POST", JSON.stringify(folder)),
    deleteFolder: (parentFolderId, folder) => CallBackendAsync(`/folders/${parentFolderId}/folders`, 
        "DELETE", JSON.stringify(folder)),
    uploadHtml: (parentFolderId, content) => CallBackendAsync(`/folders/${parentFolderId}`,
        "POST", content, "text/html")
}