<template>
    <div class="w3-bar w3-light-grey">
        <div class="w3-blue w3-bar-item">
        {{ context.currentFolder.name }}
        </div>
        <a class="w3-bar-item w3-button" v-on:click="$emit('add-bookmark-clicked')"><i class="fa fa-bookmark"></i> Add bookmark</a>
        <a class="w3-bar-item w3-button" v-on:click="$emit('add-folder-clicked')"><i class="fa fa-folder"></i> Add folder</a>
        <a class="w3-bar-item w3-button" v-on:click="$emit('refresh-clicked')"><i class="fa fa-recycle"></i> Refresh</a>
        <a class="w3-bar-item w3-button" v-bind:style="`display: ${editFolderVisibility}`" v-on:click="$emit('edit-folder-clicked')"><i class="fa fa-edit"></i> Edit folder</a>
        <a class="w3-bar-item w3-button" v-on:click="$emit('delete-folder-clicked')"><i class="fa fa-trash"></i> Delete folder</a>
    </div>
</template>

<script>
export default {
    props: ['context'],
    computed: {
        editFolderVisibility: function() { return this.context.folderStack.length > 0 ? "block" : "none"}
    }
}
</script>
