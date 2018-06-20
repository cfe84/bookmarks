import { suite, test,  } from "mocha-typescript";
import should from "should";
import { FileStorageProvider, InMemoryFileProvider } from "../src/storage";
import { Folder, Bookmark } from "../src/models";
const uuid = require("uuid/v4");

@suite
class FileStorageProviderTest {
    private testFolderName: string = "Folder Name";
    private testDescription: string = "Description";


    @test("should save and open a sub-folder")
    async saveAndOpenFolder() {
        const provider = new FileStorageProvider(new InMemoryFileProvider());

        const userId = uuid();
        const folder = new Folder(this.testFolderName);
        folder.description = this.testDescription;
        folder.bookmarkIds = [uuid(), uuid()];
        folder.folderIds = [uuid(), uuid()];
        await provider.saveFolderAsync(userId, folder);
        const retrieved = await provider.getFolderAsync(userId, folder.id);
        should(retrieved.bookmarkIds).deepEqual(folder.bookmarkIds);
        should(retrieved.folderIds).deepEqual(folder.folderIds);
        should(retrieved.name).equal(this.testFolderName);
        should(retrieved.description).equal(this.testDescription);
    }

    @test("should save and open a bookmark")
    async saveAndOpenBookmark() {
        const provider = new FileStorageProvider(new InMemoryFileProvider());
        const userId = uuid();
        const folderId = uuid();
        const bookmark = new Bookmark(this.testFolderName, "href");
        bookmark.keyword = "Keyword";
        bookmark.tags = ["tag1", "tag2"];
        bookmark.description = this.testDescription;

        await provider.saveBookmarkAsync(userId, bookmark);
        const retrieved = await provider.getBookmarkAsync(userId, bookmark.id);
        should(retrieved.name).equal(bookmark.name);
        should(retrieved.href).equal(bookmark.href);
        should(retrieved.tags).deepEqual(bookmark.tags);
        should(retrieved.description).equal(this.testDescription);
    }

    @test("should save and list sub folders")
    async saveAndListFolders() {
        const provider = new FileStorageProvider(new InMemoryFileProvider());
        const userId = uuid();
        const folderId = uuid();
        const folder = new Folder(this.testFolderName);
        folder.folderIds = [uuid(), uuid()];
        
    }

    @test("should save and list bookmarks")
    async saveAndListBookmarks() {
        
        const userId = uuid();
        const folder = new Folder(this.testFolderName);
        const bookmark1 = new Bookmark("name 1", "href 1");
        const bookmark2 = new Bookmark("name 2", "bookmark 2");
        folder.bookmarkIds = [bookmark1.id, bookmark2.id];

        const provider = new FileStorageProvider(new InMemoryFileProvider());
        await provider.saveBookmarkAsync(userId, bookmark1);
        await provider.saveBookmarkAsync(userId, bookmark2);
        await provider.saveFolderAsync(userId, folder);

        const bookmarks = await provider.getBookmarksAsync(userId, folder.id);
        should(bookmarks).have.length(2);
        should(bookmarks[0]).deepEqual(bookmark1);
        should(bookmarks[1]).deepEqual(bookmark2);
    }

    @test("should delete bookmarks and not list them")
    async deleteBookmarks() {
        const provider = new FileStorageProvider(new InMemoryFileProvider());
        const userId = uuid();
        const folderId = uuid();
        const bookmark = new Bookmark(this.testFolderName, "href");

        await provider.saveBookmarkAsync(userId, bookmark);
        const retrieved = await provider.getBookmarkAsync(userId, bookmark.id);
        should(retrieved.name).equal(bookmark.name);
        await provider.deleteBookmarkAsync(userId, bookmark);
        should(provider.getBookmarkAsync(userId, bookmark.id))
            .be.rejectedWith("Bookmark not found");
    }

    @test("should delete and not list folder")
    async deleteFolders() {
        const provider = new FileStorageProvider(new InMemoryFileProvider());
        const userId = uuid();
        const folder = new Folder(this.testFolderName);
        await provider.saveFolderAsync(userId, folder);
        const retrieved = await provider.getFolderAsync(userId, folder.id);
        should(retrieved.name).equal(this.testFolderName);
        await provider.deleteFolderAsync(userId, folder);
        should(provider.getFolderAsync(userId, folder.id))
            .be.rejectedWith("Folder not found");
    }
}