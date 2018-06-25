<template>
    <div>
        <modal-add-bookmark
            v-bind:style="{display: addBookmarkModalDisplay}"
            v-bind:folder="context.currentFolder"
            v-bind:bookmark="bookmark"
            v-on:close-add-bookmark-modal-clicked="closeAddBookmarkModal"
        ></modal-add-bookmark>
        <modal-add-folder 
            v-bind:style="{display: addFolderModalDisplay}"
            v-bind:folder="folder"
            v-bind:parent-folder="context.currentFolder"
            v-on:close-modal-clicked="closeAddFolderModal"
        ></modal-add-folder>
        <menu-folder
            v-bind:current-folder="context.currentFolder"
            v-bind:delete-folder="context.folderStack.length > 0"
            v-on:add-bookmark-clicked="showAddBookmarkModal"
            v-on:add-folder-clicked="showAddFolderModal"
            v-on:delete-folder-clicked="deleteFolder"
        ></menu-folder>
        <div class="w3-padding"></div>
        <ul class="w3-ul w3-hoverable">
            <list-item-bookmark
                v-for="bookmark in context.bookmarks"
                v-bind:bookmark="bookmark"
                v-bind:key="bookmark.id"
            ></list-item-bookmark>
        </ul>
    </div>
</template>

<script>

import listItemBookmark from "./list-item-bookmark.vue";
import menuFolder from "./menu-folder.vue";
import confirmationDialog from "./modal-confirmation-dialog.js";
import modalAddBookmark from "./modal-add-bookmark.vue";
import modalAddFolder from "./modal-add-folder.vue";
import createBookmark from "../createBookmark";
import createFolder from "../createFolder";

export default {
    props: ['context'],
    methods: {
        showAddBookmarkModal: function() { this.addBookmarkVisible = true; },
        showAddFolderModal: function() { this.addFolderVisible = true; },
        closeAddBookmarkModal: function() { this.addBookmarkVisible = false; },
        closeAddFolderModal: function() { this.addFolderVisible = false; },
        deleteFolder: function() {
            confirmationDialog("Are you sure you want to delete this folder?")
                .then((res) => {
                    if (res) {
                        this.context.folderStack.pop();
                        this.context.currentFolder = this.context.folderStack.pop();
                        //this.$emit('delete-folder-confirmed', this.context);
                    }
                })
        }
    },
    data: function () {
        return {
            bookmark: createBookmark(),
            folder: createFolder(),
            addBookmarkVisible: false,
            addFolderVisible: false
        }
    },
    computed: {
        addBookmarkModalDisplay: function() {
            this.bookmark = createBookmark();
            return this.addBookmarkVisible ? 'block' : 'none'
        },
        addFolderModalDisplay: function() {
            this.folder = createFolder();
            return this.addFolderVisible ? 'block' : 'none'
        }
    },
    components: {
        listItemBookmark,
        menuFolder,
        modalAddBookmark,
        modalAddFolder

    }
}
</script>
