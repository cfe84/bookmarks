window.onload = () => {
    var app = new Vue({
        el: '#app',
        data: {
            context: createContext()
        },
        methods: {
            folderClicked: function(folder) {
                openFolder(folder);
            }
        }
    });

    function openFolder(folder) {
        apiOperations.getBookmarks(folder.id)
            .then(bookmarks => app.context.bookmarks = bookmarks);
    }

    function loadRootFolder() {  
        apiOperations.getRootFolder()
        .then(rootFolder => {
            app.context.currentFolder = rootFolder;
            openFolder(rootFolder);
        });
    }

    loadRootFolder();
}


function createBookmark() {
    return {
        name: "",
        href: "",
        description: "",
        keyword: "",
        tags: ""
    };
}

function createFolder() {
    return {
        name: "",
        description: ""
    }
}