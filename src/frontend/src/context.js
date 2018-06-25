export default function createContext() {
    return {
        currentFolder: {id: null, name: ""},
        parentFolder: null,
        folderStack: [],
        bookmarks: [],
        folders: []
    }
}