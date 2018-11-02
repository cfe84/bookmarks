import { suite, test,  } from "mocha-typescript";
import { JsonSerializer } from "../src/backend/storage";
import should from "should";
import { Bookmark, Folder } from "../src/backend/models";
import { BookmarkFile } from "../src/backend/storage/FileBasedStorage/BookmarkFile";
const uuid = require("uuid/v4");

@suite
class JsonSerializerTest {
    @test("should deserialize a serialized string")
    bijection(){
        const serializer = new JsonSerializer()
        const id = uuid();
        const bookmarkFile = new BookmarkFile(true);
        const bookmark = new Bookmark();
        const folder = new Folder();
        bookmarkFile.bookmarks[bookmark.id] = bookmark;
        bookmarkFile.folders[folder.id] = folder;        
        const serialized = serializer.Serialize(bookmarkFile);
        const deserialized = serializer.Deserialize(serialized);

        should(deserialized).deepEqual(bookmarkFile);
    }    
}