import { BookmarkFile } from "../../storage/BookmarkFile";
import { Token } from "./Token";
import { Folder, Bookmark } from "../../models";

class HtmlFileParser {
    private TOKEN_NAMES = {
        TEXT: "text",
        OPENING_MARKUP: "opening-markup",
        CLOSING_MARKUP: "closing-markup",
        ATTRIBUTE: "attribute"
    }

    private TOKEN_VALUES = {
        TITLE: "title",
        H1: "h1",
        H3: "h3",
        DD: "dd",
        DT: "dt",
        DL: "dl",
        A: "a",
        P: "p",
    }

    private ATTRIBUTE_NAMES = {
        SHORTCUTURL: "shortcuturl",
        TAGS: "tags",
        HREF: "href"
    }

    private tokens: Array<Token>;

    constructor(tokens: Array<Token>) {
        this.tokens = tokens.slice();
    }

    private log(str: string) {
        console.log(str);
    }

    private bookmarkFile = new BookmarkFile(true);

    private parseMeta(tokens: Array<Token>) {
        // do nothing
    }

    private isToken(index: number, name: string, value: string | null = null, shift: boolean = false): boolean | Token {
        const res = this.tokens.length > index 
            && this.tokens[index].name === name && 
               (value === null || this.tokens[index].value === value);
        if (shift && index > 0) {
            throw Error("Shifting non-0 index");
        }
        if (shift && res) {
            return this.shiftNextToken();
        } else {
            return res;
        }
    }

    private nextIsFolder(shift: boolean = false) {
        return this.isToken(0, this.TOKEN_NAMES.OPENING_MARKUP, this.TOKEN_VALUES.DT, shift)
            && this.isToken(shift ? 0 : 1, this.TOKEN_NAMES.OPENING_MARKUP, this.TOKEN_VALUES.H3, shift);
    }

    private nextIsFolderHeaderClosing(shift: boolean = false) {
        return this.isToken(0, this.TOKEN_NAMES.CLOSING_MARKUP, this.TOKEN_VALUES.H3, shift);
    }
    
    private nextIsBookmark(shift: boolean = false) {
        return this.isToken(0, this.TOKEN_NAMES.OPENING_MARKUP, this.TOKEN_VALUES.DT, shift)
            && this.isToken(shift ? 0 : 1, this.TOKEN_NAMES.OPENING_MARKUP, this.TOKEN_VALUES.A, shift);
    }

    private nextIsBookmarkHeaderClosing(shift: boolean = false) {
        return this.isToken(0, this.TOKEN_NAMES.CLOSING_MARKUP, this.TOKEN_VALUES.A, shift);
    }

    private nextIsAttribute(shift: boolean = false) {
        const res = this.tokens.length > 0 
            && this.tokens[0].name === this.TOKEN_NAMES.ATTRIBUTE;
        if (shift && res) {
            return this.shiftNextToken();
        } else {
            return res;
        }
    }

    private nextIsText(shift: boolean = false) {
        return this.isToken(0, this.TOKEN_NAMES.TEXT, null, shift);
    }

    private nextIsDescription(shift: boolean = false) {
        return this.isToken(0, this.TOKEN_NAMES.OPENING_MARKUP, this.TOKEN_VALUES.DD, shift);
    }
    private nextIsDescriptionClosing(shift: boolean = false) {
        return this.isToken(0, this.TOKEN_NAMES.CLOSING_MARKUP, this.TOKEN_VALUES.DD, shift);
    }

    private nextIsList(shift: boolean = false) {
        return this.isToken(0, this.TOKEN_NAMES.OPENING_MARKUP, this.TOKEN_VALUES.DL, shift);
    }
    private nextIsListClosing(shift: boolean = false) {
        return this.isToken(0, this.TOKEN_NAMES.CLOSING_MARKUP, this.TOKEN_VALUES.DL, shift);
    }

    private throwUnexpectedToken() {
        const token = this.shiftNextToken();
        throw Error(`Unexpected token: ${token.name} ${token.value}`);
    }

    private shiftNextToken(): Token {
        const next = this.tokens.shift();
        if (next) {
            return next;
        } else {
            throw Error("Unexpected end of file");
        }
    }

    private parseFolder(): Folder {
        if (!this.nextIsFolder(true)) { throw Error("Not a folder"); }
        this.log("Found a folder");
        const folder = new Folder();
        this.bookmarkFile.folders[folder.id] = folder;
        while (this.nextIsAttribute()) {
            const token = this.shiftNextToken();
            this.log(`  Ignoring attribute: ${token.name} ${token.subType}`);
        }
        if (this.nextIsText()) {
            folder.name = this.shiftNextToken().value;
            this.log(`  Name: ${folder.name}`);
        } 
        if (!this.nextIsFolderHeaderClosing(true)) {
            this.throwUnexpectedToken();
        }
        if (this.nextIsDescription(true)) {
            if (this.nextIsText()) {
                folder.description = this.shiftNextToken().value;
                this.log(`  Description: ${folder.name}`);
            }
        }
        if (this.nextIsList()) {
            this.parseList(folder);
        }
        return folder;
    }

    private parseBookmark(): Bookmark {
        if (!this.nextIsBookmark(true)) { throw Error("Not a bookmark"); }
        this.log("Found a bookmark");
        const bookmark = new Bookmark();
        this.bookmarkFile.bookmarks[bookmark.id] = bookmark;
        while(this.nextIsAttribute()) {
            const attribute: Token = this.shiftNextToken();
            switch(attribute.subType) {
                case this.ATTRIBUTE_NAMES.HREF:
                    bookmark.href = attribute.value;
                    this.log(`  href: ${bookmark.href}`);
                    break;
                case this.ATTRIBUTE_NAMES.SHORTCUTURL:
                    bookmark.keyword = attribute.value;
                    this.log(`  keyword: ${bookmark.keyword}`);
                    break;
                case this.ATTRIBUTE_NAMES.TAGS:
                    bookmark.tags = attribute.value.split(/,/g);
                    this.log(`  tags: ${bookmark.tags}`);
                    break;
                default: 
                    this.log(`  ignored attribute ${attribute.subType}`);
                    break;
            }
        }
        if (this.nextIsText()) {
            bookmark.name = this.shiftNextToken().value;
            this.log(`  name: ${bookmark.name}`);
        } 
        if (!this.nextIsBookmarkHeaderClosing(true)) {
            this.throwUnexpectedToken();
        }
        if (this.nextIsDescription(true)) {
            if (this.nextIsText()) {
                bookmark.description = this.shiftNextToken().value;
                this.log(`  description: ${bookmark.description}`);
            }
        }
        return bookmark;
    }

    private parseList(folder: Folder) {
        if (!this.nextIsList(true)) {
            throw this.throwUnexpectedToken();
        }
        this.log(`Found a list`);
        while(!this.nextIsListClosing(true)) {
            if (this.nextIsFolder()) {
                const subFolder = this.parseFolder();
                folder.folderIds.push(subFolder.id);
                continue;
            }
            if (this.nextIsBookmark()) {
                const bookmark = this.parseBookmark();
                folder.bookmarkIds.push(bookmark.id);
                continue;
            }
            this.throwUnexpectedToken();
        }
    } 

    private removeAllPs() {
        this.tokens = this.tokens.filter(
            (token) => token.name !== this.TOKEN_NAMES.OPENING_MARKUP ||
                token.value !== this.TOKEN_VALUES.P
        )
    }

    private skipToList() {
        while(this.tokens.length > 0 && !this.nextIsList()) {
            this.log(`Skipping token ${this.shiftNextToken().name}`);
        }
        if (this.tokens.length === 0) {
            throw(Error("No bookmarks found."));
        }
    }

    public parse(): BookmarkFile {
        if (this.tokens.length ===  0) {
            throw Error("No token found");
        }
        this.removeAllPs();
        this.skipToList();
        this.parseList(this.bookmarkFile.folders['root']);
        if (this.tokens.length > 0) {
            this.throwUnexpectedToken();
        }
        return this.bookmarkFile;
    }
}

export { HtmlFileParser }