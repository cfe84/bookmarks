import operations from "./operations";

window.register = () => {
    operations
        .postUser()
        .then(() => {
            const serverRoot = /^([^\/]+\/\/[^\/]+)\/.+$/.exec(window.location)[1];
            window.location = serverRoot;
        })
        .catch((error) => {
            document.getElementById("error").innerHTML = error;
        });
}