import { Container } from "../Container";

interface ICommand<T> {
    executeAsync(container: Container): Promise<T>;
}

export {ICommand};