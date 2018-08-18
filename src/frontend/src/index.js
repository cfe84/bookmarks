import Vue from "./vue";
import createContext from "./context";
import apiOperations from "./operations";
import getBookmarkFromParameters from "./addBookmark";

import bodyIndex from "./components/body-index.vue";
import modalAddBookmark from "./components/modal-add-bookmark.vue";
import attachToElement from "./components/attachToElement";

window.onload = () => {

    const context = createContext();
    var app = new Vue({
        el: '#app',
        data: {
            context: context
        },
        components: {
            bodyIndex
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

    function loadUser() {
        apiOperations.getUserInfo()
        .then(user => {
            app.context.user = user;
        })
    }

    function loadBookmarkFromParams() {
        const bookmark = getBookmarkFromParameters();
        if (bookmark) {
            const modal = new Vue(modalAddBookmark);
            modal.context = app.context;
            modal.bookmark = bookmark;
            modal.$on("add-bookmark-modal-closed", () => window.close());
            attachToElement(document.getElementById("confirmation"), modal);
        }
    }

    loadRootFolder();
    loadUser();
    loadBookmarkFromParams();
}