<template>
  <a-form class="config-form" ref="formRef" layout="inline" :model="formState">
    <a-form-item label="Queue Amount">
      <a-input-number
        style="min-width: 200px"
        v-model:value="formState.queueAmount"
        :min="2"
        :max="10"
      />
    </a-form-item>
    <a-form-item label="Time Interval">
      <a-input-number
        style="min-width: 200px"
        v-model:value="formState.timeInterval"
        :min="0"
        :max="4"
        :step="0.2"
        :formatter="(value) => `${value} sec`"
        :parser="(value) => value.replace('sec', '')"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">Schedule</a-button>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="startTransmit">Transmit</a-button>
    </a-form-item>
    <br />
    <a-form-item
      label="Packets"
      class="package-info"
      :autoLink="false"
      style="margin: 10px 0"
    >
      <a-popover
        v-for="(pack, index) in formState.packages"
        :key="pack.id"
        placement="bottom"
      >
        <template #content>
          <div>
            <a-button
              :disabled="index === 0"
              shape="circle"
              style="margin-right: 10px"
              size="small"
              @click="movePackage(index, 'left')"
            >
              <template #icon>
                <left-outlined />
              </template>
            </a-button>
            <a-button
              :disabled="index === formState.packages.length - 1"
              shape="circle"
              size="small"
              @click="movePackage(index, 'right')"
            >
              <template #icon>
                <right-outlined />
              </template>
            </a-button>
          </div>
        </template>
        <a-tag
          :closable="true"
          @close="handleRemove(pack.id)"
          :color="$packageColor(pack.size)"
        >
          <div class="small">#{{ index + 1 }}</div>
          <div class="big">{{ pack.size }}</div>
        </a-tag>
      </a-popover>
      <a-input-number
        v-if="inputVisible"
        ref="newPackRef"
        :min="sizeRange.min"
        :max="sizeRange.max"
        :style="{ width: '78px' }"
        v-model:value="newPack"
        @keyup.enter="handleInputConfirm"
      />
      <a-tag
        v-else
        @click="showAddTag"
        style="background: #fff; border-style: dashed; font-size: 12px"
      >
        <plus-outlined />
        New Packet
      </a-tag>
    </a-form-item>
    <br />
    <a-form-item label="Distribution" class="distribution-items">
      <a-button @click="onSubmitRandom">Random</a-button>
      <a-button @click="onSubmitIncreasing">Increasing</a-button>
      <a-button @click="onSubmitDecreasing">Decreasing</a-button>
      <a-button @click="onSubmitWavingIn"
        >Increasing Waving</a-button
      >
      <a-button @click="onSubmitWavingDe"
        >Decreasing Waving</a-button
      >
      <a-button @click="onSubmitGaussian">Gaussian</a-button>
      <a-button @click="onSubmitPossion">Possion</a-button>
    </a-form-item>
    <a-form-item> </a-form-item>
    <a-form-item> </a-form-item>
    <a-form-item> </a-form-item>
    <a-form-item> </a-form-item>
    <a-form-item> </a-form-item>
    <a-form-item> </a-form-item>
  </a-form>
</template>

<script>
import {
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "ConfigCard",
  components: { PlusOutlined, LeftOutlined, RightOutlined },
  data() {
    return {
      inputVisible: false,
      newPack: 1,
      sizeRange: { min: 1, max: 100 },
      formState: {
        queueAmount: 3,
        timeInterval: 0,
        packages: [],
      },
    };
  },
  computed: {},
  methods: {
    onSubmit() {
      if (this.formState.packages.length < 1) {
        this.$message.error("Packets can not be empty");
        return;
      }
      this.$emit("changeConfig", this.formState);
    },
    startTransmit() {
      // TODO: check if the queue is empty (haven't been scheduled yet)
      if (this.formState.packages.length < 1){
        this.$message.error("Packets can not be empty");
        return;
      }
      this.$emit("resetConfig", this.formState);
    },
    onSubmitRandom() {
      const array = [];
      for (let index = 0; index < 100; index++) {
        array.push({ size: Math.round(Math.random() * 100), id: index, inversion: [], preemption: []});
      }
      this.formState.packages = array;
    },
    onSubmitIncreasing() {
      const array = [];
      for (let index = 0; index < 100; index++) {
        array.push({ size: index + 1, id: index, inversion: [], preemption: []});
      }
      this.formState.packages = array;
    },
    onSubmitDecreasing() {
      const array = [];
      for (let index = 0; index < 100; index++) {
        array.push({ size: 100 - index, id: index, inversion: [], preemption: []});
      }
      this.formState.packages = array;
    },
    onSubmitWavingIn() {
      const array = [];
      for (let index = 0; index < 50; index++) {
        array.push({ size: index + 1, id: index, inversion: [], preemption: []});
        array.push({ size: 100 - index, id: index, inversion: [], preemption: []});
      }
      this.formState.packages = array;
    },
    onSubmitWavingDe() {
      const array = [];
      for (let index = 0; index < 50; index++) {
        array.push({ size: 100 - index, id: index, inversion: [], preemption: []});
        array.push({ size: index + 1, id: index, inversion: [], preemption: []});
      }
      this.formState.packages = array;
    },
    onSubmitGaussian() {
      const array = [];
      const data = [
        45,
        48,
        65,
        68,
        68,
        10,
        84,
        22,
        37,
        88,
        71,
        89,
        89,
        13,
        59,
        66,
        40,
        88,
        47,
        89,
        82,
        38,
        26,
        78,
        73,
        10,
        21,
        81,
        70,
        80,
        48,
        65,
        83,
        89,
        50,
        30,
        20,
        20,
        15,
        40,
        33,
        66,
        10,
        58,
        33,
        32,
        75,
        24,
        36,
        76,
      ];
      for (let index = 0; index < 50; index++) {
        array.push({ size: data[index], id: index, inversion: [], preemption: []});
      }
      this.formState.packages = array;
    },
    onSubmitPossion() {
      const array = [];
      const data = [
        29,
        18,
        19,
        23,
        24,
        33,
        19,
        29,
        22,
        27,
        24,
        27,
        28,
        27,
        27,
        25,
        24,
        23,
        33,
        26,
        25,
        34,
        21,
        31,
        31,
        23,
        19,
        19,
        28,
        24,
        23,
        27,
        28,
        29,
        28,
        26,
        25,
        23,
        25,
        28,
        23,
        32,
        17,
        26,
        40,
        20,
        21,
        24,
        23,
        19,
      ];
      for (let index = 0; index < 50; index++) {
        array.push({ size: data[index], id: index, inversion: [], preemption: []});
      }
      this.formState.packages = array;
    },
    showAddTag() {
      this.inputVisible = true;
      this.newPack = 1;
      this.$nextTick(() => {
        this.$refs.newPackRef.focus();
      });
    },
    handleRemove(id) {
      this.formState.packages = this.formState.packages.filter(
        (pack) => pack.id !== id
      );
    },
    handleInputConfirm() {
      if (Number.isInteger(this.newPack)) {
        if (
          this.newPack >= this.sizeRange.min &&
          this.newPack <= this.sizeRange.max
        ) {
          this.formState.packages.push({ size: this.newPack, id: Date.now() });
          this.inputVisible = false;
        } else {
          this.$message.error(
            `Packet size should be between ${this.sizeRange.min}-${this.sizeRange.max}`
          );
        }
      } else {
        this.$message.error("Packet size should be an integer");
      }
    },
    movePackage(index, direction) {
      let newPackages = [];
      if (direction === "right") {
        newPackages.push(...this.formState.packages.slice(0, index));
        newPackages.push(
          this.formState.packages[index + 1],
          this.formState.packages[index]
        );
        newPackages.push(...this.formState.packages.slice(index + 2));
      } else {
        newPackages.push(...this.formState.packages.slice(0, index - 1));
        newPackages.push(
          this.formState.packages[index],
          this.formState.packages[index - 1]
        );
        newPackages.push(...this.formState.packages.slice(index + 1));
      }
      this.formState.packages = newPackages;
    },
  },
};
</script>

<style scoped>
.config-form >>> label {
  font-size: 16px !important;
}

.package-info >>> .ant-tag {
  font-size: 16px;
  line-height: 24px;
}

.package-info >>> .small {
  display: inline-block;
  font-size: 11px;
  line-height: 24px;
  font-weight: 300;
  width: 24px;
}

.package-info >>> .big {
  display: inline-block;
  text-align: right;
  font-weight: bold;
  margin: 0 4px 0 6px;
  width: 30px;
}

.package-info >>> .anticon-close {
  font-size: 14px;
}

.distribution-items >>> .ant-btn {
  margin-right: 10px
}
</style>