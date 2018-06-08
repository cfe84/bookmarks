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
        
        await provider.saveSerializedBookmarkCollectionAsync(userId, content);
        const retrievedContent = await provider.getSerializedBookmarkCollectionAsync(userId);

        should(retrievedContent).equal(content);
    }
}