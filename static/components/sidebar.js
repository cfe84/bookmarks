Vue.component("sidebar", {
    props: ['folderStack', 'currentFolder', 'folders'],
    data: function(){
        return {}
    },
    template: '\
<div class="w3-sidebar w3-bar-block" style="width:200px" id="div-sidebar">\
    <div class="w3-bar-block">\
        <div class="w3-bar-item w3-blue" href="javascript:void(0)">\
            {{currentFolder.name}}\
            <span class="w3-right">\
                <span style="cursor:pointer" v-on:click="$emit(\'home-clicked\')"><i class="fa fa-home"></i></span>&nbsp;\
                <span style="cursor:pointer" v-if="folderStack.length > 1" v-on:click="$emit(\'previous-folder-clicked\')"><i class="fa fa-chevron-left"></i></span>\
            </span>\
        </div>\
        <div v-for="folder in folders">\
            <a class="w3-bar-item w3-button" v-on:click="$emit(\'open-folder\', folder)">\
                {{folder.name}}\
            </a>\
        </div>\
    </div>\
</div>'
})