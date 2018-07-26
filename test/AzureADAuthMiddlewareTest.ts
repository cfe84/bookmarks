import { suite, test, skip,  } from "mocha-typescript";
import should from "should";
import { Mole, Times, It } from "moqjs";
import { AzureADAuthMiddleware } from "../src/backend/authentication/AzureADAuthMiddleware";

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

        const authMiddleware = new AzureADAuthMiddleware();
        authMiddleware.authenticate(req, res, next);

        should(res.statusCode).equal(401, "should be unauthorized");
        should(req.user).be.undefined();
        resMole.verify(obj => obj.json(It.isAny(Error)), Times.atLeast(1));
        resMole.verify(obj => obj.end(), Times.exact(0));
    }

    @test("should extract username and id")
    acceptAuthenticatedUsers() {
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
        let nextCalled = 0;
        const next = function(){
            nextCalled++;
        }

        const authMiddleware = new AzureADAuthMiddleware();
        authMiddleware.authenticate(req, res, next);

        should(res.statusCode).equal(0);
        should(nextCalled).equal(1);
        should(req.user.something).be.undefined();
        should(req.user.id).equal("myId");        
        should(req.user.name).equal("myName");
    }
}