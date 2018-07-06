import { suite, test,  } from "mocha-typescript";
import { ImportHtmlFileCommand } from "../src/backend/commands/ImportHtmlFileCommand";
import { FileStorageProvider, InMemoryFileProvider } from "../src/backend/storage";
import fs from "fs";
import path from "path";
import { BookmarkFile } from "../src/backend/storage/BookmarkFile";
import should from "should";
import { HtmlFileLexer, HtmlFileParser } from "../src/backend/parser/htmlFile";
import { BookmarkCollection } from "../src/backend/parser/BookmarkCollection";
import { Token } from "../src/backend/parser/htmlFile/Token";
import { Folder, Bookmark, Icon } from "../src/backend/models";


@suite
class ImportHtmlFileTest {
    @test("should parse the file awesomely")
    async readTheFile() {
        const fileContent: string = fs.readFileSync(path.join(__dirname, "htmlBookmarkFile.txt")).toString();
        const command = new ImportHtmlFileCommand("userid", "root", fileContent);
        const fileProvider = new InMemoryFileProvider();
        await fileProvider.saveBookmarkFileAsync("userid", new BookmarkFile(true));
        const storageProvider = new FileStorageProvider(fileProvider);
        await command.executeAsync({storageProvider});

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
        should(bookmarkFile.bookmarks[bookmark1Id].iconUrl).equal("https://uri.ico");
        should(bookmarkFile.bookmarks[bookmark1Id].iconId).not.be.empty();
        const icon: Icon = await storageProvider.getIconAsync("userid", 
            bookmarkFile.bookmarks[bookmark1Id].iconId);
        should(icon.content).equal("this is alpha");
        should(icon.contentType).equal("image/png");
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
        new Token("attribute", "15156>93643", "add_date"),
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
        <DT><H3 ADD_DATE="15156>93643" LAST_MODIFIED="1528412417" PERSONAL_TOOLBAR_FOLDER=\'true\'>Folder1</H3>\
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
        new Token("opening-markup", "hr"),
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
        new Token("attribute", "uri", "icon_uri"),
        new Token("attribute", "data:image/png;base64,dGhpcyBpcyBhbHBoYQ==", "icon"),
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

        const bookmarkCollection = parser.parse();

        const findFolder = (folderId: string): Folder => {
            const res = bookmarkCollection.folders.find((folder) => folder.id === folderId);
            should(res).not.be.undefined();
            if (!res) throw Error("Res should not be undefined");
            return res;
        }
        const findBookmark = (bookmarkId: string): Bookmark =>  {
            const res = bookmarkCollection.bookmarks.find((bookmark) => bookmark.id === bookmarkId);
            should(res).not.be.undefined();
            if (!res) throw Error("Res should not be undefined");
            return res;
        }

        should(bookmarkCollection.folders).have.length(2, "Incorrect number of folders");
        should(bookmarkCollection.bookmarks).have.length(3, "Incorrect number of bookmarks");
        should(bookmarkCollection.icons).have.length(1, "Incorrect number of icons");
        const icon = bookmarkCollection.icons[0];
        should(bookmarkCollection.rootFolder.bookmarkIds).have.length(1, "Incorrect number of bookmarks on root");
            const item3 = findBookmark(bookmarkCollection.rootFolder.bookmarkIds[0]);
            should(item3).not.be.undefined();
            should(item3.name).equal("item3");
            should(item3.href).equal("link3");
        should(bookmarkCollection.rootFolder.folderIds).have.length(1, "Incorrect number of folders on root");
            const folder1 = findFolder(bookmarkCollection.rootFolder.folderIds[0]);
            should(folder1.name).equal("Folder1");
            should(folder1.bookmarkIds).have.length(2, "Incorrect number of bookmarks in Folder1");
                const item1 = findBookmark(folder1.bookmarkIds[0]);
                should(item1.name).equal("item1");
                should(item1.description).equal("description is cool");
                should(item1.href).equal("link1");
                const item2 = findBookmark(folder1.bookmarkIds[1]);
                should(item2.name).equal("item2");
                should(item2.description).equal("");
                should(item2.iconUrl).equal("uri");
                should(item2.iconId).equal(icon.id);
                should(icon.content).equal("this is alpha");
                should(item2.href).equal("link2");
            should(folder1.folderIds).have.length(1, "Incorrect number of folders in Folder1");
                const folder2 = findFolder(folder1.folderIds[0]);
                should(folder2.name).equal("Folder2");
                should(folder2.folderIds).have.length(0, "Incorrect number of folders in Folder2");
                should(folder2.bookmarkIds).have.length(0, "Incorrect number of bookmarks in Folder2");
    }
}
