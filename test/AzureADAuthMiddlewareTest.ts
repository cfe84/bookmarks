import { suite, test, skip,  } from "mocha-typescript";
import should from "should";
import { Mole, Times, It } from "moqjs";
import { AzureADAuthMiddleware } from "../src/backend/authentication/AzureADAuthMiddleware";
import { Container } from "../src/backend/Container";
import { InMemoryFileProvider, FileStorageProvider } from "../src/backend/storage";
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
    
    @test("should reject unauthenticated users")
    rejectUnauthenticatedUsers() {
        const req = {
            headers: {
            },
            user: undefined
        }

        const res = this.createNewRes();
        const resMole = new Mole(res);
        const next = function(){
            throw Error("Next should not have been called");
        };

        const fileProvider = new InMemoryFileProvider();
        const storageProvider = new FileStorageProvider(fileProvider);
        
        const authMiddleware = new AzureADAuthMiddleware(storageProvider);
        authMiddleware.authenticate(req, res, next);

        should(res.statusCode).equal(401, "should be unauthorized");
        should(req.user).be.undefined();
        resMole.verify(obj => obj.json(It.isAny(Error)), Times.atLeast(1));
        resMole.verify(obj => obj.end(), Times.exact(0));
    }

    @test("should extract username and id")
    acceptAuthenticatedUsers(next: any) {
        const req = {
            headers: {
                "x-ms-client-principal-name": "myName",
                "x-ms-client-principal-id": "myId",
            },
            user: {
                id: undefined,
                name: undefined,
                something: true
            }
        };

        const res = { statusCode: 0 };

        const fileProvider = new InMemoryFileProvider();
        const storageProvider = new FileStorageProvider(fileProvider);

        const userId = `${uuid()}`;
        storageProvider.setUserIdAsync("myId", userId)
        .then(() => {
            const authMiddleware = new AzureADAuthMiddleware(storageProvider);
            authMiddleware.authenticate(req, res, () => {
                should(res.statusCode).equal(0);
                should(req.user.something).be.undefined();
                should(req.user.id).equal(userId);        
                should(req.user.name).equal("myName");
                next();
            });
        })
    }

    
    @test("should reject users not found")
    rejectUserNotFound(next: any) {
        const req = {
            headers: {
                "x-ms-client-principal-name": "myName",
                "x-ms-client-principal-id": "myId",
            },
            user: {
                id: undefined,
                name: undefined,
                something: true
            }
        };

        const res = this.createNewRes();

        const fileProvider = new InMemoryFileProvider();
        const storageProvider = new FileStorageProvider(fileProvider);

        const authMiddleware = new AzureADAuthMiddleware(storageProvider);
        authMiddleware.authenticate(req, res, () => {
            should(res.statusCode).equal(403, "should be forbidden");
            next();
        });
    }
}