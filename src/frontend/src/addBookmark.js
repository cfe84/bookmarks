function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getBookmark() {
    const bookmarkFields = [
        'name',
        'href',
        'description',
        'keyword',
        'tags',
        'iconUrl'
    ];
    const bookmark = {};
    for(const field of bookmarkFields) {
        bookmark[field] = getParameterByName(field);
    }
    return bookmark;
}

function getBookmarkFromParameters() {
    const isAdd = getParameterByName('action') === 'add';
    if (!isAdd) {
        return null;
    }
    const bookmark = getBookmark();
    if (bookmark.tags) {
        bookmark.tags = bookmark.tags
            .split(",")
            .map((tag) => tag.trim()); // This is hacky.
    }
    return bookmark;
}

export default getBookmarkFromParameters;