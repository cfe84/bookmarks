getEncodedValue = (fieldId) => encodeURIComponent(document.getElementById(fieldId).value);

saveBookmark = () => {
    const name = getEncodedValue("bookmark-name");
    const href = getEncodedValue("bookmark-href");
    const url = `http://localhost:8080/?action=addBookmark&name=${name}&href=${href}`;
    window.open(url);
};

loadBookmarkFields = () => {
    const name = document.title;
    const href = document.location.href;
    document.getElementById("bookmark-name").value = name;
    document.getElementById("bookmark-href").value = href;
}
