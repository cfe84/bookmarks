<template>
    <div id="div-title" class="w3-bar w3-theme-d2">
        <div class="w3-bar-item w3-left w3-half w3-xlarge"><i class="fa fa-bookmark"></i> Bookmarks</div>
        <div class="w3-bar-item w3-right w3-half"><span class="w3-button" v-on:click="openSettings"><i class="fa fa-cog"></i></span>  | <i class="fa fa-user"></i> <span>{{context.user.name}}</span></div>
        
    </div>
</template>

<script>
    import modalSettings from "./modal-settings.vue";
    import Vue from "../vue";
    import attachToElement from "./attachToElement.js";

    export default {
        data: function() {
            return {
            }
        },
        props: ['context'],
        methods: {
            openSettings: function() {
                const modal = new Vue(modalSettings);
                modal.context = this.context;
                attachToElement(document.getElementById("confirmation"), modal);
            }
        }
    }
</script>