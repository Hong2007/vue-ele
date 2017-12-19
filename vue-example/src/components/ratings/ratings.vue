<template>
  <div class="ratings" ref="ratingsContent">
    <div class="ratings_content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高度周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <v-star :size="36" :score="seller.serviceScore"></v-star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <v-star :size="36" :score="seller.score"></v-star>
            <span class="score">{{seller.score}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <v-ratingSelect :ratings="ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" @selectRatings="filterRatings" @isContent="isContent"></v-ratingSelect>
      <div class="ratings-wrapper">
        <ul>
          <li class="rating-item border-1px" v-for="(ratingItem,index) in ratings" :key="index" v-show="needShow(ratingItem.rateType,ratingItem.text)">
            <div class="avatar">
              <img :src="ratingItem.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{ratingItem.username}}</h1>
              <div class="star-wrapper">
                <v-star :size="24" :score="ratingItem.score"></v-star>
                <span class="delivery" v-show="ratingItem.deliveryTime">{{ratingItem.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{ratingItem.text}}</p>
              <div class="recommend-wrapper" v-show="ratingItem.recommend && ratingItem.recommend.length">
                <i class="icon-thumb_up"></i>
                <span class="item" v-for="(recommendItem,index) in ratingItem.recommend" :key="index">{{recommendItem}}</span>
              </div>
              <div class="rating-time">{{ratingItem.rateTime | formatDate('yyyy-MM-dd hh:mm')}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'common/js/formatDate.js';
  import BScroll from 'better-scroll';
  import star from 'components/star/star';
  import ratingSelect from 'components/ratingSelect/RatingSelect';
  import split from 'components/split/split';

  const ALL = 2;
  const ERR_OK = 0;

  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      };
    },
    created() { // 请求后端数据
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this._initScroll();
          });
        }
      });
    },
    components: {
      'v-star': star,
      'v-split': split,
      'v-ratingSelect': ratingSelect
    },
    methods: {
      _initScroll() { // 初始化
        this.scroll = new BScroll(this.$refs.ratingsContent, {
          click: true
        });
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
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        @media only screen and (max-width: 320px)
          flex: 0 0 110px
          width: 110px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding: 6px
        .score-wrapper
          margin-bottom: 8px
          line-height: 18px
          font-size: 0
          .title
            display: inline-block
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            vertical-align: top
            margin: 0 12px
            height: 18px
          // .star 高度有问题
          .score
            display: inline-block
            vertical-align: top
            font-size: 12px
        .delivery-wrapper
          line-height: 18px
          font-size: 0
          .title
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .ratings-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          flex: 1
          position: relative
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            line-height: 12px
            font-size: 0
            font-weight: 200
            color: rgb(147, 153, 159)
            .star
              display: inline-block
              vertical-align: top
              margin-right: 6px
              height: 12px
            .delivery
              display: inline-block
              vertical-align: top
              font-size: 10px
          .text
            margin-bottom: 8px
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .recommend-wrapper
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .item
              display: inline-block
              vertical-align: top
              margin: 0 8px 4px 0
            .icon-thumb_up
              height: 16px
              font-size: 12px
              color: rgb(0, 160, 220)
            .item
              padding: 0 6px
              font-size: 9px
              color: rgb(147, 153, 159)
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 2px
              background: rgb(255, 255, 255)
          .rating-time
            position: absolute
            right: 0
            top: 0
            line-height: 12px
            font-size: 10px
            font-weight: 200
            color: rgb(147, 153, 159)
</style>
