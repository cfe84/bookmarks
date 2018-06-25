Vue.component("menu-folder", {
    props: ['currentFolder'],
    template: '\
    <div class="w3-bar w3-light-grey">\
        <div class="w3-blue w3-bar-item">\
        {{ currentFolder.name }}\
        </div>\
        <a class="w3-bar-item w3-button" v-on:click="$emit(\'add-bookmark-clicked\')"><i class="fa fa-bookmark"></i> Add bookmark</a>\
        <a class="w3-bar-item w3-button" v-on:click="$emit(\'add-folder-clicked\')"><i class="fa fa-folder"></i> Add folder</a>\
        <a class="w3-bar-item w3-button" v-on:click="$emit(\'refresh-clicked\')"><i class="fa fa-recycle"></i> Refresh</a>\
        <a class="w3-bar-item w3-button" v-on:click="$emit(\'delete-folder-clicked\')"><i class="fa fa-trash"></i> Delete folder</a>\
    </div>'
});