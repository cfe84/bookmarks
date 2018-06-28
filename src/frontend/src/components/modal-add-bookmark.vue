<template>
    <div id="modal" class="w3-modal">
        <modal-select-folder v-on:folder-selected="folderSelected" 
        v-on:folder-selection-cancelled="hideFolderSelection" v-bind:visible="folderModalVisible">
        </modal-select-folder>
        <div style="top: 0; left: calc(50% - 200px); position: fixed; max-width: 400px" class="w3-modal-content w3-card-4 w3-animate-top">
            <div style="margin:auto">
                <div class="w3-container w3-theme-d2">
                    <h3>Add bookmark</h3>
                </div>
                <div class="w3-container w3-card-4 w3-white">
                    <p>
                        <label class="w3-text-grey">Name</label>
                        <input type="text" v-model="bookmark.name" class="w3-input"/>
                    </p>
                    <p>
                        <label class="w3-text-grey">HREF</label>
                        <input type="text" v-model="bookmark.href" class="w3-input"/>
                    </p>
                    <p>
                        <label class="w3-text-grey">Folder</label>
                        <span>{{selectedFolder.name}} <i class="fa fa-folder" v-on:click="showFolderSelection"></i></span>
                    </p>
                    <p>
                        <label class="w3-text-grey">Description</label>
                        <input type="text" class="w3-input" v-model="bookmark.description" />
                    </p>
                    <p>
                        <label class="w3-text-grey">Shortcut</label>
                        <input type="text" class="w3-input" v-model="bookmark.keyword" />
                    </p>
                    <p>
                        <label class="w3-text-grey">Tags (Separated by comma)</label>
                        <input type="text" class="w3-input" v-model="bookmark.tags"/>
                    </p>
                    <p>
                        <button class="w3-btn w3-padding w3-theme-d2" v-on:click="saveBookmark"><i class="fa fa-save"></i>&nbsp;Save</button>
                        <button class="w3-btn w3-padding w3-theme-d2" v-on:click="closeModal"><i class="fa fa-times"></i>&nbsp;Close</button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import modalSelectFolder from "./modal-select-folder.vue";
import apiOperations from "../operations";

export default {
    methods: {
        closeModal: function() { this.$emit('close-add-bookmark-modal-clicked'); },
        saveBookmark: function() { 
            if (this.bookmark && this.bookmark.split) {
                this.bookmark.tags = this.bookmark.tags.split(",");
            }
            apiOperations.postBookmark(this.selectedFolder.id, this.bookmark).then(() => {
                if (this.selectedFolder.id === this.context.currentFolder.id) {
                    this.context.bookmarks.push(this.bookmark);
                }
                this.closeModal();        
            });
        },
        showFolderSelection: function() {
            this.folderModalVisible = true;
        },
        folderSelected: function(folder) {
            this.selectedFolder = folder;
            this.folderModalVisible = false;
        },
        hideFolderSelection: function() {
            this.folderModalVisible = false;
        }
    },
    props: [
        "context", "bookmark"
    ],
    data: function() {
        return {
            selectedFolder: this.context.currentFolder,
            folderModalVisible: false
        };
    },
    components: {
        modalSelectFolder
    }
}
</script>
