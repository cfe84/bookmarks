const atob = require("atob");
const btoa = require("btoa");

class Asset {
    private _contentBase64: string = "";
    constructor(
        public id: string = "", 
        content: any = "", 
        public contentType: string = "") {
            if (content) {
                this.content = content;
            }
        }
    
    get content(): any {
        console.log(`Get: ${this._contentBase64}`);
        return atob(this._contentBase64);
    }
    
    set content(content: any) {
        this._contentBase64 = btoa(content);
        console.log(`Set: ${content}: ${this._contentBase64}`);

    }
}

export { Asset }