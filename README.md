# vue-masonry-gallery 1.x
![alt text](https://vue-masonry-gallery.vajracode.com/static/img/vue-masonry-gallery-screen.jpg "Screenshot")
1.  The masonry gallery component based on Vue.js that contains beautiful Waterfall Flow layout and fancy thumbnails hovering effect. Component letting you choos opening media at internal/external tabs or display media in modal popup.
2.  Compared to other implementations, there is no need to specify the width and height of the image in the returned data. A very convenient option for controlled sequential loading of items or displaying random items.
3.  Responsive layout, flexible adapted for mobile devices.
4.  Very easy to implement to any projest, intentionaly dedicated to Vue.js environment.

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at http://localhost:8888
npm run dev

# build for production with minification /dist/ directory
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 1. Usage

### 1.1 Installation

```
npm install vue-masonry-gallery --save
```

### 1.2 es6 import

```js
import VueWMasonryGallery from "vue-masonry-gallery";
```

```js
export default {
  name: "app",
  components: {
    VueMasonryGallery
  }
};
```

### 1.3 scripts import

[download vueMasonryGallery.js](https://github.com/parys-github/vue-masonry-gallery/vendor/VueMasonryGallery/VueWaterfallEasy.js)

```html
<script src="path/to/vue/vue.js"></script>
<script src="path/to/VueMasonryGallery.js"></script>
```

```js
new Vue({
  el: "#app",
  components: {
    VueMasonryGallery
  }
});
```

### 1.4 Supports require.js and sea.js module import

## 2. Basic example

html

```html
<vue-masonry-gallery :imgsArr="imgsArr" @scrollReachBottom="getData"></vue-masonry-gallery>
```

**If imgArr is a replacement update, the data returned by the getData method new request overwrites the original data.**

**If imgArr is an incremental update, the data returned by the new request of getData method is merged with the original data. At this time, it is not recommended to use the replacement update, which will waste performance. The following example is an incremental update.**

js

```js
import VueMasonryGallery from "./components/VueMasonryGallery.vue";
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      imgsArr: [],
      group: 0 // request param
    };
  },
  components: {
    VueMasonryGallery
  },
  methods: {
    getData() {
      // In the real environment,the backend will return a new image array based on the parameter group.
      // Here I simulate it with a stunned json file.
      axios
        .get("./static/data/loadImages.json?group=" + this.group)
        .then(res => {
          this.imgsArr = this.imgsArr.concat(res.data);
          this.group++;
        });
    }
  },
  created() {
    this.getData();
  }
};
```

[more detail see App.vue file](https://github.com/parys-github/vue-masonry-gallery/blob/master/src/App.vue)

## 3. Props

| props               | type           | default                  | description                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------- | -------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| width               | Number         | -                        | Container width（px）,default is 100% relative parent element width,**Due to the responsiveness,all its parent's width must be 100% relative to the browser window at this time**,See the example after the table<br>**If it is fixed width, you must set the width prop **, not just its parent element set fixed width                                                                                            |
| height              | Number\|String | -                        | Container height, the default unit `px` for the value of the `Number` type, the unit can be specified when the value is the type of `String`<br>**When you do not specify the `height` value, the default is relative to the height of the parent element 100%, then the parent element must have a height**                                                                                                        |
| gap                 | Number         | 20                       | [Pc] space between pictures(px)                                                                                                                                                                                                                                                                                                                                                                                     |
| mobileGap           | Number         | 8                        | [Mobile] space between pictures(px)                                                                                                                                                                                                                                                                                                                                                                                 |
| imgsArr             | Array          | []                       | **required**<br>Data used to render the masonry gallery stream<br>Each array element is an object and must have `src` and `href` attributes.<br>The `src` attribute represents the SRC attribute of the picture<br>The `href` attribute represents the link to click to jump <br>**if your key is not `src` and `href`, you can use the two properties of `srcKey` and `hrefKey` to do the key value replacement.** |
| random              | Boolean         | false                    | The function of random display of items. Default option is 'false' - to run RANDOM sorting change to 'true'                                                                                                                                                                                                                                                                                                                   |
| srcKey              | String         | 'src'                    | When the key value of your picture address is not `src`, you can use this property to replace it.                                                                                                                                                                                                                                                                                                                   |
| hrefKey             | String         | 'href'                   | When the key value of your picture address is not `href`, you can use this property to replace it.                                                                                                                                                                                                                                                                                                                  |
| target            | String         | 'blank' 'self' 'modal'                      | A method of running a popup window that displays an image or redirects to an external url                                                                                                                                                                                                                                                                                                                                                                                      |
| perPage            | Number         | 13                      | The number of items displayed the first time you load the page.                                                                                                                                                                                                                                                                                                                                                                                      |
| imgWidth            | Number         | 330                      | The width of the picture（px）                                                                                                                                                                                                                                                                                                                                                                                      |
| maxCols             | Number         | 5                        | Masonry shows the maximum number of columns                                                                                                                                                                                                                                                                                                                                                                         |
| linkRange           | String         | 'card'                   | Identify click to trigger jump link range<br>value:<br>'card' Whole card range<br> 'img' image range <br> 'custom' Customize the link range through slots                                                                                                                                                                                                                                                           |
| isRouterLink        | Boolean        | false                    | Render the a tag when the value is false<br>Render the router-link component when the value is true                                                                                                                                                                                                                                                                                                                 |
| reachBottomDistance | Number         | 0                        | The distance(px) from the bottom of the container when the scrolling triggers the scrollReachBottom event                                                                                                                                                                                                                                                                                                           |
| loadingDotCount     | Number         | 3                        | The number of default loading animation dots                                                                                                                                                                                                                                                                                                                                                                        |
| loadingDotStyle     | Object         | null                     | The style object of the small dots in the default loading element                                                                                                                                                                                                                                                                                                                                                   |
| loadingTimeOut      | Number         | 500                      | Preloading events less than 500ms milliseconds do not display loading animations,increasing the user experience                                                                                                                                                                                                                                                                                                     |
| cardAnimationClass  | String         | 'default-card-animation' | the animation className for the card                                                                                                                                                                                                                                                                                                                                                                                |

## 4. Event

| event name        | description                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| scrollReachBottom | When the scroll bar scrolls to the bottom,it is used to trigger a request for new image data |
| preloaded         | Trigger every time image preloading is completed                                             |
| click             | Trigger when the card is clicked,look at an example under the table                          |

click event

```html
<vue-masonry-gallery :imgsArr="imgsArr" @scrollReachBottom="getData" @click="clickFn"></vue-masonry-gallery>
```

```js
  clickFn(event, { index, value }) {
    // Prevent a tag jump
    event.preventDefault()
    // Do it only when you click on the image
    if (event.target.tagName.toLowerCase() == 'img') {
      console.log('img clicked',index, value)
    }
  }
```

## 5. methods

### 5.1 masonryOver

When the rolling load data is over, manual invoking will remove the scroll event.

```
this.$refs.waterfall.masonryOver()
```

[more detail see App.vue](https://github.com/parys-github/vue-masonry-gallery/blob/master/src/App.vue)

## 6. slot

### 6.1 default slot

Custom picture description element

#### parameter

| parameterpar | description                                              |
| ------------ | -------------------------------------------------------- |
| props.index  | The index of the image in the data array,starting from 0 |
| props.value  | The value of imgsArr item                                |

```html
<vue-masonry-gallery :imgsArr="imgsArr" @scrollReachBottom="getData">
  <div class="img-info" slot-scope="props">
    <p class="some-info">picture index: {{props.index}}</p>
    <p class="some-info">{{props.value.info}}</p>
  </div>
</vue-masonry-gallery>
```

### 6.2 slot="loading"

Custom loading element

```html
<div slot="loading" slot-scope="{isFirstLoad}">
  <div slot="loading" v-if="isFirstLoad">first-loading...</div>
  <div v-else="v-else">loading...</div>
</div>
```

### 6.3 slot="masonry-head"

Waterfall container head slot

```html
<vue-masonry-gallery :imgsArr="imgsArr" @scrollReachBottom="getData">
  <div slot="masonry-head">masonry-head</div>
</vue-masonry-gallery>
```

### 6.4 slot="waterfall-over"

when `masonryOver` method is called，this slot will show

```html
<vue-masonry-gallery :imgsArr="imgsArr" @scrollReachBottom="getData">
  <div slot="waterfall-over">waterfall-over</div>
</vue-masonry-gallery>
```

### 7. DEMO
Jump to online demo and resize browser screen or check view on any mobile device.

##### [Demo live <= ](https://vue-masonry-gallery.vajracode.com)

##### [Sample code App.vue <=](https://github.com/parys-github/vue-masonry-gallery/blob/master/src/App.vue)
