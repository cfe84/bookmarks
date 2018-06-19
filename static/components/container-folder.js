Vue.component("container-folder", {
    props: ['currentFolder', 'bookmarks'],
    methods: {
        showAddBookmarkModal: function() { this.addBookmarkVisible = true; },
        closeAddBookmarkModal: function() { this.addBookmarkVisible = false; },
    },
    data: function () {
        return {
            addBookmarkVisible: false
        }
    },
    computed: {
        addBookmarkModalDisplay: function() {
            return this.addBookmarkVisible ? 'block' : 'none'
        }
    },
    template: 
    '\
<div>\
    <modal-add-bookmark\
        v-bind:style="{display: addBookmarkModalDisplay}"\
        v-on:close-add-bookmark-modal-clicked="closeAddBookmarkModal"\
    ></modal-add-bookmark>\
    <menu-folder\
        v-bind:current-folder="currentFolder"\
        v-on:add-bookmark-clicked="showAddBookmarkModal"\
    ></menu-folder>\
    <div class="w3-padding"></div>\
    <ul class="w3-ul w3-hoverable">\
        <list-item-bookmark\
            v-for="bookmark in bookmarks"\
            v-bind:bookmark="bookmark"\
            v-bind:key="bookmark.id"\
        ></list-item-bookmark>\
    </ul>\
</div>'
});