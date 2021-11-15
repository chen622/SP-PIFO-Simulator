<template>
  <v-chart class="chart" :option="option"></v-chart>
</template>

<script>
import ECharts from 'vue-echarts'
import {use} from "echarts/core";

import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  LineChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent
]);

export default {
  name: "InversionCard",
  components: {'v-chart': ECharts},
  data() {
    return {
      option: null,
    }
  },
  methods: {
    changeData(packages) {
      let x = [], y = []
      packages.sort((a, b) => a.size - b.size)
      packages.forEach((pkt) => {
        x.push(pkt.size)
        let tempY = 0
        pkt.inversion.forEach(i => tempY += i)
        console.log(tempY, pkt.inversion)
        y.push(tempY)
      })
      this.option = {
        xAxis: {
          type: 'category',
          name: 'rank',
          data: x
        },
        yAxis: {
          name: 'magnitude',
          type: 'value'
        },
        series: [{
          data: y,
          type: 'line',
          smooth: true,

        }]
      }
    }
  }
}
</script>

<style scoped>
.chart {
  width: calc(100% - 150px);
  height: 500px;
}
</style>