import { BookmarkFile } from "../../storage/BookmarkFile";
import { Token } from "./Token";

class HtmlFileParser {
    public parse(tokens: Array<Token>): BookmarkFile {
        return new BookmarkFile();
    }
}

export { HtmlFileParser }