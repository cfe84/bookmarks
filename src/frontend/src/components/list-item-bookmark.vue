<template>
    <li class="w3-bar" style="cursor:pointer" v-on:click="bookmarkClicked">
        <p>
            <i class="fa fa-bookmark"></i>
            {{bookmark.name}}
            <i v-if="bookmark.description"> - {{bookmark.description}}</i>
            <span v-for="tag in bookmark.tags"><span class="w3-tag w3-round w3-blue">{{tag}}</span>&nbsp;</span>
            <span class="w3-right w3-button"><i class="fa fa-trash"></i></span>
            <span class="w3-right w3-button"><i class="fa fa-edit"></i></span>
            <br/>
            <span class="w3-text-grey w3-tiny" style="text-overflow: ellipsis">{{bookmark.href}}</span>
        </p>
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
