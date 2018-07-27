<template>
    <div class="grid-container">
    <div class="Header">
        <body-header v-bind:context="context"></body-header>
    </div>
    <div class="Footer">
        <body-footer></body-footer>
    </div>
    <div class="Sidebar">
        <sidebar 
            v-on:open-folder="folderClicked"
            v-bind:context="context"
        ></sidebar>
    </div>
    <div class="Content">
        <container-folder 
            v-bind:context="context"
        ></container-folder>
    </div>
    </div>
</template>

<script>
import bodyHeader from "./body-header.vue";
import bodyFooter from "./body-footer.vue";
import sidebar from "./sidebar.vue";
import containerFolder from "./container-folder.vue";
import apiOperations from "../operations";

export default {
    props: ['context'],
    components: {
        bodyHeader,
        bodyFooter,
        sidebar,
        containerFolder
    },
    methods: {
        folderClicked: function(folder) {
            apiOperations.getBookmarks(folder.id)
                .then(bookmarks => this.context.bookmarks = bookmarks);
        }
    },
}
</script>


<style scoped>
    .grid-container {
    display: grid;
    height: 100%;
    grid-template-columns: 400px auto;
    grid-template-rows: 50px auto 39px;
    grid-template-areas: "Header Header" "Sidebar Content" "Footer Footer";
    }

    .Header { grid-area: Header; }

    .Footer { grid-area: Footer; }

    .Sidebar { grid-area: Sidebar; }

    .Content { grid-area: Content; }
</style>
