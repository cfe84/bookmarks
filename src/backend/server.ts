import { App } from "./App";
const PORT: number = ((): number => {
    if (process.env["PORT"]) {
        return +process.env["PORT"];
    } else {
        console.warn("No PORT env variable defined, defaulting to 8080");
        return 8080;
    };
})();

const app: App = new App();
app.listen(PORT);