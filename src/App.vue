<template lang="pug">
#app
  #header
    <div class="header-block">
    a(href="https://www.vajracode.com",target="_blank",title="VajraCode")
      img.vajralogo(src="../static/img/vajracode-logo.png")
    a.github(href="https://github.com/parys-github/vue-masonry-gallery",target="_blank",title="GitHub")
      img.ghlogo(src="../static/img/github-icon.svg")
    a.npm(href="https://www.npmjs.com/~vajracode",target="_blank",title="NPMjs")
      img.npmlogo(src="../static/img/npm-logo.svg")
    img.npm-code(src="../static/img/vue-masonry-gallery.png")
    </div>
  #content
    vue-masonry-gallery(ref="waterfall",:imgsArr="imgsArr",@scrollReachBottom="getData", @click="clickFn")
      .img-info(slot-scope="props")
        //-p.title-info this is number{{props.index+1}} image => Add dinamic title number
        p.title-info {{props.value.title}}
        p.desc-info {{props.value.info}}
    //-Custom loading animation
    div(slot="loading" slot-scope="{isFirstLoad}")
      div(slot="loading" v-if="isFirstLoad") first-loading...
      div(v-else) loading...
    <modal v-if="modalIsVisible" :closeModal="closeModal" :content="modalContent" />
</template>

<script>
import VueMasonryGallery from "./components/VueMasonryGallery.vue";
import Modal from "./components/Modal.vue";
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      modalIsVisible: false,
      modalContent: "",
      random: false, // randomize thumbs order
      imgsArr: [],
      group: 0 // The number of times the currently loaded image is loaded
    };
  },
  components: {
    VueMasonryGallery,
    Modal
  },
  methods: {
    getData() {
      axios
        .get("./static/data/loadImages.json?group=" + this.group) // In the real environment, the backend will return a new image array based on the parameter group. Here I simulate it with a stunned json file.
        .then(res => {
          this.group++;
          if (this.group === 2) {
            // The simulation has no new data, showing slot="waterfall-over"
            this.$refs.waterfall.masonryOver();
            return;
          }
          if (this.random) {
            this.imgsArr = this.shuffle(this.imgsArr.concat(res.data));
          } else {
            this.imgsArr = this.imgsArr.concat(res.data);
          }
        });
    },
    // Fisher–Yates Shuffle: https://bost.ocks.org/mike/shuffle/
    shuffle(array) {
      let currentIndex = array.length,
        temporaryValue,
        randomIndex;

      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // ... and swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },
    clickFn(event, { index, value }) {
      event.preventDefault();

      const target = this.imgsArr[index].target;

      // if srcBig is set use it as href, if not then use href
      const href = this.imgsArr[index].srcBig || this.imgsArr[index].href;

      if (target === "self") {
        window.location.href = href;
      } else if (target === "modal") {
        this.modalIsVisible = true;
        this.modalContent = `<img src="${this.imgsArr[index].srcBig}" alt="${
          this.imgsArr[index].title
        }"/>`;
      } else {
        window.open(href, "_blank");
      }
      if (event.target.tagName.toLowerCase() == "img") {
        console.log("img clicked", index, value);
      }
    },
    closeModal() {
      this.modalIsVisible = false;
    },
    changeImgArr() {
      axios
        .get("./static/data/data-change.json") // In the real environment, the backend will return a new image array based on the parameter group. Here I simulate it with a stunned json file.
        .then(res => {
          this.imgsArr = res.data;
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss">
@import "assets/scss/animate";
* {
  margin: 0;
  padding: 0;
}
a {
  color: #000;
  text-decoration: none;
  &:active {
    color: #000;
  }
}
html,
body,
#app {
  height: 100%;
  background-color: #f5f6f7;
}
.lightbox-alpha {
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  height: 100%;
  width: 100%;
  z-index: 999;
  opacity: 1;
  top: 0;
  left: 0;
  .lightbox-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /*height: calc(100% - 50px);*/
    height: auto;
    overflow: auto;
  }
}
#app {
  position: relative;
  #header {
    height: 80px;
    display: block;
    background: rgb(232, 232, 232);
    background: rgb(236, 236, 236);
    background: linear-gradient(
      0deg,
      rgba(236, 236, 236, 1) 0%,
      rgba(210, 210, 210, 1) 94%,
      rgba(210, 210, 210, 1) 100%
    );
    color: #333333;
    line-height: normal;
    font-size: 16px;
    position: sticky;
    z-index: 999;
    width: 100%;
    box-shadow: 0 -3px 8px 2px rgba(0, 0, 0, 0.6);
    border-bottom: solid 1px #4e4944;
    .header-block {
      max-width: 1380px;
      margin: 0 auto;
      height: 100%;
      .vajralogo {
        float: left;
        height: 29px;
        padding-top: 26px;
        transition: all 0.4s ease-out;
        &:hover {
          filter: grayscale(1);
        }
      }
      .npm,
      .github {
        float: right;
        text-align: right;
        margin-top: 22px;
        width: 30px;
        height: 22px;
        .npmlogo,
        .ghlogo {
          height: 22px;
          margin-left: 10px;
          transition: all 0.4s ease-out;
          filter: grayscale(1);
        }
        .ghlogo {
          opacity: 0.1;
          &:hover {
            opacity: 1;
          }
        }
        .npmlogo {
          opacity: 0.2;
          &:hover {
            filter: grayscale(0);
            opacity: 1;
          }
        }
      }
      img.npm-code {
        position: relative;
        right: -80px;
        top: 59px;
        float: right;
        z-index: 99;
      }
    }
  }
  #content {
    position: absolute;
    top: 80px;
    bottom: 0;
    width: 100%;

    .img-info {
      font-family: Arial, Helvetica, sans-serif;
      position: absolute;
      overflow: hidden;
      top: 0;
      left: 0;
      width: 97.8%;
      height: 100%;
      text-align: center;
      opacity: 0;
      transition: all 0.2s ease-out;
      transition-delay: 0.05s;
      p {
        cursor: text;
      }
      .title-info,
      .desc-info {
        padding: 10px 4px;
        position: absolute;
        transition: all 0.3s ease-out;
        transition-delay: 0.1s;
        background-color: rgba(255, 255, 255, 0.8);
        width: calc(100% - 20px);
        margin-left: 10px;
      }
      .title-info {
        top: -10px;
        color: #676464;
        text-rendering: geometricPrecision;
        display: block;
        box-shadow: 0px 4px 4px -4px rgba(0, 0, 3, 0.7);
      }
      .desc-info {
        bottom: -15px;
        font-size: 14px;
        color: #5f5f5f;
        display: block;
        box-shadow: 0px -4px 6px -5px rgba(0, 0, 3, 0.75);
      }
      &:hover {
        opacity: 1;
        .title-info {
          top: 10px;
        }
        .desc-info {
          bottom: 10px;
        }
      }
    }
  }
}
#app {
  overflow: auto;
  position: relative;
  .some-info {
    line-height: 1.6;
    text-align: center;
  }
}
#footer {
  padding: 10px 0 20px;
  width: 100%;
  text-align: center;
  position: relative;
  transition: all 0.4s ease-out;
  p.copyright {
    width: 108px;
    margin: 0 auto;
    color: #adadad;
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
  }
}
@media only screen and (max-width: 1399px) {
  body {
    #app {
      #header {
        .header-block {
          max-width: 1040px;
        }
      }
    }
  }
}
@media only screen and (max-width: 1049px) {
  body {
    #app {
      #header {
        .header-block {
          max-width: 680px;
        }
      }
    }
  }
}
@media only screen and (max-width: 699px) {
  body {
    #app {
      #header {
        .header-block {
          max-width: 100%;
          margin: 0 30px;
        }
      }
      .lightbox-alpha {
        .btn-close{
             top: 20px;
             right: 10px;
           }
         .lightbox-content{
         top:30px;
         transform: translate(-50%, 0);
         width: 90%;
         img{
           width: 100%;
         }
       }
     }
    }
  }
}
@media only screen and (max-width: 444px) {
  body {
    #app {
      #header {
        .header-block {
          img.npm-code {
            position: absolute;
            right: 15px;
          }
        }
      }
      #content{
        .lightbox-alpha {
          .btn-close{
                  right: 5px;
                }
         .lightbox-content{
          }
        }
      }
    }
  }
}
</style>
