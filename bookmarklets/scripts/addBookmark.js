function addBookmark_onLoad() {
    const title = window.document.title;
    const url = window.location.href;

    document.getElementById("bookmark-txt-title").value = title;
    document.getElementById("bookmark-txt-url").value = url;
    document.getElementById("bookmark-btn-addBookmark").onclick = () => {
        alert("Adding!");
    }
    document.getElementById("bookmark-btn-closemodal").onclick = () => {
        const div = document.getElementById("bookmark-div-injected");
        div.parentNode.removeChild(div);
    }
}

addBookmark_onLoad();