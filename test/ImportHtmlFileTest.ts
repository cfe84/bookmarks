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
        await fileProvider.saveBookmarkFileAsync("userid", new BookmarkFile(true));
        await command.executeAsync({storageProvider: new FileStorageProvider(fileProvider)});

        const bookmarkFile: BookmarkFile = await fileProvider.getBookmarkFileAsync("userid");
        should(Object.keys(bookmarkFile.bookmarks)).have.length(5);
        should(Object.keys(bookmarkFile.folders)).have.length(6);
        
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
        should(bookmarkFile.bookmarks[bookmark1Id].description).equal("Description 1\nLine 2");
        should(bookmarkFile.bookmarks[bookmark1Id].href).equal("link5");
        should(bookmarkFile.bookmarks[bookmark1Id].keyword).equal("shortcuturl");
        should(bookmarkFile.bookmarks[bookmark1Id].tags).have.length(2);
        should(bookmarkFile.bookmarks[bookmark1Id].tags).containDeep(["tag1","tag2"]);
    }

    tokens_lexer: Array<Token> = [
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
        new Token("opening-markup", "dd"),
        new Token("text", "Yo this is a description\n        on multiple lines"),
        new Token("opening-markup", "dl"),
    ]

    @test("should lex correctly")
    lexerShouldWork() {
        const lexer = new HtmlFileLexer();

        const tokens = lexer.GetTokens('<!DOCTYPE NETSCAPE-Bookmark-file-1>\n\
        <TITLE>Bookmarks</TITLE>\n\
        <H1>   text on \n \tmultiple lines</H1>\
        <DL><p>\n\
        <DT><H3 ADD_DATE="1515693643" LAST_MODIFIED="1528412417" PERSONAL_TOOLBAR_FOLDER=\'true\'>Folder1</H3>\
        <DD>Yo this is a description\n\
        on multiple lines\n\
        <DL>');
        should(tokens).deepEqual(this.tokens_lexer);
    }

    tokens_parser: Array<Token> = [
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
        new Token("text", "Folder1"),
        new Token("closing-markup", "h3"),
        new Token("opening-markup", "dl"),
        new Token("opening-markup", "dt"),
        new Token("opening-markup", "a"),
        new Token("attribute", "link1", "href"),
        new Token("attribute", "112313123123", "add_date"),
        new Token("text", "item1"),
        new Token("closing-markup", "a"),
        new Token("opening-markup", "dd"),
        new Token("text", "description is cool"),
        new Token("opening-markup", "dt"),
        new Token("opening-markup", "a"),
        new Token("attribute", "link2", "href"),
        new Token("attribute", "112313123123", "add_date"),
        new Token("text", "item2"),
        new Token("closing-markup", "a"),        
        new Token("opening-markup", "dt"),
        new Token("opening-markup", "h3"),
        new Token("attribute", "1515693643", "add_date"),
        new Token("text", "Folder2"),
        new Token("closing-markup", "h3"),
        new Token("opening-markup", "dl"),
        new Token("closing-markup", "dl"),
        new Token("closing-markup", "dl"),
        new Token("opening-markup", "dt"),
        new Token("opening-markup", "a"),
        new Token("attribute", "link3", "href"),
        new Token("attribute", "112313123123", "add_date"),
        new Token("text", "item3"),
        new Token("closing-markup", "a"),
        new Token("closing-markup", "dl"),

    ]


    @test("should parse correctly")
    parserShouldWork() {
        const parser = new HtmlFileParser(this.tokens_parser);

        const bookmarkFile = parser.parse();

        should(Object.keys(bookmarkFile.folders)).have.length(3, "Incorrect number of folders");
        should(Object.keys(bookmarkFile.bookmarks)).have.length(3, "Incorrect number of bookmarks");
        should(bookmarkFile.folders["root"].bookmarkIds).have.length(1, "Incorrect number of bookmarks on root");
            const item3 =bookmarkFile.folders["root"].bookmarkIds[0];
            should(bookmarkFile.bookmarks[item3].name).equal("item3");
            should(bookmarkFile.bookmarks[item3].href).equal("link3");
        should(bookmarkFile.folders["root"].folderIds).have.length(1, "Incorrect number of folders on root");
            const folder1 = bookmarkFile.folders["root"].folderIds[0];
            should(bookmarkFile.folders[folder1].name).equal("Folder1");
            should(bookmarkFile.folders[folder1].bookmarkIds).have.length(2, "Incorrect number of bookmarks in Folder1");
                const item1 = bookmarkFile.folders[folder1].bookmarkIds[0];
                should(bookmarkFile.bookmarks[item1].name).equal("item1");
                should(bookmarkFile.bookmarks[item1].description).equal("description is cool");
                should(bookmarkFile.bookmarks[item1].href).equal("link1");
                const item2 = bookmarkFile.folders[folder1].bookmarkIds[1];
                should(bookmarkFile.bookmarks[item2].name).equal("item2");
                should(bookmarkFile.bookmarks[item2].description).equal("");
                should(bookmarkFile.bookmarks[item2].href).equal("link2");
            should(bookmarkFile.folders[folder1].folderIds).have.length(1, "Incorrect number of folders in Folder1");
                const folder2 = bookmarkFile.folders[folder1].folderIds[0];
                should(bookmarkFile.folders[folder2].name).equal("Folder2");
                should(bookmarkFile.folders[folder2].folderIds).have.length(0, "Incorrect number of folders in Folder2");
                should(bookmarkFile.folders[folder2].bookmarkIds).have.length(0, "Incorrect number of bookmarks in Folder2");
    }
}
