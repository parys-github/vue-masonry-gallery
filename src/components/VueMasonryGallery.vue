<!-- —————————————↓SCSS—————————————— -->
<style lang="scss" scoped>
.vue-masonry-gallery-container {
  width: 100%;
  height: 100%;
  position: relative;
  .vue-masonry-gallery-scroll {
    padding-top: 12px;
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .vue-masonry-gallery {
    position: absolute;
    width: 100%;
    @keyframes show-card {
      0% {
        transform: scale(0.7);
      }
      100% {
        transform: scale(1);
      }
    }
    & > .img-box {
      position: absolute;
      box-sizing: border-box;
      width: 50%; // Mobile terminal takes effect
    }
    & > .img-box.default-card-animation {
      animation: show-card 0.4s;
      transition: left 0.6s, top 0.6s;
      transition-delay: 0.1s;
    }
    a {
      display: block;
    }
    .alink {
      &:hover {
        cursor: pointer;
      }
    }
    a.img-inner-box {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      transition: all 0.4s ease-out;
      &:hover {
        filter: grayscale(1);
      }
    }
    a.img-wraper {
      background: url(../../static/img/broken-img.svg);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 44%;
      & > img {
        width: 100%;
        display: block;
        border: none;
      }
    }
    .over {
      position: absolute;
      width: 100%;
      text-align: center;
      font-size: 12px;
      line-height: 1.6;
      color: #aaa;
      padding: 20px 0 0 0;
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
    }
  }

  & > .loading.first {
    bottom: 50%;
    transform: translate(-50%, 50%);
  }
  & > .loading {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 6px;
    z-index: 999;
    @keyframes ball-beat {
      30% {
        opacity: 0.2;
        transform: scale(0.55);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    &.ball-beat > .dot {
      vertical-align: bottom;
      background-color: #da1c04;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      margin: 2px;
      animation-fill-mode: both;
      display: inline-block;
      animation: ball-beat 0.7s 0s infinite linear;
    }
    &.ball-beat > .dot:nth-child(2n-1) {
      animation-delay: 0.35s;
    }
  }
  .loadMore {
    position: relative;
    transition: all 0.4s ease-out;
    width: 160px;
    height: 40px;
    line-height: 30px;
    margin: 0 auto;
    margin-bottom: 10px;
    border-radius: 5px;
    font-size: 15px;
    color: #b7b7b7;
    cursor: pointer;
    outline: none;
    border: solid 1px #d7d7d7;
    &:hover {
      background-color: #cf3e2c;
      border: solid 1px #cf3e2c;
      color: white;
    }
  }
}
</style>

<!-- —————————————↓HTML————————————————— -->
<template lang="pug">
.vue-masonry-gallery-container(:style="{width: width&&!isMobile ? width+'px' : '', height: parseFloat(height)==height ? height+'px': height }")
  .loading.ball-beat(v-show="isPreloading_c", :class="{first:isFirstLoad}")
    slot(name="loading", :isFirstLoad="isFirstLoad")
    .dot(v-if="!hasLoadingSlot", v-for="n in loadingDotCount",:style="loadingDotStyle")
  //- In order to prevent loading from following the scroll
  .vue-masonry-gallery-scroll(ref="scrollEl")
    slot(name="masonry-head")
    .vue-masonry-gallery(:style="isMobile? '' :{width: colWidth*cols+'px',left:'50%', marginLeft: -1*colWidth*cols/2 +'px'}")
      .img-box(
        v-for="(v,i) in imgsArr_c",
        v-if="i < currentlyVisible"
        :class="[cardAnimationClass]"
        :style="{padding: (isMobile ? mobileGap : gap)/2+'px', width: isMobile ? '' : colWidth+'px'}"
      )
        component.img-inner-box(
          :is="isRouterLink  && linkRange=='card' ? 'router-link' : 'alink'",
          :data-index="i",
          :to="linkRange=='card' ? v[hrefKey] : false")
          component.img-wraper(
            v-if="v[srcKey]",
            :is="isRouterLink && linkRange=='img' ? 'router-link' :'alink'",
            :to="linkRange=='img' ? v[hrefKey] : false ",
            :style="{width:imgWidth_c + 'px',height:v._height ? v._height+'px':false}")
            img(:src="v[srcKey]")
          slot(:index="i",:value="v")
  #footer
    button.loadMore(@click="loadMore" v-if="currentlyVisible<imgsArr_c.length") Load more items
    p.copyright VajraCode 2018
</template>

<!-- ——————————————↓JS———————————————————————— -->
<script>
import alink from "./alink.vue";

export default {
  name: "vue-masonry-gallery",
  components: {
    alink
  },
  props: {
    width: {
      // Container width
      type: Number
    },
    height: {
      // Container height
      type: [Number, String]
    },
    reachBottomDistance: {
      // Scroll bottom distance, trigger loading new image
      type: Number, // selector
      default: 0 // Default triggered at the lowest column
    },
    loadingDotCount: {
      // loading points
      type: Number,
      default: 3
    },
    loadingDotStyle: {
      type: Object
    },
    gap: {
      // .img-box spacing
      type: Number,
      default: 20
    },
    mobileGap: {
      type: Number,
      default: 8
    },
    maxCols: {
      type: Number,
      default: 4
    },
    imgsArr: {
      type: Array,
      required: true
    },
    srcKey: {
      type: String,
      default: "src"
    },
    hrefKey: {
      type: String,
      default: "href"
    },
    imgWidth: {
      type: Number,
      default: 330
    },
    isRouterLink: {
      type: Boolean,
      default: false
    },
    linkRange: {
      // card | img | Customize the link range through slots
      type: String,
      default: "card"
    },
    loadingTimeOut: {
      // Preloading events less than 500 milliseconds do not display loading animations, increasing the user experience
      type: Number,
      default: 500
    },
    cardAnimationClass: {
      type: [String],
      default: "default-card-animation"
    },
    perPage: {
      type: Number,
      default: 13
    }
  },
  data() {
    return {
      currentlyVisible: 0,
      msg: "this is from VueMasonryGallery.vue",
      isMobile: !!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i), // Initialize the mobile terminal
      isPreloading: true, // Preloading, showing loading animation
      isPreloading_c: true,
      imgsArr_c_page: [],
      imgsArr_c: [], // After imgsArr is completed and the image is preloaded, imgsArr_c will be generated after the new field height is inserted. Then the rendering starts.
      loadedCount: 0,
      cols: NaN, // Need to initialize based on window width
      imgBoxEls: null, // All .img-box elements
      beginIndex: 0, // The index of the picture to be arranged is the first picture in the second column for the first time, and the subsequent index is the next index of the already arranged picture.
      colsHeightArr: [],
      // Custom loading
      LoadingTimer: null,
      isFirstLoad: true, // Loading for the first time
      over: false, // Ending the waterfall loading
      scrolled: false
    };
  },
  computed: {
    colWidth() {
      // Width of each column
      return this.imgWidth + this.gap;
    },
    imgWidth_c() {
      // Recalculate the picture width for the mobile side
      return this.isMobile
        ? window.innerWidth / 2 - this.mobileGap
        : this.imgWidth;
    },
    hasLoadingSlot() {
      return !!this.$scopedSlots.loading;
    }
  },
  mounted() {
    this.bindClickEvent();
    this.loadingMiddle();

    this.preload();
    this.cols = this.calcuCols();
    this.$on("preloaded", () => {
      this.isFirstLoad = false;

      // First page of perPage elements (default is 12)
      this.imgsArr_c_page = this.imgsArr.slice(0, this.perPage);
      this.currentlyVisible = this.perPage;

      this.imgsArr_c = this.imgsArr.concat([]); // Pre-loading is complete, then only start rendering
      this.$nextTick(() => {
        this.isPreloading = false;
        this.imgBoxEls = this.$el.getElementsByClassName("img-box");
        // console.log('Total number of pictures', this.imgBoxEls.length)
        this.waterfall();
      });
    });
    if (!this.isMobile && !this.width) this.response();
    this.scroll();
  },
  watch: {
    isPreloading(newV, oldV) {
      if (newV) {
        setTimeout(() => {
          if (!this.isPreloading) return; // 500 Loading images after preloading the image in milliseconds
          this.isPreloading_c = true;
        }, this.loadingTimeOut);
      } else {
        this.isPreloading_c = false;
      }
    },
    imgsArr(newV, oldV) {
      if (oldV.length > 0 && newV[0] && !newV[0]._height) {
        // console.log('reset')
        this.reset();
      }
      this.preload();
    }
  },
  methods: {
    // ==1== Preloading
    preload(src, imgIndex) {
      this.imgsArr.forEach((imgItem, imgIndex) => {
        if (imgIndex < this.loadedCount) return; // Preload only new loaded images

        // When there is no picture

        if (!imgItem[this.srcKey]) {
          this.imgsArr[imgIndex]._height = "0";
          this.loadedCount++;
          return;
        }
        var oImg = new Image();
        oImg.src = imgItem[this.srcKey];
        oImg.onload = oImg.onerror = e => {
          this.loadedCount++;
          // Preload images, calculate the height of the image container
          this.imgsArr[imgIndex]._height =
            e.type == "load"
              ? Math.round(this.imgWidth_c / (oImg.width / oImg.height))
              : this.imgWidth;

          if (this.loadedCount == this.imgsArr.length) {
            this.$emit("preloaded");
          }
        };
      });
    },
    // ==2==  Calculate cols
    calcuCols() {
      // Column number initialization
      var waterfallWidth = this.width ? this.width : window.innerWidth;
      var cols = parseInt(waterfallWidth / this.colWidth);
      cols = cols === 0 ? 1 : cols;
      return this.isMobile ? 2 : cols > this.maxCols ? this.maxCols : cols;
    },
    // ==3== Waterfall layout
    waterfall() {
      if (!this.imgBoxEls) return;
      // console.log('waterfall')
      var top,
        left,
        height,
        colWidth = this.isMobile
          ? this.imgBoxEls[0].offsetWidth
          : this.colWidth;
      if (this.beginIndex == 0) this.colsHeightArr = [];
      for (var i = 0; i < this.imgsArr_c.length; i++) {
        if (!this.imgBoxEls[i]) return;
        height = this.imgBoxEls[i].offsetHeight;
        if (i < this.cols) {
          this.colsHeightArr.push(height);
          top = 0;
          left = i * colWidth;
        } else {
          var minHeight = Math.min.apply(null, this.colsHeightArr); // Lowest level
          var minIndex = this.colsHeightArr.indexOf(minHeight); // Lowest height index
          top = minHeight;
          left = minIndex * colWidth;
          // Set the location of the element's positioning
          // Update colsHeightArr

          this.colsHeightArr[minIndex] = minHeight + height;
        }

        this.imgBoxEls[i].style.left = left + "px";
        this.imgBoxEls[i].style.top = top + "px";
      }
    },
    // ==4== Responsive view
    response() {
      window.addEventListener("resize", () => {
        var old = this.cols;
        this.cols = this.calcuCols();
        if (old === this.cols) return; // Leave the number of columns unchanged and exit directly
        this.beginIndex = 0; // Begins to arrange the index of the elements
        this.waterfall();
        if (this.over) this.setOverTipPos();
      });
    },

    // ==5== Scroll bottom event
    scrollFn() {
      var scrollEl = this.$refs.scrollEl;
      if (this.isPreloading) return;
      var minHeight = Math.min.apply(null, this.colsHeightArr);
      if (
        scrollEl.scrollTop + scrollEl.offsetHeight >
        minHeight - this.reachBottomDistance
      ) {
        this.isPreloading = true;
        // console.log('scrollReachBottom')
        this.$emit("scrollReachBottom"); // Scrolling bottom
      }
    },
    // Load more images (next page)
    loadMore() {
      const b = this.currentlyVisible - 1;
      const e = b + this.perPage;
      this.currentlyVisible += this.perPage;

      this.imgsArr_c_page = this.imgsArr_c_page.concat(
        this.imgsArr_c.slice(b, e)
      );
      this.$nextTick(() => {
        this.waterfall();
      });
    },
    scroll() {
      this.$refs.scrollEl.addEventListener("scroll", this.scrollFn);
    },
    masonryOver() {
      this.$refs.scrollEl.removeEventListener("scroll", this.scrollFn);
      this.isPreloading = false;
      this.over = true;
    },
    // ==6== Click event binding
    bindClickEvent() {
      this.$el
        .querySelector(".vue-masonry-gallery")
        .addEventListener("click", e => {
          var targetEl = e.target;
          if (targetEl.className.indexOf("img-box") != -1) return;
          while (targetEl.className.indexOf("img-inner-box") == -1) {
            targetEl = targetEl.parentNode;
          }
          var index = targetEl.getAttribute("data-index");
          this.$emit("click", e, {
            index,
            value: this.imgsArr_c[index]
          });
        });
    },
    // other
    loadingMiddle() {
      // Correction of the misalignment caused by the width of the scroll bar
      var scrollEl = this.$el.querySelector(".vue-masonry-gallery-scroll");
      var scrollbarWidth = scrollEl.offsetWidth - scrollEl.clientWidth;
      this.$el.querySelector(".loading").style.marginLeft =
        -scrollbarWidth / 2 + "px";
    },
    reset() {
      this.imgsArr_c = [];
      this.beginIndex = 0;
      this.loadedCount = 0;
      this.isFirstLoad = true;
      this.isPreloading = true;
      this.scroll();
      this.over = false;
    }
  }
};
</script>
