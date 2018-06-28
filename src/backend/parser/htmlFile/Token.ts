class Token {
    constructor(
        public name: string, 
        public value: string,
        public subType: string = ""){}
}

export {Token}