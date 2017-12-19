<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" v-for="(item, index) in goods" :key="index" :class="{'current':currentIndex===index}"
            @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <v-iconClassMap v-show="item.type > 0" :iconType="item.type"></v-iconClassMap>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="foods-list foods-list-hook" v-for="(item,index) in goods" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item border-1px" v-for="(food,index) in item.foods" :key="index" @click="selectFood(food, $event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old"
                                                                v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartControl-wrapper">
                  <v-cartControl :foodItem="food"></v-cartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-shopCart :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></v-shopCart>
    <v-foodInfo :food="selectedFood" ref="foodinfo"></v-foodInfo>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import iconClassMap from 'components/iconClassMap/iconClassMap';
  import shopCart from 'components/shopCart/shopCart';
  import cartControl from 'components/cartControl/cartControl';
  import foodInfo from 'components/foodInfo/foodInfo';

  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      'v-iconClassMap': iconClassMap,
      'v-shopCart': shopCart,
      'v-cartControl': cartControl,
      'v-foodInfo': foodInfo
    },
    data() {
      return {
        goods: [],
        listHeight: [], // 存放每一个list的高度
        scrollY: 0, // 页面滚动距离
        selectedFood: {}
      };
    },
    created() {
      this.$http.get('api/goods').then((response) => {
        response = response.body; // 获取数据对象
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // console.log(this.goods);
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      _initScroll() { // 页面滑动
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true // better-scroll会阻止默认事件，自己派生点击事件,所以pc端会执行两次，包括原生点击触发
        });
        this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3 // 实时监测滚动位置
        });
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y)); // 将位置四舍五入后取绝对值
          // console.log(this.scrollY);
        });
      },
      // ***滚动右侧foodScroll，影响左侧menu***
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('foods-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height); // list的距离父级顶部的高度存放到数组里，相当于是position.top值
        }
      },
      // ***点击左侧menu，影响右侧foods，event就是事件对象***
      selectMenu(index, event) {
        if (!event._constructed) { // _constructed是better-scroll事件对象属性，原生事件没有在这个属性,所以不执行下面的函数,也就是说阻止pc端的点击事件
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('foods-list-hook');
        let foodli = foodList[index]; // 点击menu后，对应的foodlist[index]
        this.foodScroll.scrollToElement(foodli, 300); // 300ms滚动到对应的foodlist位置
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.foodinfo.initShow();
      }
    },
    computed: {
      currentIndex() { // 当前list的index，对应menu-item的index
        for (let i = 0; i < this.listHeight.length; i++) { // 循环list的位置
          let currentHeight = this.listHeight[i];
          let nextHeight = this.listHeight[i + 1];
          if (!nextHeight || (this.scrollY >= currentHeight && this.scrollY < nextHeight)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() { // 选中foods
        let foods = [];
        this.goods.forEach((item) => {
          item.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        width: 56px
        height: 54px
        padding: 0 12px
        line-heightL 14px
        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          padding-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          position: relative // desc内容过大时 会影响到cartControl-wrapper的位置
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            font-size: 10px
            line-height: 10px
            color: rgb(147, 153, 159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            .count
              margin-right: 12px
          .price
            line-height: 24px
            font-size: 0
            .now
              margin-right: 8px
              font-size: 14px
              font-weight: 700
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartControl-wrapper
            position: absolute
            right: 0
            bottom: 0
</style>
