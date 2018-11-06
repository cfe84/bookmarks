<template>
    <div>
        <div id="div-title" class="w3-bar w3-theme-d2">
            <div class="w3-bar-item w3-left w3-half w3-xlarge"><i class="fa fa-bookmark"></i> Bookmarks</div>
        </div>
        <div class="options">
            <div class="option">
                <h1>Login</h1>

                <a class="login-option w3-button" href=".auth/login/microsoftaccount?post_login_redirect_uri=/">
                    <i class="fab fa-microsoft"></i>
                    Microsoft
                </a>
                <a class="login-option w3-button" href=".auth/login/aad?post_login_redirect_uri=/">
                    <i class="fab fa-microsoft"></i>
                    Work
                </a>
            </div>

            <div class="option">
                <h1>Register</h1>
                You will be able to add another option to log-in later.
                <a class="login-option w3-button" href=".auth/login/microsoft?post_login_redirect_uri=/register">
                    <i class="fab fa-microsoft"></i>
                    Microsoft
                </a>
                <a class="login-option w3-button" href=".auth/login/aad?post_login_redirect_uri=/register">
                    <i class="fab fa-microsoft"></i>
                    Work
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["context"]
}
</script>

<style scoped>
    h1 {
        font-size: 1.2em;
        color: #0b78d1;
        font-weight: bold;
    }

    .options {
        max-width: 600px;
        margin:auto;
    }

    .option {
        border: 1pt solid #ccc;
        margin: 10px;
        padding: 20px;
    }

    .login-option {
        border: 1pt solid #ccc;
        width: 120px;
    }
</style>
