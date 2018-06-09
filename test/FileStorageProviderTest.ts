import { suite, test, slow, timeout } from "mocha-typescript";
import should from "should";
import { FileStorageProvider } from "../src/storage/FileStorageProvider";
const uuid = require("uuid/v4");

@suite
class FileStorageProviderTest {
    @test("should open the file it just saved")
    async saveAndOpen() {
        const content: string = "sfldgkdfkhewlfkmd";
        const provider = new FileStorageProvider("./testdata/");
        const userId = uuid();
        const collectionId = uuid();
        
        await provider.saveSerializedBookmarkCollectionAsync(userId, collectionId, content);
        const retrievedContent = await provider.getSerializedBookmarkCollectionAsync(userId, collectionId);

        should(retrievedContent).equal(content);
    }

    @test("should list collection ids in user")
    async getCollectionIds() {
        const userId = uuid();
        const collectionIds: string[] = [uuid(), uuid(), uuid()];
        const provider = new FileStorageProvider("./testdata/");
        for(const collectionId in collectionIds) {
            await provider.saveSerializedBookmarkCollectionAsync(userId, collectionId, "sdfgkgoe");        
        }
        const retrievedIds = await provider.getBookmarkCollectionIdListAsync(userId);
        should(retrievedIds).have.length(collectionIds.length);
        for(const collectionId in collectionIds) {
            should(retrievedIds).containEql(collectionId);
        }
    }
}