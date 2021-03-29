import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);
app.config.productionTip = false;
app.config.globalProperties.$packageColor = function (size) {
    const times = size / 100
    let t = 0
    let upColor = { r: 0, g: 102, b: 153 }
    let lowColor = { r: 0, g: 153, b: 153 }
    const avgColor = (col1, col2, t) => {
        return {
            r: Math.round((col1.r - col2.r) * t + col2.r),
            g: Math.round((col1.g - col2.g) * t + col2.g),
            b: Math.round((col1.b - col2.b) * t + col2.b)
        }
    }

    if (times > 0.75) {
        t = (times - 0.75) / 0.25
    } else if (times > 0.5) {
        t = (times - 0.5) / 0.25
        upColor = { r: 0, g: 153, b: 153 }
        lowColor = { r: 153, g: 204, b: 0 }
    } else if (times > 0.25) {
        t = (times - 0.25) / 0.25
        upColor = { r: 153, g: 204, b: 0 }
        lowColor = { r: 255, g: 204, b: 0 }
    } else {
        t = times / 0.25
        upColor = { r: 255, g: 204, b: 0 }
        lowColor = { r: 255, g: 0, b: 51 }
    }
    let color = avgColor(upColor, lowColor, t)
    // console.log(size, lowColor)
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
},
    app.use(Antd);
app.mount('#app')