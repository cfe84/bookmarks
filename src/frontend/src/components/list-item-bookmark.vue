<template>
    <li class="line w3-bar">
        <span
            class="bookmark"
            :title="bookmark.href"
            v-on:click="bookmarkClicked">
            <img v-if="bookmark.iconUrl" class="icon" :src="bookmark.iconUrl"/>
            <span v-if="!bookmark.iconUrl" class="icon"><i class="fa fa-bookmark"></i></span>
            {{bookmark.name}}
            <span v-for="tag in bookmark.tags" v-bind:key="tag"><span class="w3-tag w3-round w3-blue">{{tag}}</span>&nbsp;</span>
        </span>
        <span class="w3-right w3-button" v-on:click="deleteBookmarkClicked"><i class="fa fa-trash"></i></span>
        <span class="w3-right w3-button"><i class="fa fa-edit"></i></span>
        <br/>
        <span v-if="bookmark.description" class="w3-text-grey w3-tiny" style="text-overflow: ellipsis">{{bookmark.description}}</span>
    </li>
</template>

<script>
    const confirmationDialog = require("./modal-confirmation-dialog");

    export default {
        props: ["bookmark"],
        methods: {
            bookmarkClicked: function() { 
                window.open(this.bookmark.href);
            },
            deleteBookmarkClicked: function() { 
                confirmationDialog(
                    `Do you want to delete`, 
                    "Delete bookmark",
                    "Delete", 
                    "Cancel")
                .then((res) => alert(res));
            }
        }
    }
</script>

<style lang="css" scoped>

    .icon {
        width: 23px;
        text-align: center;
        display: inline-block;
    }

    .bookmark {
        cursor: pointer;        
    }

    .line {
        display: block;
        text-align: left;
        padding: 8px 16px;
    }

    .line:hover {
        background-color: #ddd;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2), 0px 6px 20px 0px rgba(0,0,0,0.19);
    }

</style>