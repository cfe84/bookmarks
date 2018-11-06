import operations from "./operations";

window.register = () => {
    operations
        .postUser()
        .then(() => {
            const server = /^([^\/]+\/\/[^\/]+)\/.+$/.exec(window.location)[1];
            window.location = server;
        })
        .catch((error) => {
            document.getElementById("error").innerHTML = error;
        });
}