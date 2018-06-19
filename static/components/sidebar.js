Vue.component("sidebar", {
    props: ['folderStack', 'currentFolder', 'folders'],
    data: function(){
        return {}
    },
    template: '\
<div class="w3-sidebar w3-bar-block" style="width:200px" id="div-sidebar">\
    <div class="w3-bar-block">\
        <div class="w3-bar-item w3-blue" href="javascript:void(0)">\
        <span v-on:click="$emit(\'previous-folder-clicked\')" style="cursor:pointer; max-width: 120px; overflow: hidden; display:inline-block; white-space: nowrap; text-overflow: ellipsis">\
            <i v-if="folderStack.length > 0" class="fa fa-chevron-left"></i>\
            {{folderStack.length > 0 ? folderStack[folderStack.length - 1].name : "-"}}\
        </span>&nbsp;\
        <span class="w3-right" v-if="folderStack.length > 0" >\
            <span style="cursor:pointer" v-on:click="$emit(\'home-clicked\')"><i class="fa fa-home"></i></span>&nbsp;\
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