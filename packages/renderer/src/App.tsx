import logo from '/@/assets/logo.svg';

export default {
  render() {
    if (['/'].includes(window.location.pathname)) {
      return (
        <div id="app" class="dark">
          <router-view></router-view>
        </div>
      );
    }
    return (
      <div id="app" class="dark">
        <div class="app-header">
          <div class="cursor-pointer header-item" onClick={() => {
            (this as any).$router.push({
              path: '/index',
            });
          }}>
            <img
              draggable="false" onDragstart={() => void 0}
              src={logo}
              class="logo-img"
              alt="logo"
            />
            <div class="logo-desc">智能助理</div>
          </div>
          {(this as any).$route.query.debug ? <div class="header-item" style="flex: 1;font-size: 12px">
            <span class="ml12 mr-4">版本号：{(window as any).webVersion}</span>
          </div> : null}
          <div class="header-item header-right tar" style="flex: 1;font-size: 12px">
            <router-link to="/">
              <span class="ml8 cursor-pointer" >大模型生成应用平台</span>
            </router-link>
            <a class="ml12" href="about:blank">文档中心</a>
            <router-link to="/calc">
              <span class="ml8 cursor-pointer">token计算器</span>
            </router-link>
          </div>
        </div>
        <div class="app-content">
          <router-view></router-view>
        </div>
      </div>
    );
  },
};
