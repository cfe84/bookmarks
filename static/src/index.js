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
            folderClicked: function(folder) { openFolder(folder) },
        }
    });

    function openFolder(folder) {
        apiOperations.getBookmarks(folder.id)
            .then(bookmarks => app.bookmarks = bookmarks);
    }

    function loadRootFolder() {  
        apiOperations.getRootFolder()
        .then(rootFolder => openFolder(rootFolder));
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