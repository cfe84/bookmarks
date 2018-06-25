<template>
    <a class="w3-bar-item w3-button" v-on:click="folderClicked">
        <i class="fa fa-folder"></i> {{folder.name}}
    </a>
</template>

<script>
export default {
    props: ["folder"],
    methods: {
        folderClicked: function() {
            this.$emit('folder-clicked', this.folder);
        }
    },
}
</script>
