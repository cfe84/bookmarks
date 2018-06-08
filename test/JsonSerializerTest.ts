import { suite, test, slow, timeout } from "mocha-typescript";
import should from "should";
import { BookmarkCollection } from "../src/models/BookmarkCollection";
import { Bookmark } from "../src/models/Bookmark";
import { Folder } from "../src/models/Folder";
import { JsonBookmarkCollectionSerializer } from "../src/serialization/JsonBookmarkCollectionSerializer";

@suite
class JsonSerializerTest {
    @test("should serialize and deserialize into the same object")
    serializeAndDeserializeCorrectly() {
        const collection: BookmarkCollection = new BookmarkCollection("default");
        const bookmark1: Bookmark = new Bookmark("tedsfdkj", "http://sdfsfs.sdfsdf");
        const folder1: Folder = new Folder("folder1");
        const bookmark1_1: Bookmark = new Bookmark("sdflsdkg", "dslfksf");
        bookmark1_1.keyword = "sdfksdfs";
        const bookmark1_2: Bookmark = new Bookmark("sdflskge", " slfgjdfkgjf");
        folder1.bookmarks.push(bookmark1_1);
        folder1.bookmarks.push(bookmark1_2);
        collection.bookmarks.push(bookmark1);
        collection.folders.push(folder1);

        const serializer = new JsonBookmarkCollectionSerializer();
        const serializedCollection: string = serializer.serialize(collection);
        const deserializedCollection = serializer.deserialize(serializedCollection);

        should(deserializedCollection).be.deepEqual(collection);
    }
}