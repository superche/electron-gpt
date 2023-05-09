<template>
  <div class="dark">
    <div class="app-header">
      <div class="outer-wrapper">
        <div class="home-page">
          <div class="home-header">
            <a
              class="header-item"
              href="/"
            >
              <img
                class="logo"
                :src="logo"
                alt=""
              />
            </a>
            <a
              class="header-item"
              href="/assistant"
            >智能助理</a>
            <a
              class="header-item"
              href="/pdf-viewer"
            >PDF</a>
            <a
              class="header-item"
              href="/prompt"
            >  Prompt Kit  </a>
            <a
              class="header-item"
              href="/console/requirement/list"
            >控制台</a>
          </div>
          <div class="app-content">
            <router-view></router-view>
          </div>
        </div>
        <div class="speech-footer footer">
          <div class="footer-content">
            <div class="left-part">
              <div class="link-part item-part">
                <div class="part-title"> 友情链接 </div>
              </div>
              <div class="contact-part item-part">
              </div>
            </div>
            <div class="right-part">
              <el-button
                id="diagnosis-dialog-button"
                type="text"
                @click="showDiagnosis = true"
              >
                问题诊断
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="showDiagnosis">
      <electron-versions></electron-versions>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import logo from '/@/../assets/logo.svg';
import ElectronVersions from '/@/components/ElectronVersions.vue';

const showDiagnosis = ref(false);
</script>

<style lang="scss">
.home-page, .home-page-2 {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  font-size: 16px;
  font-family: "Soehne", system-ui, -apple-system, Helvetica Neue, Arial, sans-serif;
  color: #f0f0f0;
  .home-header {
    padding: 30px 40px;
    font-weight: bold;
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    .logo {
      width: 32px;
      margin-right: 8px;
    }
    .slogan {
      font-size: 22px;
      margin-right: 58px;
    }
    .header-item {
      margin-right: 54px;
      font-size: 17px;
    }
  }
  .home-content {
    position: relative;
  }
}
.speech-footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  .footer-content {
    display: flex;
    width: 100%;
    height: 250pt;
    background: #2e2f32;
    padding-left: 50pt;
    .left-part,.right-part {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: start;
     align-items: center;

    }
    .right-part {
      padding-right: 50px;
      justify-content: center;
      align-items: center;

    }
    .item-part {
      height: 100pt;
      width: 150pt;

      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .part-title {
        font-size: 16pt;
        font-weight: 400;
        color: #fff;
        text-align: left;
        margin-bottom: 12pt;
      }
      .part-link {
        font-size: 12pt;
        font-weight: 300;
        color: #fff;
        text-align: left;
        margin-bottom: 7pt;
        text-decoration: none;
      }
    }
    .qr-part {
      width: 300pt;
      height: 100pt;
      margin-right: 15pt;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .qr-img {
        width: 100pt;
        height: 100pt;
        border-style: solid;
        border-width: 2px 2px 2px 2px;
        border-color: #fff;
        background: #fff;
      }
      .qr-desc {
        width: 250pt;
        height: 100%;
        padding-left: 10pt;
        border-style: solid;
        border-width: 1px 1px 1px 0;
        border-color: hsla(0,0%,100%,.397);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .qr-desc-text {
          color: #fff;
          font-size: 11pt;
          text-align: left;
          line-height: 20pt;
        }
      }
    }
  }
}

.copyright {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #17181a;
  height: 65pt;
  padding-left: 70pt;
  font-size: 12pt;
  font-weight: 300;
  color: #fff;
  line-height: 20pt;
}


</style>
