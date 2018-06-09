import {JsonController, Param, Body, Get, Post, Put, Delete, HeaderParam} from "routing-controllers";
import { Container } from "../Container";

@JsonController()
class BookmarksController {
    constructor(private container: Container) {

    }
    
    @Get("/bookmarks")
    getAll(@HeaderParam("userid") userid: string) {
        ;
    }
}

export { BookmarksController }