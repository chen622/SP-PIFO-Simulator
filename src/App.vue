<template>
  <a-layout class="container">
    <a-layout-header style="background: #fff;padding: 0!important;position: absolute">
      <a-row class="header" type="flex" justify="space-between">
        <a-col :span="8">
          <h1 class="title">SP-PIFO Simulator</h1>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <a style="color: black" href="https://github.com/chen622/SP-PIFO-Simulator" target="_blank">
            <github-outlined/>
          </a>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content style="background: #fff;padding: 64px 10%">

    </a-layout-content>
  </a-layout>
</template>

<script>
import {
  GithubOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'App',
  components: {GithubOutlined},
  data() {
    return {
      current: ''
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  overflow: hidden;
  background: #fff;
}

.container {
  background: #fff;
  height: 100%;
}

.header {
  width: 100vw;
  line-height: 54px;
  box-shadow: 0 2px 8px #e0e0e0;
  padding: 0 8%;
  font-size: 22px;
}

.title {
  margin: 0;
  font-size: 34px;
  font-weight: bold;
}
</style>
