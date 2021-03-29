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
      <a-button type="primary" @click="onSubmit">Random Distribution</a-button>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmitIncreasing">Increasing Distribution</a-button>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmitDecreasing">Decreasing Distribution</a-button>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmitWavingIn">Increasing Waving Distribution</a-button>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmitWavingDe">Decreasing Waving Distribution</a-button>
    </a-form-item>
    <br/>
    <a-form-item
      label="Packages"
      class="package-info"
      :autoLink="false"
      style="margin-top: 10px"
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
                <left-outlined/>
              </template>
            </a-button>
            <a-button
              :disabled="index === formState.packages.length - 1"
              shape="circle"
              size="small"
              @click="movePackage(index, 'right')"
            >
              <template #icon>
                <right-outlined/>
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
          <div class="big"> {{ pack.size }}</div>
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
        <plus-outlined/>
        New Package
      </a-tag>
    </a-form-item>
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
  components: {PlusOutlined, LeftOutlined, RightOutlined},
  data() {
    return {
      inputVisible: false,
      newPack: 1,
      sizeRange: {min: 1, max: 100},
      formState: {
        queueAmount: 3,
        timeInterval: 1,
        packages: [],
      },
    };
  },
  computed: {},
  methods: {
    onSubmit() {
      if (this.formState.packages.length < 1) {
        this.$message.error("Packages can not be empty");
        return;
      }
      this.$emit("changeConfig", this.formState);
    },
    onSubmitIncreasing() {
      const array = [];
      for (let index = 0; index < 100; index++) {
        array.push({size: index + 1, id: index});
      }
      this.formState.packages = array;

      if (this.formState.packages.length < 1) {
        this.$message.error("Packages can not be empty");
        return;
      }
      this.$emit("changeConfig", this.formState);
    },
    onSubmitDecreasing() {
      const array = [];
      for (let index = 0; index < 100; index++) {
        array.push({size: 100 - index, id: index});
      }
      this.formState.packages = array;

      if (this.formState.packages.length < 1) {
        this.$message.error("Packages can not be empty");
        return;
      }
      this.$emit("changeConfig", this.formState);
    },
    onSubmitWavingIn() {
      const array = [];
      for (let index = 0; index < 50; index++) {
        array.push({size: index + 1, id: index});
        array.push({size: 100 - index, id: index});
      }
      this.formState.packages = array;

      if (this.formState.packages.length < 1) {
        this.$message.error("Packages can not be empty");
        return;
      }
      this.$emit("changeConfig", this.formState);
    },
    onSubmitWavingDe() {
      const array = [];
      for (let index = 0; index < 50; index++) {
        array.push({size: 100 - index, id: index});
        array.push({size: index + 1, id: index});
      }
      this.formState.packages = array;

      if (this.formState.packages.length < 1) {
        this.$message.error("Packages can not be empty");
        return;
      }
      this.$emit("changeConfig", this.formState);
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
          this.formState.packages.push({size: this.newPack, id: Date.now()});
          this.inputVisible = false;
        } else {
          this.$message.error(
            `Package size should between ${this.sizeRange.min}-${this.sizeRange.max}`
          );
        }
      } else {
        this.$message.error("Package size should be a integer");
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
  mounted() {
    const array = [];
    for (let index = 0; index < 100; index++) {
      array.push({size: Math.round(Math.random() * 100), id: index});
    }
    this.formState.packages = array;
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
  width: 24px
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
</style>