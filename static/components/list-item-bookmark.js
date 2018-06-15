Vue.component("list-item-bookmark", {
    props: ["bookmark"],
    template: '\
<li class="w3-bar" style="cursor:pointer" v-on:click="$emit(\'bookmark-clicked\', bookmark)">\
    <p>\
        <i class="fa fa-bookmark"></i>\
        {{bookmark.name}}\
        <i v-if="bookmark.description"> - {{bookmark.description}}</i>\
        <span v-for="tag in bookmark.tags"><span class="w3-tag w3-round w3-blue">{{tag}}</span>&nbsp;</span>\
        <br/>\
        <span class="w3-text-grey w3-tiny" style="text-overflow: ellipsis">{{bookmark.href}}</span>\
    </p>\
</li>'
})