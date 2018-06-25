import Vue from "../vue";

const modalConfirmationDialogComponent = Vue.component("modal-confirmation-dialog", {
    props: {
        "yes": {
            required: false,
            default: "Yes",
            type: String
        }, 
        "no": {
            required: false,
            default: "No",
            type: String
        },
        "title": {
            required: false,
            default: "Title",
            type: String
        },
        "message": {
            required: false,
            default: "Are you sure?",
            type: String
        }
    },
    template: '        \
<div id="modal" class="w3-modal" style="display: block">\
    <div style="top: 0; left: calc(50% - 200px); position: fixed; max-width: 400px" class="w3-modal-content w3-card-4 w3-animate-top">\
        <div style="margin:auto">\
            <div class="w3-container w3-theme-d2">\
                <h3>{{title}}</h3>\
            </div>\
            <div class="w3-container w3-card-4 w3-white">\
                <p>\
                    {{message}}\
                </p>\
                <p>\
                    <button class="w3-btn w3-padding w3-theme-d2" v-on:click="$emit(\'yes-clicked\')"><i class="fa fa-check"></i>&nbsp;{{yes}}</button>\
                    <button class="w3-btn w3-padding w3-theme-d2" v-on:click="$emit(\'no-clicked\')"><i class="fa fa-times"></i>&nbsp;{{no}}</button>\
                </p>\
            </div>\
        </div>\
    </div>\
</div>'
});

export default function confirmationDialog(
    message = "Are you sure", 
    title = "Confirmation", 
    yes = "Yes", 
    no = "No", 
    attachTo = "confirmation") {
    return new Promise((resolve, reject) => {
        const attachment = document.getElementById(attachTo);
        const element = document.createElement("div");
        element.id = "skldfsldfksf023oirofkrk";
        attachment.appendChild(element);
        const modal = new Vue(modalConfirmationDialogComponent);
        modal.message = message;
        modal.title = title;
        modal.yes = yes;
        modal.no = no;
        modal.$on("yes-clicked", function () {
            modal.$destroy();
            attachment.innerHTML = "";
            resolve(true);
        });
        modal.$on("no-clicked", () => {
            modal.$destroy();
            attachment.innerHTML = "";
            resolve(false);
        });
        modal.$mount(`#${element.id}`);
    });
}