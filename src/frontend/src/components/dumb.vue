<template>
<div>Blerp: {{toto}} {{something}}</div>
</template>
<script>
export default {
    props: [ "toto"],
    data: {
        "something": "aha"
    },
    mounted: function() {
        this.something = "dsfsf " + this.toto;
    }
}
</script>