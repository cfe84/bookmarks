<template>
    <div>
        <div id="div-title" class="w3-bar w3-theme-d2">
            <div class="w3-bar-item w3-left w3-half w3-xlarge"><i class="fa fa-bookmark"></i> Bookmarks</div>
        </div>
        <div class="options">
            <div class="option">
                <h1>Login</h1>

                <a class="login-option w3-button" href=".auth/login/microsoftaccount">
                    <i class="fab fa-microsoft"></i>
                    Microsoft
                </a>
                <a class="login-option w3-button" href=".auth/login/aad">
                    <i class="fab fa-microsoft"></i>
                    Work
                </a>
            </div>

            <div class="option">
                <h1>Register</h1>
            </div>

                <a class="login-option w3-button" href=".auth/login/microsoft">
                    <i class="fab fa-microsoft"></i>
                    Microsoft
                </a>
                <a class="login-option w3-button" href=".auth/login/aad">
                    <i class="fab fa-microsoft"></i>
                    Work
                </a>
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
