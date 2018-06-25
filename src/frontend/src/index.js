import Vue from "./vue";
import createContext from "./context";
import apiOperations from "./operations";
import bodyHeader from "./components/body-header.vue";
import bodyFooter from "./components/body-footer.vue";
import sidebar from "./components/sidebar.vue";
import containerFolder from "./components/container-folder.vue";

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
        },
        components: {
            bodyHeader,
            bodyFooter,
            sidebar,
            containerFolder
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