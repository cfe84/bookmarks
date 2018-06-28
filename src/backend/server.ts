import { App } from "./App";
const PORT: string = ((): string => {
    const portEnvVariable = process.env["PORT"];
    if (portEnvVariable !== undefined) {
        return portEnvVariable;
    } else {
        console.warn("No PORT env variable defined, defaulting to 8080");
        return "8080";
    };
})();

const app: App = new App();
app.listen(PORT);