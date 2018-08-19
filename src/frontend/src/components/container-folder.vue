<template>
    <div>
        <menu-folder
            v-bind:context="context"
            v-bind:delete-folder="context.folderStack.length > 0"
            v-on:add-bookmark-clicked="showAddBookmarkModal"
            v-on:add-folder-clicked="showAddFolderModal"
            v-on:delete-folder-clicked="deleteFolder"
            v-on:edit-folder-clicked="editFolder"
            v-on:upload-bookmarks-clicked="showUploadBookmarkModal"
        ></menu-folder>
        <modal-upload-bookmarks
            v-bind:style="{display: uploadBookmarksModalDisplay}"
            v-bind:context="context"
            v-on:close-modal-clicked="closeUploadBookmarkModal"
        ></modal-upload-bookmarks>
        <div class="w3-padding"></div>
        <ul class="w3-ul">
            <list-item-bookmark
                v-for="bookmark in context.bookmarks"
                v-bind:bookmark="bookmark"
                v-bind:context="context"
                v-bind:key="bookmark.id"
            ></list-item-bookmark>
        </ul>
    </div>
</template>

<script>

import Vue from "../vue";
import listItemBookmark from "./list-item-bookmark.vue";
import menuFolder from "./menu-folder.vue";
import confirmationDialog from "./modal-confirmation-dialog.js";
import modalAddBookmark from "./modal-add-bookmark.vue";
import modalAddFolder from "./modal-add-folder.vue";
import modalUploadBookmarks from "./modal-upload-bookmarks.vue";
import createBookmark from "../createBookmark";
import createFolder from "../createFolder";
import attachToElement from "./attachToElement.js";

export default {
    props: ['context'],
    methods: {
        showAddBookmarkModal: function() { 
            const modal = new Vue(modalAddBookmark);
            modal.context = this.context;
            modal.bookmark = createBookmark();
            attachToElement(document.getElementById("confirmation"), modal);
         },
        showAddFolderModal: function() {
            const modal = new Vue(modalAddFolder);
            modal.context = this.context;
            modal.folder = createFolder();
            attachToElement(document.getElementById("confirmation"), modal);
        },
        showUploadBookmarkModal: function() { this.uploadBookmarksVisible = true;},
        closeUploadBookmarkModal: function() { this.uploadBookmarksVisible = false;},

        deleteFolder: function() {
            confirmationDialog("Are you sure you want to delete this folder?")
                .then((res) => {
                    if (res) {
                        this.context.folderStack.pop();
                        this.context.currentFolder = this.context.folderStack.pop();
                    }
                })
        },

        editFolder: function() {
            const modal = new Vue(modalAddFolder);
            modal.context = this.context;
            modal.folder = this.context.currentFolder;
            attachToElement(document.getElementById("confirmation"), modal);
        }
    },
    data: function () {
        return {
            uploadBookmarksVisible: false
        }
    },
    computed: {
        uploadBookmarksModalDisplay: function() {
            return this.uploadBookmarksVisible ? 'block': "none";
        }
    },
    components: {
        listItemBookmark,
        menuFolder,
        modalUploadBookmarks
    }
}
</script>
