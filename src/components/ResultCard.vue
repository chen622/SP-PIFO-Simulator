<template>
  <div>
    <a-row style="min-height: 400px" type="flex" justify="space-between">
      <a-col :span="9" :gutter="16" style="border-right: 1px dashed #ddd; padding-right: 10px">
        <a-list
          :grid="{ gutter: 16, xs: 1, sm: 2, lg: 4 }"
          :locale="{ emptyText: 'No more packages' }"
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
                  <codepen-circle-filled />
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
              <a-row type="flex" style="width: 100%">
                <a-col flex="50px">
                  <div
                    class="bound-text"
                    :style="`background: ${$packageColor(item.bound)}`"
                  >
                    {{ item.bound }}
                  </div>
                  <div
                      :style="`background: ${$packageColor(item.minRank)}`"
                  >
                    minRank:{{ item.minRank }}
                  </div>
                </a-col>
                <a-col flex="auto">
                  <p
                    style="
                      font-weight: bold;
                      font-size: 16px;
                      line-height: 30px;
                      text-align: right;
                    "
                  >
                    {{ `Queue #${index + 1}` }}
                  </p>
                  <a-list
                    :locale="{ emptyText: 'Empty list' }"
                    :grid="{ gutter: 4, xs: 1, sm: 2, lg: 16 }"
                    :data-source="item.list"
                    class="queue"
                  >
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-card
                          class="package-small"
                          :body-style="{ padding: '2px' }"
                          :style="`background: ${$packageColor(item.size)};`"
                        >
                          <!-- <p :style="`font-weight: bold;`">
                            <codepen-circle-filled />
                          </p> -->
                          <p>{{ item.size }}</p>
                        </a-card>
                      </a-list-item>
                    </template>
                  </a-list>
                </a-col>
              </a-row>
            </a-list-item>
          </template>
        </a-list>
      </a-col>
    </a-row>
    <a-popover v-for="(item, i) in queueList" :key="i">
      <li>Queue{{i+1}}</li>
      <a-popover v-for="(pkt, j) in item.list" :key="j">
        R{{pkt.size}}:{{pkt.inversion}} {{pkt.preemption}}&#12288;;
      </a-popover>
      <li class="divider" role="presentation"></li>
    </a-popover>
  </div>
</template>


<script>
import { CodepenCircleFilled } from "@ant-design/icons-vue";

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
  components: { CodepenCircleFilled },
  computed: {
    remainedPackages() {
      return this.packages.slice(this.finishAmount);
    },
  },
  data() {
    return {
      finishAmount: 0,
      queueList: [],
      timer: null,
    };
  },
  methods: {
    popPackage() {
      if (this.finishAmount >= this.packages.length) {
        clearInterval(this.timer);
        return;
      }
      const item = this.packages[this.finishAmount];
      this.finishAmount++;
      // push up
      for (let i = this.queueList.length - 1; i >= 0; i--) {
        if (item.size >= this.queueList[i].bound) {
          this.queueList[i].list.push(item);
          this.queueList[i].bound = item.size;
          // update the queue's minRank
          if (item.size < this.queueList[i].minRank){
            this.queueList[i].minRank = item.size;
          }
          return;
        }
      }
      // push down
      // when pkt's rank < 1st queue bound
      this.queueList[0].list.push(item);
      // update the queue's minRank
      if (item.size < this.queueList[0].minRank){
        this.queueList[0].minRank = item.size;
      }
      // decrease all queue bounds by cost = q1-rank
      for (let i = this.queueList.length - 1; i >= 0; i--) {
        this.queueList[i].bound -= this.queueList[0].bound - item.size;
      }
    },
    apply() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.queueList = [];
      this.finishAmount = 0;
      for (let i = 0; i < this.queueAmount; i++) {
        this.queueList.push({ bound: 0, list: [], minRank: 100});
      }
      this.timer = setInterval(this.popPackage, this.timeInterval * 1000);
    },
    transmit() {
      // queue from up to down
      for (let i = 0; i < this.queueAmount; i++){
        // transmit pkts in a queue
        for (let j = 0; j < this.queueList[i].list.length; j++){
          const currentPkt = this.queueList[i].list[j];
          // record inversions in the current queue
          for (let m = j + 1; m < this.queueList[i].list.length; m++) {
            // inversion occurs
            if (currentPkt.size > this.queueList[i].list[m].size) {
              // update the inversion array of the queue
              this.queueList[i].list[m].inversion.push(currentPkt.size - this.queueList[i].list[m].size);
              this.queueList[i].list[m].preemption.push(currentPkt.size);
            }
          }
          // record inversions in lower queues
          for (let n = i + 1; n < this.queueAmount; n++) {
            // inversion occurs
            if (this.queueList[n].minRank < currentPkt.size) {
              // travers to update the inversion array of the queue
              for (let k = 0; k < this.queueList[n].list.length; k++) {
                if (currentPkt.size > this.queueList[n].list[k].size){
                  this.queueList[n].list[k].inversion.push(currentPkt.size - this.queueList[n].list[k].size);
                  this.queueList[n].list[k].preemption.push(currentPkt.size);
                }
              }
            }
          }
        }
      }
    },
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
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

.package-small {
  color: #fff;
  border-radius: 5px;
}

.package-small >>> p {
  font-size: 12px;
  font-weight: 500;
  margin: 4px 0;
  text-align: center;
}

.bound-text {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  text-align: center;
  line-height: 30px;
  font-size: 18px;
  color: #fff;
}

.queue >>> .ant-row {
  flex-direction: row-reverse;
}
</style>
