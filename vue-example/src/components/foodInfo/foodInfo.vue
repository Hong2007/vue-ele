<template>
  <transition name="move">
    <div class="foodInfo" v-show="showFlag" ref="foodInfo">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartControl-wrapper">
            <v-cartControl :foodItem="food"></v-cartControl>
          </div>
          <transition name="fade">
            <div @click="addFirst($event)" class="addCartControl" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <v-split v-show="food.info"></v-split>
        <div class="info" v-show="food.info">
          <div class="title">商品介绍</div>
          <p class="text">{{food.info}}</p>
        </div>
        <v-split></v-split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <v-ratingSelect :select-type="selectType" :only-content="onlyContent" :desc="desc"
                           :ratings="food.ratings" @selectRatings="filterRatings"
                           @isContent="isContent"></v-ratingSelect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(ratingItem.rateType,ratingItem.text)" class="ratings-item border-1px"
                  v-for="(ratingItem, index) in food.ratings" :key="index">
                <div class="user">
                  <span class="name">{{ratingItem.username}}</span>
                  <img class="avatar" width="12" height="12" :src="ratingItem.avatar">
                </div>
                <div class="time">{{ratingItem.rateTime | formatDate('yyyy-MM-dd hh:mm')}}</div>
                <p class="text">
                  <i class="icon"
                     :class="{'icon-thumb_up':ratingItem.rateType===0,'icon-thumb_down':ratingItem.rateType===1}"></i>{{ratingItem.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import 'common/js/formatDate.js';
  import cartControl from 'components/cartControl/cartControl';
  import split from 'components/split/split';
  import ratingSelect from 'components/ratingSelect/RatingSelect';

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true, // 只看有内容的评论
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      initShow() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodInfo, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) { // 添加商品到购物车
        if (!event._constructed) {
          return;
        }
        Vue.set(this.food, 'count', 1);
        this.$root.eventHub.$emit('cart.add', event.target);
      },
      filterRatings(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      isContent(onlyContent) {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      }
    },
    components: {
      'v-cartControl': cartControl,
      'v-split': split,
      'v-ratingSelect': ratingSelect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .foodInfo
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 15
    width: 100%
    background: #fff
    transition: all 0.2s linear
    transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    .food-content
      bottom: 48px
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .back
          position: absolute
          top: 10px
          left: 0
          .icon-arrow_lift
            display: block
            padding: 10px
            font-size: 20px
            color: #fff
      .content
        position: relative
        padding: 18px
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          font-size: 0
          .sell-count, .rating
            font-size: 10px
            color: rgb(147, 153, 159)
          sell-count
            margin-right: 12px
        .price
          line-height: 24px
          font-weight: 700
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
        .cartControl-wrapper
          position: absolute
          right: 12px
          bottom: 12px
        .addCartControl
          position: absolute
          right: 12px
          bottom: 19px
          z-index: 10
          line-height: 24px
          padding: 0 12px
          box-sizing: border-box
          border-radius: 12px
          font-size: 10px
          color: #fff
          background: rgb(0, 160, 220)
          transition: all 0.2s
          opacity: 1
          &.fade-enter, &.fade-leave-to
            opacity: 0
      .info
        padding: 18px
        .title
          line-height: 14px
          margin-bottom: 6px
          font-size: 14px
          color: rgb(7, 17, 27)
        .text
          line-height: 24px
          padding: 0 8px
          font-size: 12px
          color: rgb(77, 85, 93)
      .rating
        padding-top: 18px
        .title
          line-height: 14px
          margin-left: 18px
          font-size: 14px
          color: rgb(7, 17, 27)
        .rating-wrapper
          padding: 0 18px
          .ratings-item
            position: relative
            padding: 16px 0
            border-1px(rgba(7, 17, 27, 0.1))
            .user
              position: absolute
              top: 16px
              right: 0
              line-height: 12px
              font-size: 0
              .name
                display: inline-block
                vertical-align: top
                margin-right: 6px
                font-size: 10px
                color: rgb(147, 153, 159)
              .avatar
                display: inline-block
                vertical-align: top
                border-radius: 50%
            .time
              margin-bottom: 6px
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
            .text
              line-height: 16px
              font-size: 12px
              color: rgb(7, 17, 27)
              .icon-thumb_up, .icon-thumb_down
                line-height: 16px
                margin-right: 4px
                font-size: 12px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .icon-thumb_down
                color: rgb(147, 153, 159)
          .no-rating
            padding: 16px 0
            font-size: 12px
            color: rgb(147, 153, 159)
</style>
