<template>
    <div id="modal" class="w3-modal" style="display: block;">
        <div style="top: 0; left: calc(50% - 200px); position: fixed; 
        max-width: 400px" class="w3-modal-content w3-card-4 w3-animate-top">
            <div style="margin:auto">
                <div class="w3-container w3-theme-d2">
                    <h3>Upload Bookmarks</h3>
                </div>
                <div class="w3-container">
                    <browser-folders v-on:folder-selected="folderSelected"></browser-folders>
                    <div>Selected: {{currentFolder.name}}</div>
                    <p>
                        <input type="file" v-on:change="updateFile">
                    </p>
                    <p>
                        <button :disabled="!fileContent" class="w3-btn w3-padding w3-theme-d2" v-on:click="upload"><i class="fa fa-save"></i>&nbsp;Upload</button>
                        <button class="w3-btn w3-padding w3-theme-d2" v-on:click="closeModal"><i class="fa fa-times"></i>&nbsp;Cancel</button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import fileOperations from "../fileOperations.js";
import apiOperations from "../operations.js";
import browserFolders from "./browser-folders.vue";

export default {
    data: function() {
        return {
            currentFolder: {id: null, name: "Select folder"},
            fileContent: ""
        }
    },
    methods: {
        "folderSelected": function(folder) {
            this.currentFolder = folder;
        },
        "updateFile": function(e) {
            var files = e.target.files;
            if (!files.length)
                return;
            var reader = new FileReader();
            reader.onloadend = (res) => {
                this.fileContent = res.target.result;
            };
            reader.readAsText(files[0]);
        },
        "upload": function() {
            apiOperations.uploadHtml(this.currentFolder.id, this.fileContent)
                .then(() => {
                    this.closeModal();
                });
        },
        "closeModal": function() {
            this.$destroy();
            this.$el.outerHTML = "";
        }
    },
    components: {
        browserFolders
    }    
}
</script>
