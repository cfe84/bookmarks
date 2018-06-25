<template>
    <div id="div-title" class="w3-bar w3-theme-d2">
        <div class="w3-bar-item w3-left w3-half w3-xlarge"><i class="fa fa-bookmark"></i> Bookmarks</div>
        <div class="w3-bar-item w3-right w3-half"><i class="fa fa-user"></i> <span>{{username}}</span></div>
    </div>
</template>

<script>
    module.exports = {
        props: ['username']
    }
</script>