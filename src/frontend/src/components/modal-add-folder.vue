<template>
    <div id="modal" class="w3-modal" style="display: block">
        <modal-select-folder 
            v-on:folder-selected="folderSelected" 
            v-on:folder-selection-cancelled="hideFolderSelection" 
            v-bind:visible="folderModalVisible"
            v-bind:context="context"
            v-bind:updateContext="false"
        >
        </modal-select-folder>
        <div style="top: 0; left: calc(50% - 200px); position: fixed; max-width: 400px" class="w3-modal-content w3-card-4 w3-animate-top">
            <div style="margin:auto">
                <div class="w3-container w3-theme-d2">
                    <h3>{{addOrUpdate}} folder</h3>
                </div>
                <div class="w3-container w3-card-4 w3-white">
                    <p>
                        <label class="w3-text-grey">Name</label>
                        <input type="text" v-model="folder.name" class="w3-input"/>
                    </p>
                    <p>
                        <label class="w3-text-grey">Parent folder</label>
                        <span>{{selectedFolder.name}} <i class="fa fa-folder" v-on:click="showFolderSelection"></i></span>
                    </p>
                    <p>
                        <label class="w3-text-grey">Description</label>
                        <input type="text" class="w3-input" v-model="folder.description" />
                    </p>
                    <p>
                        <button class="w3-btn w3-padding w3-theme-d2" 
                            v-on:click="saveFolder"
                            v-bind:disabled="!saveButtonEnabled">
                            <i class="fa fa-save"></i>&nbsp;Save</button>
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
    computed: {
        addOrUpdate: function () { return (this.folder && this.folder.id) ? 
            "Update"
            : "Add" },
        saveButtonEnabled: function() { 
            return this.selectedFolder 
                && this.selectedFolder.id
                && this.selectedFolder.id !== this.folder.id
                // Todo: need to check it's not a subfolder as well.
                && this.folder 
                && this.folder.name;
        }
    },
    methods: {
        closeModal: function() { 
            this.$el.outerHTML = "";
            this.$emit('close-modal-clicked'); 
            this.$destroy();
        },
        saveFolder: function() { 
            if (this.bookmark && this.bookmark.split) {
                this.bookmark.tags = this.bookmark.tags.split(",");
            }
            if (!this.folder.id) {
                apiOperations.postFolder(this.selectedFolder.id, this.folder).then(() => {
                    if (this.selectedFolder.id === this.context.currentFolder.id) {
                        this.context.folders.push(this.folder);
                    }
                    this.closeModal();        
                });
            } else {
                apiOperations.putFolder(this.oldFolderId, this.selectedFolder.id, this.folder).then(() => {
                    // Todo: The ui should update as well...
                    this.closeModal();        
                });
            }
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
        "folder", "context"
    ],
    data: function() {
        return {
            selectedFolder: {id: "root", name: "Home"},
            oldFolderId: null,
            folderId: null,
            folderModalVisible: false
        };
    },
    mounted: function() {
        this.selectedFolder = this.folder.id 
            ? this.context.folderStack[this.context.folderStack.length - 1]
            : this.context.currentFolder;
        this.folderId = this.selectedFolder.id;
        this.oldFolderId =  this.selectedFolder.id;
    },
    components: {
        modalSelectFolder
    }
}
</script>
