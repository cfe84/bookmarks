<template>
    <div id="modal" class="w3-modal" style="display: block">
        <div style="top: 0; left: calc(50% - 200px); position: fixed; max-width: 500px" class="w3-modal-content w3-card-4 w3-animate-top">
            <div style="margin:auto">
                <div class="w3-container w3-theme-d2">
                    <h3>Settings</h3>
                </div>
                <div class="w3-container w3-card-4 w3-white">
                    <h4 >Bookmarklet</h4>
                    <p>
                        Drag the bookmarklet to your bookmark bar: <a :href="bookmarkletContent">Add bookmark</a>
                    </p>
                    <h4>Import bookmarks</h4>
                    <p>
                        <a class="w3-bar-item w3-button" v-on:click="uploadBookmarksClicked"><i class="fa fa-upload"></i> Upload bookmarks</a>
                    </p>
                    <p>
                        <button class="w3-btn w3-padding w3-theme-d2" v-on:click="closeModal"><i class="fa fa-times"></i>&nbsp;Close</button>
                    </p>
                    
                    <h4>Connect another account</h4>
                    <p>
                        <a class="w3-bar-item w3-button" v-on:click="uploadBookmarksClicked"><i class="fa fa-upload"></i> Upload bookmarks</a>
                    </p>
                    <p>
                        <button class="w3-btn w3-padding w3-theme-d2" v-on:click="closeModal"><i class="fa fa-times"></i>&nbsp;Close</button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiOperations from "../operations";
import modalUploadBookmarks from "./modal-upload-bookmarks.vue";
import Vue from "../vue";
import attachToElement from "./attachToElement.js";


    const urlComponents = window.location.href.split("/")
        .filter((entry) => entry.length !== 0);
    const url = `${urlComponents[0]}//${urlComponents[1]}`;
    const bookmarkletContent = `javascript:(function() {
    function getMetaContent(tagname) { 
        const metas = document.getElementsByTagName('meta');
        for (var i=0; i<metas.length; i++) { 
            if (metas[i]["name"] === tagname) { 
                return metas[i]["content"]; 
            }
        } 
        return "";
    } 

    function getIcon() {
        const links = document.getElementsByTagName('meta'); 
        for (var i=0; i<links.length; i++) { 
            if (links[i]["rel"] === "icon" 
                || links[i]["rel"] === "shortcut icon") { 
                    return links[i]["href"]; 
                }
        } 
        return "";
    }

    function encodeBookmark(bookmark) {
        const res = Object.keys(bookmark)
            .map((key) => key + "=" + encodeURIComponent(bookmark[key]))
            .join("&");
        return res;
    }

    function loadBookmarkFields() {
        const bookmark = {
            name: document.title,
            href: document.location.href,
            description: getMetaContent("description"),
            tags: getMetaContent("keywords"),
            iconUrl: getIcon()
        };
        return bookmark;
    }

    function launchBM(bookmark) {
        const encodedBookmark = encodeBookmark(bookmark);
        const url = "${url}/add.html?action=add&" + encodedBookmark;
        window.open(url);
    }

    launchBM(loadBookmarkFields());
})()`;

export default {
    methods: {
        closeModal: function() { 
            this.$el.outerHTML = "";
            this.$destroy(); 
        },
        uploadBookmarksClicked: function() {
            const modal = new Vue(modalUploadBookmarks);
            modal.context = this.context;
            attachToElement(document.getElementById("confirmation"), modal);
        }
    },
    props: [
        "context"
    ],
    data: function() {
        return {
            bookmarkletContent
        };
    }
}
</script>
