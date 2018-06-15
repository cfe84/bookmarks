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
            currentFolder: { id: "root", name: "Home"},
            folderStack: []
        },
        methods: {
            folderClicked: function(folder) { openFolder(folder) },
            bookmarkClicked: function(bookmark) { launchBookmark(bookmark.href) },
            homeClicked: function() { loadRootFolder() },
            previousFolderClicked: function() { loadPreviousFolder() }
        }
    });

    function openFolder(folder) {
        currentFolder = folder;
        folderStack.push(folder);
        apiOperations.getSubfolders(folder.id)
            .then(folders => {
                app.folders = folders
            });
        apiOperations.getBookmarks(folder.id)
            .then(bookmarks => {
                app.bookmarks = bookmarks
            });
    }

    function loadRootFolder() {  
        folderStack = [];      
        apiOperations.getRootFolder()
        .then(rootFolder => openFolder(rootFolder));
    }

    function loadPreviousFolder() {
        folderStack.pop();
        openFolder(folderStack[folderStack.length - 1]);
    }

    function launchBookmark(href) {
        window.open(href);
    }

    loadRootFolder();
}