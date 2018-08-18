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
        <span class="w3-right w3-button" v-on:click="updateBookmarkClicked"><i class="fa fa-edit"></i></span>
        <br/>
        <span v-if="bookmark.description" class="w3-text-grey w3-tiny" style="text-overflow: ellipsis">{{bookmark.description}}</span>
    </li>
</template>

<script>
    import Vue from "../vue";
    import confirmationDialog from "./modal-confirmation-dialog.js";
    import modalAddBookmark from "./modal-add-bookmark.vue";
    import attachToElement from "./attachToElement";

    export default {
        props: ["bookmark", "context"],
        methods: {
            bookmarkClicked: function() { 
                window.open(this.bookmark.href);
            },
            deleteBookmarkClicked: function() { 
                confirmationDialog(
                    `Do you want to delete ${this.bookmark.name}`, 
                    "Delete bookmark",
                    "Delete", 
                    "Cancel")
                .then((res) => alert(res));
            },
            updateBookmarkClicked: function() {
                const modal = new Vue(modalAddBookmark);
                modal.context = this.context;
                modal.bookmark = this.bookmark;
                attachToElement(document.getElementById("confirmation"), modal);
            }
        },
        components: {
            modalAddBookmark
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