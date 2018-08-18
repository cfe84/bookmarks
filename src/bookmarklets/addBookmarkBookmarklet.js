(function() {
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
        const url = "http://localhost:8080/add.html?action=add&" + encodedBookmark;
        window.open(url);
    }

    launchBM(loadBookmarkFields());
})()