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

    function loadRootFolderAsync() {  
        return apiOperations.getRootFolder()
        .then(rootFolder => {
            app.context.currentFolder = rootFolder;
            openFolder(rootFolder);
        });
    }

    function getUserAsync() {
        return apiOperations.getUserInfo();
    }

    function loadUserAsync(user) {
        app.context.user = user;
        return Promise.resolve(user);
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

    function loadIndexAsync() {
        const index = new Vue(bodyIndex);
        index.context = app.context;
        index.$mount(document.getElementById("container"));
        return Promise.resolve();
    }

    function loadSigninRegisterAsync() {

    }

    function boot() {
        getUserAsync()
        .then((user) => {
            const userIsAuthenticated = !!user;
            if (userIsAuthenticated) {
                return loadUserAsync(user)
                .then(( ) => loadIndexAsync())
                .then(( ) => loadRootFolderAsync())
                .then(( ) => loadBookmarkFromParams())
            } else {
                return loadSigninRegisterAsync();
            }
        });
    }
    
    boot();
}