<template>
    <li class="w3-bar" 
        style="cursor:pointer" 
        :title="bookmark.href"
        v-on:click="bookmarkClicked">
        <img v-if="bookmark.iconUrl" class="icon" :src="bookmark.iconUrl"/>
        <span v-if="!bookmark.iconUrl" class="icon"><i class="fa fa-bookmark"></i></span>
        {{bookmark.name}}
        <span v-for="tag in bookmark.tags" v-bind:key="tag"><span class="w3-tag w3-round w3-blue">{{tag}}</span>&nbsp;</span>
        <span class="w3-right w3-button"><i class="fa fa-trash"></i></span>
        <span class="w3-right w3-button"><i class="fa fa-edit"></i></span>
        <br/>
        <span v-if="bookmark.description" class="w3-text-grey w3-tiny" style="text-overflow: ellipsis">{{bookmark.description}}</span>
    </li>
</template>

<script>
    function launchBookmark(href) {
        window.open(href);
    }

    export default {
        props: ["bookmark"],
        methods: {
            bookmarkClicked: function() { launchBookmark(this.bookmark.href) }
        }
    }
</script>

<style lang="css" scoped>

    .icon {
        width: 23px;
        text-align: center;
        display: inline-block;
    }

</style>