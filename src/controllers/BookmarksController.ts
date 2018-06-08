import {JsonController, Param, Body, Get, Post, Put, Delete, HeaderParam} from "routing-controllers";

@JsonController()
class BookmarksController {
    
    @Get("/bookmarks")
    getAll(@HeaderParam("token") token: string) {
        return `The token is ${token}`;
    }
}

export { BookmarksController }