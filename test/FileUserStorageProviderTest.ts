import { suite, test, skip,  } from "mocha-typescript";
import { InMemoryFileProvider } from "../src/backend/storage";
import { FileUserStorageProvider } from "../src/backend/storage/FileBasedStorage/FileUserStorageProvider";
import should from "should";

const uuid = require("uuid/v4");

@suite
class FileUserStorageProviderTest {

    
    @test("should retrieve saved userid")
    async saveUserId() {
        // prepare
        const userId = `${uuid()}`;
        const systemUserId = `${uuid()}`;

        const provider = new InMemoryFileProvider();
        const storage = new FileUserStorageProvider(provider);
        
        // execute
        await storage.setUserIdAsync(systemUserId, userId);
        const newStorage = new FileUserStorageProvider(provider);
        const retrievedId = await newStorage.getUserIdAsync(systemUserId);

        // test
        should(retrievedId).equal(userId);
    }

}