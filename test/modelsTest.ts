import should from "should";
import {Bookmark} from "../src/models/Bookmark";

declare var describe: any, it: any;

describe("Models", () => {
    it("should have bookmark data", () => {
        const testName = "dsfsdf";
        const testHref = "sdfksg";
        const testKeyword = "adf2efrgre";
        const testTag1 = "f2rveg";
        const testTag2 = "sgk9rv3v";
        const testDescription = "dsfge3gtbe";
        const bookmark  = new Bookmark(testName, testHref);
        bookmark.description = testDescription;
        bookmark.keyword = testKeyword;
        bookmark.tags.push(testTag1);
        bookmark.tags.push(testTag2);

        should(bookmark.name).equal(testName);
        should(bookmark.tags).have.length(2);
        should(bookmark.tags).containEql(testTag1);
        should(bookmark.tags).containEql(testTag2);
        should(bookmark.description).equal(testDescription);
    });
})