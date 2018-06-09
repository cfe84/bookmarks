import { Container } from "../Container";

interface ICommand {
    execute(container: Container): void;
}