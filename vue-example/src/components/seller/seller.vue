<template>
  <div class="seller" ref="sellerWrapper">
    <div class="seller_content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <v-star :size="36" :score="seller.score"></v-star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2 class="text">起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="text">商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="text">平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':isFavorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <v-split></v-split>
      <div class="bulletin-wrapper">
        <h1 class="title">公告与活动</h1>
        <p class="text border-1px">{{seller.bulletin}}</p>
        <ul class="supports-wrapper">
          <li class="supports-item border-1px" v-for="(supportItem,index) in seller.supports" :key="index">
            <v-iconClassMap :iconType="supportItem.type"></v-iconClassMap>
            <span class="description">{{supportItem.description}}</span>
          </li>
        </ul>
      </div>
      <v-split></v-split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picsWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(picItem,index) in seller.pics" :key="index">
              <img class="pic" width="120" height="90" :src="picItem">
            </li>
          </ul>
        </div>
      </div>
      <v-split></v-split>
      <div class="infos-wrapper">
        <h1 class="title border-1px">商家信息</h1>
        <ul class="infos-list">
          <li class="infos-item  border-1px" v-for="(item, index) in seller.infos" :key="index">
            <span class="text">{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';
  import split from 'components/split/split';
  import iconClassMap from 'components/iconClassMap/iconClassMap';
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from 'common/js/store.js';

  export default{
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      'v-star': star,
      'v-split': split,
      'v-iconClassMap': iconClassMap
    },
    data() {
      return {
        isFavorite: (() => {
          return loadFromLocal(this.seller.id, 'isFavorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.isFavorite ? '已收藏' : '收藏';
      }
    },
    watch: {
      'seller'() { // 监控props里面的seller数据变化
        this.$nextTick(() => {
          this._initScroll();
          this._initPicScroll();
        });
      }
    },
    mounted() { // DOM已经准备好,只会执行一次，此页面刷新后，就没有this.seller了
      this.$nextTick(() => {
        this._initScroll();
        this._initPicScroll();
      });
    },
    methods: {
      _initScroll() { // 初始化
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.sellerWrapper, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPicScroll() {
        if (this.seller.pics) { // 商家实景左右滚动
          let picW = 120;
          let margin = 6;
          let width = (picW + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picsWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical',
                click: true
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      },
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.isFavorite = !this.isFavorite;
        // 将状态缓存到localstorage
        saveToLocal(this.seller.id, 'isFavorite', this.isFavorite);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .desc
        padding-bottom: 18px
        line-height: 18px
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        .star
          display: inline-block
          vertical-align: top
          height: 18px
          margin-right: 8px
        .text
          display: inline-block
          vertical-align: top
          margin-right: 12px
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          text-align: center
          &:last-child
            border-right: none
          .text
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            font-weight: 200
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite
        position: absolute
        top: 18px
        right: 16px
        width: 40px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          &.active
            color: rgb(240, 20, 20)
        .text
          display: block
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)
    .bulletin-wrapper
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        padding: 0 12px 16px 12px
        line-height: 24px
        font-size: 12px
        font-weight: 200
        color: rgb(240, 20, 20)
        border-1px(rgba(7, 17, 27, 0.1))
      .supports-item
        padding: 16px 12px
        line-height: 16px
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        .icon
          display: inline-block
          vertical-align: top
          margin-right: 6px
          width: 16px
          height: 16px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .description
          display: inline-block
          vertical-align: top
          font-size: 12px
          font-weight: 200
          color: rbg(7, 17, 27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            &:last-child
              margin: 0
    .infos-wrapper
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        font-size: 14px
        border-1px(rgba(7, 17, 27, 0.1))
      .infos-item
        padding: 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .text
          line-height: 16px
          font-size: 12px
          font-weight: 200
</style>
