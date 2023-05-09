import PdfDialog from '/@/components/PdfDialog.vue';
import './home.scss';
import logo from '/@/../assets/logo.svg';
import ReActPdf from '/@/../assets/ReAct.pdf';

export default {
  data() {
    return {
      playing: false,
    };
  },
  mounted() {
    // (this as any).startAutoplay();
    document.title = '智能助理';

    console.log('+++start load pdf');
    (this as any).$refs.pdfDialog.getUrl(ReActPdf)
  },
  methods: {
    startAutoplay() {
      (this as any).$refs.video.muted = true;
      const playAttempt = setInterval(() => {
        (this as any).$refs.video
          .play()
          .then(() => {
            clearInterval(playAttempt);
            (this as any).playing = true;
          })
          .catch(() => {
            console.log('play error need retry');
          });
        }, 500);
    },
    playOrPause() {
      if ((this as any).playing) {
        (this as any).$refs.video.pause();
      } else {
        (this as any).$refs.video.play();
      }
      (this as any).playing = !(this as any).playing;
    },
  },
  render() {
    return (
      <div class="outer-wrapper">
        <div class="home-page">
          <div class="home-header">
            <img class="logo" src={logo} alt="" />
            <span class="slogan">智能助理</span>
            <a target="_blank" class="header-item" href="/assistant">智能助理</a>
            <a target="_blank" class="header-item" href="/docs">文档中心</a>
            <a target="_blank" class="header-item" href="/prompt">  Prompt Kit  </a>
            <a target="_blank" class="header-item" href="/console/requirement/list">控制台</a>
          </div>
          <div class="home-content">
            <div class="home-inner-img"/>
            <div class="home-inner">
              <span class="inner-card">智能助理</span>
              <div class="inner-bottom">
              <br></br>
              <span>提升工作效率，创造更多价值，让每个人都享受高效、有趣、充实的科技生活</span>
              </div>
            </div>
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
          </div>
        </div>
        <PdfDialog ref="pdfDialog"></PdfDialog>
      </div>
    );
  },
};
