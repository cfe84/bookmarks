import { Token } from "./Token";

class HtmlFileLexer {
    private elementsRegexps: Array<{
        name: string, 
        regex: RegExp, 
        processing: (match: string[]) => Token[]
    }> = [
        {
            name: "opening-markup",
            regex: /<(?!\/)\s*([^ >]+)((?:\s+[^= ]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*>/m,
            processing: (match) => {
                const tokens = [new Token("opening-markup", match[1].toLowerCase())];
                const attributes = match[2];
                const attrRegex = /([^= ]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/mg
                let attrMatch;
                while(attrMatch = attrRegex.exec(attributes)) {
                    tokens.push(new Token("attribute", attrMatch[2] || attrMatch[3], attrMatch[1].toLowerCase()));
                }
                return tokens;
            }
        }, 
        {
            name: "closing-markup",
            regex: /<\/\s*([^>]+)\s*>/m,
            processing: (match) => [new Token("closing-markup", match[1].toLowerCase())]
        },
        {
            name: "comment",
            regex: /<!([^>]+)>/m,
            processing: (match) => []
        },
        {
            name: "text",
            regex: /\s*([^<]+)\s*/m,
            processing: (match) => [new Token("text", match[1].trim())]
        }
    ];
    
    private getTokens(element: string): Token[] {
        for(const tokenType of this.elementsRegexps) {
            const match = tokenType.regex.exec(element);
            if (match !== null && match.length > 1) {
                return tokenType.processing(match);
            }
        }
        throw new Error(`Unknown token: "${element}"`);
    }

    private isBlank(text:string): boolean {
        return text.trim().length === 0;
    }

    public GetTokens(content: string):Array<Token> {
        const elementRegex: RegExp = /<[^>]+>|[^<]+/gm;
        let tokens = new Array<Token>();
        let element: string[] | null;
        while(element = elementRegex.exec(content)){
            if (element === null || this.isBlank(element[0])) {
                continue;
            }
            tokens = tokens.concat(this.getTokens(element[0]));
        }
        return tokens;
    }
}

export {HtmlFileLexer};