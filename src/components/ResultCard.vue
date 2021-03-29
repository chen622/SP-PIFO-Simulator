<template>
  <a-row style="min-height: 400px" display="flex" justify="space-between">
    <a-col :span="9" :gutter="16" style="border-right: 1px dashed #ddd">
      <a-list
        :grid="{ gutter: 16, xs: 1, sm: 2, lg: 4 }"
        :data-source="remainedPackages"
      >
        <template #renderItem="{ item, index }">
          <a-list-item>
            <a-card
              class="package"
              :body-style="{ padding: '10px' }"
              :style="`background: ${$packageColor(item.size)};`"
            >
              <p :style="`font-weight: bold;`">
                <codepen-circle-filled/>
                #{{ finishAmount + 1 + index }}
              </p>
              <p>Size: {{ item.size }}</p>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
    <a-col :span="14">
      <a-list item-layout="horizontal" :data-source="queueList">
        <template #renderItem="{ item, index }">
          <a-list-item>
            <a-list-item-meta
            >
              <template #title>
                <a href="https://www.antdv.com/">{{ `Queue #${index + 1}` }}</a>
              </template>
              <template #description>
                <a-list
                  :grid="{ gutter: 16, xs: 1, sm: 2, lg: 4 }"
                  :data-source="item.list"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-card
                        class="package"
                        :body-style="{ padding: '10px' }"
                        :style="`background: ${$packageColor(item.size)};`"
                      >
                        <p :style="`font-weight: bold;`">
                          <codepen-circle-filled/>
                        </p>
                        <p>Size: {{ item.size }}</p>
                      </a-card>
                    </a-list-item>
                  </template>
                </a-list>
              </template>
              <template #avatar>
                <a-avatar :style="`color: ${$packageColor(item.bound)}!important`">{{ item.bound }}</a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
  </a-row>
</template>

<script>
import {CodepenCircleFilled} from "@ant-design/icons-vue";

export default {
  name: "ResultCard",
  props: {
    packages: {
      type: Array,
      required: true,
    },
    queueAmount: {
      type: Number,
      default: 8,
    },
    timeInterval: {
      type: Number,
      default: 1,
    },
  },
  components: {CodepenCircleFilled},
  computed: {
    remainedPackages() {
      return this.packages.slice(this.finishAmount);
    },
  },
  data() {
    return {
      finishAmount: 0,
      queueList: [],
    };
  },
  mounted() {
    for (let i = 0; i < this.queueAmount; i++) {
      this.queueList.push({bound: 0, list: []})
    }
  }
};
</script>

<style scoped>
.package {
  color: #fff;
  border-radius: 10px;
}

.package >>> p {
  font-size: 16px;
  font-weight: 500;
  margin: 4px 0;
}

.package >>> .anticon {
  font-size: 22px;
}
</style>
