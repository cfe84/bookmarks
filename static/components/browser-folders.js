Vue.component("browser-folders", function(resolve,reject) {
    let rootFolder;
    apiOperations.getRootFolder()
    .then((folder) => {
        rootFolder = folder;
        return apiOperations.getSubfolders(folder.id);
    })
    .then((subFolders) => {
        resolve({
            data: function() {
                return {
                    currentFolder: rootFolder,
                    folders: subFolders,
                    modalVisible: false,
                    folderStack: []
                };
            },
            methods: {
                "subFolderSelected": function(folder) {
                    this.folderStack.push(this.currentFolder);
                    this.openFolder(folder);
                },
                "openFolder": function(folder) {
                    apiOperations.getSubfolders(folder.id)
                    .then((subFolders) => {
                        this.currentFolder = folder;
                        this.folders = subFolders;
                        this.$emit("folder-selected", folder);
                    })
                },
                "goHome": function() {
                    this.folderStack = [];
                    this.openFolder(rootFolder);
                },
                "goBack": function() {
                    this.openFolder(this.folderStack.pop());
                }
            },
            template: ' \
<div class="w3-bar-block">\
    <div class="w3-bar-item w3-blue" href="javascript:void(0)">\
        <span v-on:click="goBack" style="cursor:pointer; max-width: 120px; overflow: hidden; display:inline-block; white-space: nowrap; text-overflow: ellipsis">\
            <i v-if="folderStack.length > 0" class="fa fa-chevron-left"></i>\
            {{folderStack.length > 0 ? folderStack[folderStack.length - 1].name : "Home"}}\
        </span>&nbsp;\
        <span class="w3-right" v-if="folderStack.length > 0" >\
            <span style="cursor:pointer" v-on:click="goHome"><i class="fa fa-home"></i></span>&nbsp;\
        </span>\
    </div>\
    <div v-for="folder in folders">\
        <list-item-folder v-bind:folder="folder" v-on:folder-clicked="subFolderSelected"></list-item-folder>\
    </div>\
    <div v-if="folders.length === 0"><i>No sub-folders</i></div>\
</div>'
        });
    });
});