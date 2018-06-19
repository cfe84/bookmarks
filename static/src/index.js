window.onload = () => {
    var app = new Vue({
        el: '#app',
        data: {
            folders: [
                { id: 123, name: "MS" },
                { id: 456, name: "Engineering" },
                { id: 789, name: "Other"}
            ],
            bookmarks: [
                { id: "1", name: "Something", href: "https://something.com" },
                { id: "2", name: "The second", href: "https://second.com", description: "This one has a description" },
                { id: "3", name: "The third", href: "https://third.com", description:"Description in addition to tags", tags: ["first one", "second tag"] },
                { id: "4", name: "The fourth", href: "https://fourth.com" },
                { id: "5", name: "The fifth", href: "https://fifth.com" },
            ],
            currentFolder: { id: "fake-13948329843", name: "Home"},
            folderStack: [],
        },
        methods: {
            folderClicked: function(folder) { navigateToFolder(folder) },
            homeClicked: function() { loadRootFolder() },
            previousFolderClicked: function() { loadPreviousFolder() }
        }
    });

    function navigateToFolder(folder) {
        if (app.currentFolder && app.currentFolder.id !== "fake-13948329843") {
            app.folderStack.push(app.currentFolder);
        }
        openFolder(folder);
    }

    function openFolder(folder) {
        
        app.currentFolder = folder;
        apiOperations.getSubfolders(folder.id)
            .then(folders => app.folders = folders);
        apiOperations.getBookmarks(folder.id)
            .then(bookmarks => app.bookmarks = bookmarks);
    }

    function loadRootFolder() {  
        app.folderStack = [];      
        apiOperations.getRootFolder()
        .then(rootFolder => openFolder(rootFolder));
    }

    function loadPreviousFolder() {
        const previousFolder = app.folderStack.pop();
        openFolder(previousFolder);
    }


    loadRootFolder();
}