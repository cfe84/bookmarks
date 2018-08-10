<template>
    <a class="folder w3-bar-item" v-on:click="folderClicked">
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

<style lang="css" scoped>
    .folder {
        display: block;
        text-align: left;
        cursor: pointer;
        padding: 8px 16px;
    }

    .folder:hover {
        background-color: #ccc;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2), 0px 6px 20px 0px rgba(0,0,0,0.19);
    }

</style>