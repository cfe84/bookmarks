import { suite, test,  } from "mocha-typescript";
import { InMemoryFileProvider, IFileProvider } from "../src/backend/storage";
const uuid = require("uuid/v4");
import { BookmarkFile } from "../src/backend/storage/BookmarkFile";
import should from "should";
import { Bookmark, Folder } from "../src/backend/models";

@suite
class DeleteSubfolderCommandTest {
    @test("should remove subfolder")
    removeSubfolder() {
    }

    @test("should fail when not a subfolder")
    failOnNotASubfolder() {

    }
}