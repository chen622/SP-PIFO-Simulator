<template>
  <a-layout class="container">
    <a-layout-header
      :style="`background: #fff;padding: 0!important;line-height: ${headerHeight}px;z-index:233`"
    >
      <a-row class="header" type="flex" justify="space-between">
        <a-col :span="8">
          <h1 class="title">SP-PIFO Simulator</h1>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <a
            style="color: black"
            href="https://github.com/chen622/SP-PIFO-Simulator"
            target="_blank"
          >
            <github-outlined />
          </a>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content
      :style="`background: #fff;overflow: auto;padding: 20px 50px`"
    >
      <a-card :hoverable="true">
        <template v-slot:title>
          <span class="card-title">
            <setting-outlined style="margin-right: 5px" />
            Configuration
          </span>
        </template>
        <config-card @changeConfig="changeConfig" />
      </a-card>
      <a-card style="margin: 20px 0" :hoverable="true">
        <template v-slot:title>
          <span class="card-title">
            <play-square-outlined style="margin-right: 5px" />
            Result
          </span>
        </template>
        <a-empty
          image="https://i.loli.net/2021/03/28/K2WvekuqXBQiLlx.png"
          :image-style="{ height: '30vw' }"
          v-if="JSON.stringify(config) === '{}'"
          description="You should do basic configuration first!"
        />
        <result-card v-else :packages="config.packages" :queueAmount="config.queueAmount" :timeInterval="config.timeInterval" ref="resultCard"></result-card>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { GithubOutlined, PlaySquareOutlined, SettingOutlined} from "@ant-design/icons-vue";
import ConfigCard from "@/components/ConfigCard";
import ResultCard from "@/components/ResultCard";

export default {
  name: "App",
  components: {
    ConfigCard,
    ResultCard,
    GithubOutlined,
    PlaySquareOutlined,
    SettingOutlined,
  },
  data() {
    return {
      headerHeight: 64,
      config: {},
    };
  },
  methods: {
    changeConfig(config) {
      this.config = config;
      this.$nextTick(()=>{
        this.$refs.resultCard.apply()
      })
    },
  },
};
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
  overflow: hidden;
}

.header {
  width: 100vw;
  box-shadow: 0 2px 8px #e0e0e0;
  padding: 0 8%;
  font-size: 22px;
}

.title {
  margin: 0;
  font-size: 34px;
  font-weight: bold;
}

.card-title {
  font-size: 18px;
}
</style>
