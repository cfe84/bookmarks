<template>
    <div>
        <div class="w3-bar w3-blue" href="javascript:void(0)">
            <span class="w3-bar-item"
                v-on:click="goBack" 
                style="cursor:pointer; 
                       max-width: 120px;
                       overflow: hidden;
                       display:inline-block;
                       white-space: nowrap;
                       text-overflow: ellipsis">
                <i v-if="myContext.folderStack.length > 0" class="fa fa-chevron-left"></i>
                {{myContext.folderStack.length > 0 ? myContext.folderStack[myContext.folderStack.length - 1].name : "Home"}}
            </span>&nbsp;
            <span class="w3-right w3-bar-item">
                <span style="cursor:pointer" v-if="myContext.folderStack.length > 0" v-on:click="goHome"><i class="fa fa-home"></i></span>&nbsp;
                <span v-on:click="refresh" style="cursor:pointer"><i class="fa fa-recycle"></i></span>
            </span>
        </div>
        <div >
            <list-item-folder v-for="folder in myContext.folders" v-bind:key="folder.id" v-bind:folder="folder" v-on:folder-clicked="subFolderSelected"></list-item-folder>
        </div>
        <div v-if="myContext.folders.length === 0"><i>No sub-folders</i></div>
    </div>
</template>

<script>
    import listItemFolder from "./list-item-folder.vue";
    import apiOperations from "../operations"
    let rootFolder;

    const copyContext = (context) => { 
        return {
            currentFolder: context.currentFolder,
            folders: context.folders.slice(),
            folderStack: context.folderStack.slice()
        }}

    export default {
        data: function() {
            return {
                modalVisible: false,
                myContext: this.updateContext ? this.context : this.copyContext(this.context)
            };
        },
        props: {
            context: {
                required: false,
                default: () => {return {
                    currentFolder: {id: "", name: "Loading"},
                    folders: [],
                    folderStack: []
                }}
            },
            updateContext: {
                required: false,
                type: Boolean,
                default: true
            }
        },
        methods: {
            "subFolderSelected": function(folder) {
                this.myContext.folderStack.push(this.myContext.currentFolder);
                this.openFolder(folder);
            },
            "openFolder": function(folder) {
                apiOperations.getSubfolders(folder.id)
                .then((subFolders) => {
                    this.myContext.currentFolder = folder;
                    this.myContext.folders = subFolders;
                    this.$emit("folder-selected", folder);
                })
            },
            "goHome": function() {
                this.myContext.folderStack = [];
                this.openFolder(rootFolder);
            },
            "goBack": function() {
                this.openFolder(this.myContext.folderStack.pop());
            },
            "refresh": function() {
                this.openFolder(this.myContext.currentFolder);
            }
        },
        created: function () {
            apiOperations.getRootFolder()
                .then((folder) => {
                    rootFolder = folder;
                    this.openFolder(rootFolder);
                });
        },
        updated: function() {
            if (!this.updateContext) {
                this.myContext = copyContext(this.context);
            }
        },
        components: {
            listItemFolder
        }
    }
</script>

