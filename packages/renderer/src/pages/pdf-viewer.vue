<template>
  <div class="page-pdf-viewer">
    <div class="home-content">
      <div class="home-inner-img" />
      <div class="home-inner">
        <span class="inner-card">PDF</span>
        <div class="inner-bottom">
          <span>提升工作效率，创造更多价值，让每个人都享受高效、有趣、充实的科技生活</span>
        </div>
      </div>
    </div>
    <PdfDialog ref="pdfDialog"></PdfDialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import PdfDialog from '/@/components/PdfDialog.vue';
import ReActPdf from '/@/../assets/ReAct.pdf';

const pdfDialog = ref<any>(null);

onMounted(() => {
  pdfDialog.value?.getUrl(ReActPdf);
});
</script>

<style lang="scss" scoped>
.home-inner-img {
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  background: rgba(0,0,0,0.9);
  background-image: url('/assets/home_innerimg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
}
.home-video {
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  background: rgba(0,0,0,0.9);
  video {
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
  }
}
.home-inner {
  padding: 15% 0 0 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
  background: rgba(30, 28, 27, 0.7);
  .inner-card {
    display: inline-block;
    font-size: 60px;
    font-weight: bold;
    line-height: 0px;

  }
  .inner-bottom{
    display: inline-block;
    padding: 50px 0px;
    font-size: 20px;
    line-height: 50px;
    .fst{
      font-weight: bold;
    }
  }
  .inner-link {
    .first,.second {
      display: inline-block;
      font-size: 16px;
      margin-right: 54px;
      text-decoration: none;
      box-sizing: border-box;
      color: #fff;
    }
    .first {
      padding: 4px 12px;
      border: 1px solid #fff;
      &:hover {
        background: rgba(255, 255, 255, 0.85);
        color: #000;
      }
    }
    .second {
      padding: 2px 0px;
      border-bottom: 1px solid #fff;
      &:hover {
        border-bottom: 1px solid #666;
      }
    }
  }
}
.control-button {
  cursor: pointer;
  position: absolute;
  right: 40px;
  bottom: 30px;
  padding: 8px 18px;
  z-index: 10;
  font-weight: bold;
  &:hover {
    background: #fff;
    color: #333;
  }
}
</style>
