Vue.component("modal-select-folder", {
    props: ["visible"],
    data: function() {
        return {
            currentFolder: {name: "Home", id: "root"},
            folderStack: [],
        };
    },
    computed: {
        modalVisibility: function() { return this.visible ? "block" : "none" }
    },
    methods: {
        "folderSelected": function(folder) {
            this.currentFolder = folder;
        },
        "selectFolder": function() {
            this.$emit('folder-selected', this.currentFolder);
        },
        "closeModal": function() {
            this.$emit('folder-selection-cancelled');
        }
    },
    template: '\
<div v-bind:style="{display: modalVisibility}" id="modal" class="w3-modal">\
<div style="top: 0; left: calc(50% - 200px); position: fixed; \
max-width: 400px" class="w3-modal-content w3-card-4 w3-animate-top">\
    <div style="margin:auto">\
        <div class="w3-container w3-theme-d2">\
            <h3>Select Folder</h3>\
        </div>\
        <div class="w3-container">\
            <browser-folders v-on:folder-selected="folderSelected"></browser-folders>\
            <div>Selected: {{currentFolder.name}}</div>\
            <p>\
                <button class="w3-btn w3-padding w3-theme-d2" v-on:click="selectFolder"><i class="fa fa-save"></i>&nbsp;Select</button>\
                <button class="w3-btn w3-padding w3-theme-d2" v-on:click="closeModal"><i class="fa fa-times"></i>&nbsp;Cancel</button>\
            </p>\
        </div>\
    </div>\
</div>\
</div>'
});