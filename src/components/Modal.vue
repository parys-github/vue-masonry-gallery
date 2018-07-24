<template>
  <div class="lightbox-alpha animated fadeIn" v-on:click="closeModal()">
    <a href="#" class="btn-close" @ok="closeModal()">x</a>
    <div class="lightbox-content animated" v-on:click.stop="" v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: "modal",
  props: ["closeModal", "content"]
};
</script>

<style>
.lightbox-alpha {
  transition: transform 0.3s ease-out;
  background: rgba(245, 245, 245, 0.88);
}

.lightbox-content {
  background-color: whitesmoke;
  padding: 6px 6px 20px;
  box-shadow: 0 1px 10px -1px rgba(0, 0, 0, 0.6);
}
a.btn-close {
  position: absolute;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  color: #5f5f5f;
  font-weight: bold;
  top: 20px;
  right: 20px;
  background-color: white;
  width: 37px;
  height: 32px;
  display: block;
  text-align: center;
  border-radius: 50%;
  box-shadow: 0 1px 10px -1px rgba(0, 0, 0, 0.6);
  padding-top: 4px;
  padding-bottom: 0;
  line-height: 24px;
  transition: all 0.4s ease-out;
  z-index: 99;
}
btn-close:hover {
  background-color: #cf3e2c;
  color: white;
}
</style>