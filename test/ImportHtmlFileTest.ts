import { suite, test,  } from "mocha-typescript";
import { ImportHtmlFileCommand } from "../src/backend/commands/ImportHtmlFileCommand";
import { FileStorageProvider, InMemoryFileProvider } from "../src/backend/storage";
import fs from "fs";
import path from "path";
import { BookmarkFile } from "../src/backend/storage/BookmarkFile";
import should from "should";
import { HtmlFileLexer } from "../src/backend/parser/htmlFile/HtmlFileLexer";
import { HtmlFileParser } from "../src/backend/parser/htmlFile/HtmlFileParser";
import { Token } from "../src/backend/parser/htmlFile/Token";


@suite
class ImportHtmlFileTest {
    @test("should parse the file awesomely")
    async readTheFile() {
        const fileContent: string = fs.readFileSync(path.join(__dirname, "htmlBookmarkFile.txt")).toString();
        const command = new ImportHtmlFileCommand("userid", "root", fileContent);
        const fileProvider = new InMemoryFileProvider();
        fileProvider.saveBookmarkFileAsync("userid", new BookmarkFile(true));
        command.executeAsync({storageProvider: new FileStorageProvider(fileProvider)});

        const bookmarkFile: BookmarkFile = await fileProvider.getBookmarkFileAsync("userid");
        should(bookmarkFile.bookmarks).have.length(5);
        should(bookmarkFile.folders).have.length(5);
        
        // First level
        should(bookmarkFile.folders.root.folderIds).have.length(1);
        const folder1Id = bookmarkFile.folders.root.folderIds[0];
        should(bookmarkFile.folders[folder1Id].name).equal("Folder1");
        should(bookmarkFile.folders[folder1Id].description).be.empty();
        should(bookmarkFile.folders[folder1Id].folderIds).have.length(2);
        should(bookmarkFile.folders[folder1Id].bookmarkIds).have.length(0);

        should(bookmarkFile.folders.root.bookmarkIds).have.length(1);
        const bookmark1Id = bookmarkFile.folders.root.bookmarkIds[0];
        should(bookmarkFile.bookmarks[bookmark1Id].name).equal("Item1");
        should(bookmarkFile.bookmarks[bookmark1Id].description).equal("Description 1");
        should(bookmarkFile.bookmarks[bookmark1Id].href).equal("link5");
        should(bookmarkFile.bookmarks[bookmark1Id].keyword).equal("shortcuturl");
        should(bookmarkFile.bookmarks[bookmark1Id].tags).have.length(2);
        should(bookmarkFile.bookmarks[bookmark1Id].tags).containEql("tag1,tag2");
    }

    tokens: Array<Token> = [
        new Token("opening-markup", "title"),
        new Token("text", "Bookmarks"),
        new Token("closing-markup", "title"),
        new Token("opening-markup", "h1"),
        new Token("text", "text on \n \tmultiple lines"),
        new Token("closing-markup", "h1"),
        new Token("opening-markup", "dl"),
        new Token("opening-markup", "p"),
        new Token("opening-markup", "dt"),
        new Token("opening-markup", "h3"),
        new Token("attribute", "1515693643", "add_date"),
        new Token("attribute", "1528412417", "last_modified"),
        new Token("attribute", "true", "personal_toolbar_folder"),
        new Token("text", "Folder1"),
        new Token("closing-markup", "h3"),
    ]

    @test("should lex correctly")
    lexerShouldWork() {
        const lexer = new HtmlFileLexer();

        const tokens = lexer.GetTokens('<TITLE>Bookmarks</TITLE>\
        <H1>   text on \n \tmultiple lines</H1>\
        <DL><p>\
        <DT><H3 ADD_DATE="1515693643" LAST_MODIFIED="1528412417" PERSONAL_TOOLBAR_FOLDER=\'true\'>Folder1</H3>');
        should(tokens).deepEqual(this.tokens);
    }

    @test("should parse correctly")
    parserShouldWork() {
        const parser = new HtmlFileParser();

        const bookmarkFile = parser.parse(this.tokens);

    }
}
