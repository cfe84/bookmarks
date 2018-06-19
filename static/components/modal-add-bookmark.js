Vue.component("modal-add-bookmark", {
    methods: {
        closeModal: function() { this.$emit('close-add-bookmark-modal-clicked'); },
        saveBookmark: function() { alert('saving'); this.closeModal(); },
    },
    template: '        \
<div id="modal" class="w3-modal">\
    <div style="top: 0; left: calc(50% - 200px); position: fixed; max-width: 400px" class="w3-modal-content w3-card-4 w3-animate-top">\
        <div style="margin:auto">\
            <div class="w3-container w3-theme-d2">\
                <h3>Add bookmark</h3>\
            </div>\
            <div class="w3-container w3-card-4 w3-white">\
                <p>\
                    <label class="w3-text-grey">HREF</label>\
                    <input type="text" class="w3-input"/>\
                </p>\
                <p>\
                    <label class="w3-text-grey">Name</label>\
                    <input type="text" class="w3-input"/>\
                </p>\
                <p>\
                    <label class="w3-text-grey">Folder</label>\
                    <select class="w3-select">\
                        \
                    </select>\
                </p>\
                <p>\
                    <label class="w3-text-grey">Description</label>\
                    <input type="text" class="w3-input"/>\
                </p>\
                <p>\
                    <label class="w3-text-grey">Shortcut</label>\
                    <input type="text" class="w3-input"/>\
                </p>\
                <p>\
                    <label class="w3-text-grey">Keywords (Separated by comma)</label>\
                    <input type="text" class="w3-input"/>\
                </p>\
                <p>\
                    <button class="w3-btn w3-padding w3-theme-d2" v-on:click="saveBookmark"><i class="fa fa-save"></i>&nbsp;Save</button>\
                    <button class="w3-btn w3-padding w3-theme-d2" v-on:click="closeModal"><i class="fa fa-times"></i>&nbsp;Close</button>\
                </p>\
            </div>\
        </div>\
    </div>\
</div>'
})