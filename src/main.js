import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);
app.config.productionTip = false;
app.config.globalProperties.$packageColor = function (size) {
    let color = "#aaa";
    switch (size) {
        case 1:
            color = "#FF0033";
            break;
        case 2:
            color = "#FFCC00";
            break;
        case 3:
            color = "#99CC00";
            break;
        case 4:
            color = "#009999";
            break;
        case 5:
            color = "#006699";
            break;
    }
    return color;
},
    app.use(Antd);
app.mount('#app')