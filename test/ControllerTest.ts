import { suite, test } from "mocha-typescript";
import { mapRoute } from "../src/backend/controllers/utils/mapRoute";
import { should} from "should";
import { Router } from "express";
import { AuthenticatedUser } from "../src/backend/models";

@suite
class ControllerTest {
    
    private createReq = (): any => {
        return {
            headers: [],
            parameters: {},
            queryParameters: {},
            body: null,
            user: null
        }
    }

    private createRes = (): any => {
        const res = {
            statusCode: 0,
            jsonSaved: null,
            json: function(obj: any) { this.jsonSaved = obj},
            end: function() { res.endCalled = true },
            endCalled: false
        };
    
        return res;
    }

    @test("should catch errors")
    public mapRouteCatchesErrors(done: any) {
        const funcAsync = async () => { throw Error("error")};
        const routeAsync = mapRoute(funcAsync);
        const req = this.createReq();
        req.user = new AuthenticatedUser("dkfjs", "dlfksdfls");
        const res = this.createRes();
        routeAsync(req, res)
            .then(() => {
                res.statusCode.should.be.eql(500);
                res.endCalled.should.be.true();
                done();
            });
    }

    @test("should just invoke func")
    public mapRouteWorks(done: any) {
        const validReq = this.createReq();
        const validRes = this.createRes();
        validReq.user = new AuthenticatedUser("dkfjs", "dlfksdfls");

        const funcAsync = async (req: any, res: any) => {
            // req.should.equal(validReq);
            // res.should.equal(validRes);
            return "123"
        }
        const route = mapRoute(funcAsync);
        route( validReq , validRes)
            .then(() => {
                validRes.statusCode.should.equal(0);
                validRes.jsonSaved.should.equal("123");
                validRes.endCalled.should.be.true();
                done();
            })
    }

    @test("should reject unauthorized requests")
    public rejectUnauthorizedRequests(done: any) {
        const funcAsync = async () => { };
        const routeAsync = mapRoute(funcAsync);
        const req = this.createReq();
        const res = this.createRes();
        routeAsync(req, res)
            .then(() => {
                res.statusCode.should.be.eql(401);
                res.endCalled.should.be.true();
                done();
            });
    }
}