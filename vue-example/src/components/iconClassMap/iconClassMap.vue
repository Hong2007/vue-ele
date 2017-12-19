<template>
  <span class="icon" :class="classMap[iconType]"></span>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'iconClassMap',
    props: {
      iconType: {
        type: Number
      }
    },
    created() {
      // 定义一个classMap数组，代表不同的icon[减，折，特，票，保],有序排列，index代表type
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .icon
    display: inline-block
    vertical-align: top
    width: 12px
    height: 12px
    background-size: 100% 100%
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
</style>
