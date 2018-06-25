import { Container } from "../Container";

interface ICommand {
    executeAsync(container: Container): Promise<void>;
}

export {ICommand};