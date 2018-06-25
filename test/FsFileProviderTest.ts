import { suite, test,  } from "mocha-typescript";
import { FsFileProvider } from "../src/backend/storage";
import fs from "fs";
const uuid = require("uuid/v4");
import { BookmarkFile } from "../src/backend/storage/BookmarkFile";
import should from "should";
import { Bookmark, Folder } from "../src/backend/models";

@suite
class FsFileProviderTest {
    private testFolder: string = "./testData";

    public before() {
        if (!fs.existsSync(this.testFolder)) {
            fs.mkdirSync(this.testFolder);
        }
    }

    @test("should open a file it just saved")
    async saveThenOpen() {
        const id = uuid();
        const fileProvider = new FsFileProvider(this.testFolder);
        const bookmarkFile = new BookmarkFile(true);
        const bookmark = new Bookmark();
        const folder = new Folder();
        bookmarkFile.bookmarks[bookmark.id] = bookmark;
        bookmarkFile.folders[folder.id] = folder;
        await fileProvider.saveBookmarkFileAsync(id, bookmarkFile);
        const readFile = await fileProvider.getBookmarkFileAsync(id);
        should(readFile).be.deepEqual(bookmarkFile);
    }

    @test("should open empty file when it doesn't exist")
    async openNotExist() {
        const bookmarkFile = new BookmarkFile(true);
        const id = uuid();
        const fileProvider = new FsFileProvider(this.testFolder);
        const readFile = await fileProvider.getBookmarkFileAsync(id);
        should(readFile).be.deepEqual(bookmarkFile);
    }

    @test("should overwrite existing file")
    async overwriteExistingFile() {
        const id = uuid();
        const fileProvider = new FsFileProvider(this.testFolder);
        const bookmarkFile = new BookmarkFile(true);
        const bookmark = new Bookmark();
        const folder = new Folder();
        bookmarkFile.bookmarks[bookmark.id] = bookmark;
        bookmarkFile.folders[folder.id] = folder;
        await fileProvider.saveBookmarkFileAsync(id, new BookmarkFile());
        await fileProvider.saveBookmarkFileAsync(id, bookmarkFile);
        const readFile = await fileProvider.getBookmarkFileAsync(id);
        should(readFile).be.deepEqual(bookmarkFile);
    }
}