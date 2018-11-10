import { suite, test, skip,  } from "mocha-typescript";
import should from "should";
import { AzureADAuthMiddleware } from "../src/backend/authentication/AzureADAuthMiddleware";
import { InMemoryFileProvider, FileUserStorageProvider } from "../src/backend/storage";
const uuid = require("uuid/v4");

@suite
class AzureADAuthMiddlewareTest {
    private createNewRes(): any {
        return {
            json: function(something: Error){},
            end: function() {},
            statusCode: 0
        };
    }
    
    @test("should ignore unauthenticated users")
    ignoreUnauthenticatedUsers(next: any) {
        const req = {
            headers: {
            },
            user: undefined,
            systemUser: undefined
        }

        const res = this.createNewRes();

        const fileProvider = new InMemoryFileProvider();
        const storageProvider = new FileUserStorageProvider(fileProvider);
        
        const authMiddleware = new AzureADAuthMiddleware(storageProvider);
        authMiddleware.authenticate(req, res, () => {
            should(req.user).be.undefined();
            should(req.systemUser).be.undefined();
            next();            
        });
    }

    @test("should extract username and id")
    acceptAuthenticatedUsers(next: any) {
        const req = {
            headers: {
                "x-ms-client-principal-name": "myName",
                "x-ms-client-principal-id": "myId",
                "x-ms-client-principal-idp": "aad",
            },
            user: {
                id: undefined,
                name: undefined,
                something: true,
            },
            systemUser: {
                id: undefined,
                name: undefined,
                identityProvider: undefined,
                something: true,
            }
        };

        const res = { statusCode: 0 };

        const fileProvider = new InMemoryFileProvider();
        const storageProvider = new FileUserStorageProvider(fileProvider);

        const userId = `${uuid()}`;
        storageProvider.setUserIdAsync("myId", userId)
        .then(() => {
            const authMiddleware = new AzureADAuthMiddleware(storageProvider);
            authMiddleware.authenticate(req, res, () => {
                should(res.statusCode).equal(0);
                should(req.user.something).be.undefined();
                should(req.user.id).equal(userId);        
                should(req.user.name).equal("myName");
                should(req.systemUser.id).equal("myId");
                should(req.systemUser.name).equal("myName");        
                should(req.systemUser.identityProvider).equal("aad");
                next();
            });
        })
    }

    
    @test("should reject users not found")
    rejectUserNotFound(next: any) {
        const req = {
            headers: {
                "x-ms-client-principal-name": "myName",
                "x-ms-client-principal-idp": "aad",
                "x-ms-client-principal-id": "myId",
            },
            user: null,
            systemUser: {
                id: null,
                name: null,
                identityProvider: null
            }
        };

        const res = this.createNewRes();

        const fileProvider = new InMemoryFileProvider();
        const storageProvider = new FileUserStorageProvider(fileProvider);

        const authMiddleware = new AzureADAuthMiddleware(storageProvider);
        authMiddleware.authenticate(req, res, () => {
            should(res.statusCode).equal(0);
            should(req.user).be.null();
            console.log(req.systemUser);

            should(req.systemUser.id).equal("myId");
            should(req.systemUser.name).equal("myName");        
            should(req.systemUser.identityProvider).equal("aad");
            next();
        });
    }


}