const atob = require("atob");
const btoa = require("btoa");

class Asset {
    private _contentBase64: string = "";
    constructor(
        public id: string = "", 
        content: any = null, 
        public contentType: string = "") {
            if (content) {
                this._contentBase64 = btoa(content);
            }
        }
    
    public loadFromBase64(base64Content: string) {
        this._contentBase64 = base64Content;
    }

    get content(): any {
        return atob(this._contentBase64);
    }
    
    set content(content: any) {
        if (!!content) {
            throw Error("Empty content");
        }
        this._contentBase64 = btoa(content);
    }
}

export { Asset }