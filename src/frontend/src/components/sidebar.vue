<template>
    <div class="w3-sidebar w3-bar-block" style="width:200px" id="div-sidebar">
        <browser-folders v-on:folder-selected="folderSelected"></browser-folders>
    </div>
</template>

<script>
    import browserFolders from "./browser-folders.vue";

    export default {
        methods: {
            folderSelected: function(folder) {
                this.$emit("open-folder", folder);
            }
        },
        components: {
            browserFolders
        }
    }
</script>
