Vue.component("modal-add-bookmark", {
    template: '        \
<div id="modal" class="w3-modal">\
    <div class="w3-modal-content w3-card-4">\
        <div>\
            <div class="w3-bar w3-theme-d2">\
                    <div class="w3-bar-item w3-left w3-half w3-xlarge" id="txt-modal-subject">Fair Delight</div>\
                    <div class="w3-bar-item w3-right w3-half"><span class="w3-button w3-xlarge w3-right w3-hover-red" id="btn-closemodal"><i class="fa fa-window-close"></i></span></div>\
                </div>\
            <div class="w3-white w3-padding">\
                <div id="txt-modal-content">\
                    <div class="w3-padding"></div>\
                    <div class="w3-margin-top">\
                        <div style="max-width:800px; margin:auto">\
                            <div class="w3-container w3-theme-d2">\
                                <h3>Search</h3>\
                            </div>\
                            <div class="w3-container w3-card-4 w3-white">\
                                <p>\
                                    <label class="w3-text-grey">Keywords</label>\
                                    <input type="text" id="txt-keywords" class="w3-input"/>\
                                </p>\
                                <p>\
                                    <button id="btn-search" class="w3-btn w3-padding w3-theme-d2">Search&nbsp; &nbsp; &nbsp; <i class="fa fa-search"></i></button>\
                                </p>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>\
</div>'
})