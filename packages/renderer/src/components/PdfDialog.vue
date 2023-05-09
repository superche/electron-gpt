<template>
  <el-dialog
    v-model="pdfjsView"
    title=""
    width="80%"
    class="cpdf"
    append-to-body
    @close="pdfurl = null"
  >
    <div
      v-if="pdfurl"
      v-loading="loading"
      class="center"
      style="height:600px"
    >
      <canvas
        v-for="data in canvasData"
        :id="'the-canvas-'+data"
        :key="data"
        class="canvasstyle"
      ></canvas>
    </div>
    <div
      v-else
      style="font-size:18px;text-align:center;font-weight:900"
    >
      没有PDF文件可以预览
    </div>
    <template #footer>
      <el-button @click="pdfjsView = false">取 消</el-button>
      <el-button
        type="primary"
        @click="pdfjsView = false"
      >
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import * as PDFJS from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import PDFWorkerUrl from 'pdfjs-dist/build/pdf.worker.js?url';

// INFO: pdfjs 文档对象，Vue3 的 reactive（ref）不兼容 pdfjs
let pdfDoc: any = '';

const pageNum = ref(1);
const pageRendering = ref(false);
const pageNumPending = ref(null);
const scale = ref(1.2); // 放大倍数
const page_num = ref(0); // 当前页数
const page_count = ref(0); // 总页数
// const maxscale = ref(2); // 最大放大倍数
// const minscale = ref(0.8); // 最小放大倍数
const canvasData = ref<number[]>([]);
const pdfjsView = ref(false);
const pdfurl = ref<any>(null);
const loading = ref(false);

defineExpose({
  getUrl,
});

function renderPage(num: number) {
  // 渲染pdf
  pageRendering.value = true;
  const canvas = document.getElementById(`the-canvas-${num}`) as any;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then((page: any) => {
    const viewport = page.getViewport({ scale: scale.value });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: canvas.getContext('2d'),
      viewport,
    };
    const renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(() => {
      pageRendering.value = false;
      if (pageNumPending.value !== null) {
        // New page rendering is pending
        renderPage(pageNumPending.value);
        pageNumPending.value = null;
      }
    });
  });
  page_num.value = pageNum.value;
}

function getUrl(url: any) {
  pdfurl.value = url;
  pdfjsView.value = true;
  showPDf();
}

function showPDf() {
  loading.value = true;
  canvasData.value = [];
  PDFJS.GlobalWorkerOptions.workerSrc = PDFWorkerUrl;
  const pdfLoadingTask = PDFJS.getDocument(pdfurl.value).promise;

  pdfLoadingTask.then((pdfDoc_) => {
    // 初始化pdf
    pdfDoc = pdfDoc_;
    page_count.value = pdfDoc.numPages;
    for (let i = 0; i < page_count.value; i += 1) {
      canvasData.value.push(i + 1);
    }
    return pdfDoc_;
  }).then((pdfDoc_) => {
    pdfDoc = pdfDoc_;
    page_count.value = pdfDoc.numPages;
    for (let i = 0; i < page_count.value; i += 1) {
      renderPage(i + 1);
    }
    loading.value = false;
  });
}
</script>

<style lang="scss" scoped type="text/css">
.cpdf {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  .center {
    text-align: center;
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    .contor {
      margin-bottom: 10px;
    }
  }
  .page-foot {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 56px;
    line-height: 56px;
    background-color: #fff;
    text-align: center;
    z-index: 10;
    .foot-button {
        display: inline-block;
        height: 56px;
        position: relative;
        top: -22px;
        left: 20px;
    }
  }
}
</style>
