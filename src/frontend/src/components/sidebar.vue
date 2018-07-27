<template>
    <browser-folders v-bind:context="context" 
        v-on:folder-selected="folderSelected"></browser-folders>
</template>

<script>
    import browserFolders from "./browser-folders.vue";

    export default {
        methods: {
            folderSelected: function(folder) {
                this.$emit("open-folder", folder);
            }
        },
        props:["context"],
        components: {
            browserFolders
        }
    }
</script>
