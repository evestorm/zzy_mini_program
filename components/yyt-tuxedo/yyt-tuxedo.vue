<!--作者:何文韬-->
<template>
	<view>
		<!-- ==========================================参团======================================= -->
		<view class="group-purchase" @tap="_onclick">
			<image class="icon" src="https://pic.cwyyt.cn/upload/yyticons/1736223622_通知@2x.png"></image>
			<swiper class="swipernotice" @change="changeAutoplay" vertical="true" autoplay="true" circular="true" :interval="interval"
			 duration="100">
				<swiper-item v-for="(item, key) in contentList"  :key="key">
					<block>
						<view class="noticeno">
							<block v-if="item.length>20&&key==current" >
								<view  :class="'notice'+ rollTime">
									<rich-text :nodes="item"></rich-text>
								</view>
							</block>
							<block v-else>
								<rich-text :nodes="item"></rich-text>
							</block>
						</view>

					</block>

				</swiper-item>
			</swiper>
			<!-- <view  class="swipernotice" v-for="(item, key) in contentList">  
			<rich-text :nodes="item"></rich-text>
			</view> -->

			<view class="image-content">
				<view class="image">
					<image v-for="(n, index) in orderPeopleImgList" :key="index" class="head-img" :src="n" mode=""></image>
				</view>
				<view class="ell">…</view>
			</view>
		</view>
	</view>
</template>

<script>
	export {
		default
	}
	from './yyt-tuxedo.js';
</script>

<style lang="less" scoped>
	@import url('yyt-tuxedo.less');
</style>
