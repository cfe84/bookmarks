function CallBackendAsync(apiUrl,
    method = "GET", 
    body = null, 
    contentType = "application/json", 
    headers = []) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        for(let header in headers) {
            xhttp.setRequestHeader(header.header, header.value);
        }
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
        if (body) {
            xhttp.setRequestHeader("content-type", contentType);
        }
        xhttp.send(body);
    })
}

const apiOperations = {
    getRootFolder: () => CallBackendAsync(`/folders`),
    getSubfolders: (parentFolderId) => CallBackendAsync(`/folders/${parentFolderId}/folders`),
    getBookmarks: (parentFolderId) => CallBackendAsync(`/folders/${parentFolderId}/bookmarks`),
    getUserInfo: (anonymous = false) => CallBackendAsync(`/users/me`, 
        headers = anonymous 
            ? [{header: "anonymous", value: "true"}] 
            : []),
    postBookmark: (parentFolderId, bookmark) => CallBackendAsync(`/folders/${parentFolderId}/bookmarks`, 
        "POST", JSON.stringify(bookmark)),
    putBookmark: (oldParentFolderId, newParentFolderId, bookmark) => CallBackendAsync(`/folders/${oldParentFolderId}/bookmarks/?newFolderId=${newParentFolderId}`, 
        "PUT", JSON.stringify(bookmark)),
    postFolder: (parentFolderId, folder) => CallBackendAsync(`/folders/${parentFolderId}/folders`, 
        "POST", JSON.stringify(folder)),
    putFolder: (oldParentFolderId, newParentFolderId, folder) => CallBackendAsync(`/folders/${oldParentFolderId}/folders/${folder.id}?newFolderId=${newParentFolderId}`, 
        "PUT", JSON.stringify(folder)),
    deleteFolder: (parentFolderId, folder) => CallBackendAsync(`/folders/${parentFolderId}/folders`, 
        "DELETE", JSON.stringify(folder)),
    deleteBookmark: (parentFolderId, bookmark) => CallBackendAsync(`/folders/${parentFolderId}/bookmarks/${bookmark.id}`, 
        "DELETE", JSON.stringify(bookmark)),
    uploadHtml: (parentFolderId, content) => CallBackendAsync(`/folders/${parentFolderId}`,
        "POST", content, "text/html")
};

export default apiOperations;