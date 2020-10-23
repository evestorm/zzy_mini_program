<!-- 于大明 -->

<template>
    <view class="page-box">
       <yyt-store-item :item="item" v-for="(item,index) in storeItems" :key="index" :latitude="latitude" :longitude="longitude" />
    </view>
</template>

<script>
    export { default } from './shopList.js';
</script>

<style lang="less" scoped>
    @import url('shopList.less');
</style>
