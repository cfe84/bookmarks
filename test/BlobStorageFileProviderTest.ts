import { suite, test, skip,  } from "mocha-typescript";
import { AzureBlobStorageFileProvider, IFileProvider, Asset } from "../src/backend/storage";
import fs from "fs";
const uuid = require("uuid/v4");
import { BookmarkFile } from "../src/backend/storage/BookmarkFile";
import should from "should";
import { Bookmark, Folder } from "../src/backend/models";

@suite
class BlobStorageFileProviderTest {
    private STORAGE_CONNECTION_STRING: string | undefined = process.env["STORAGE_CONNECTION_STRING"];

    private createFileProvider(): IFileProvider {
        return new AzureBlobStorageFileProvider(this.STORAGE_CONNECTION_STRING || "")
    }

    before() {
        if (!this.STORAGE_CONNECTION_STRING) {
            throw Error("STORAGE_CONNECTION_STRING is not set - ignoring Azure Storage tests");
        }
    }

    @test("should open a file it just saved")
    async saveThenOpen() {
        const id = uuid();
        const fileProvider = this.createFileProvider();
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
        const fileProvider = this.createFileProvider();
        const readFile = await fileProvider.getBookmarkFileAsync(id);
        should(readFile).be.deepEqual(bookmarkFile);
    }

    @test("should overwrite existing file")
    async overwriteExistingFile() {
        const id = uuid();
        const fileProvider = this.createFileProvider();
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

    @test("should write and read asset file")
    async writeAssetFile() {
        const id = uuid();
        const fileProvider = this.createFileProvider();
        const assetFile = new Asset(uuid(), "dsfksorkgo", "application/x-something");
        await fileProvider.saveAssetAsync(id, assetFile);
        const readFile = await fileProvider.getAssetAsync(id, assetFile.id);
        should(readFile).be.deepEqual(assetFile);
    }
}