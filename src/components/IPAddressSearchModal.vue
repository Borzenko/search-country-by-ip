<template>
  <div class="modal">
    <div class="modal-header">IP Lookup</div>
    <div class="modal-body">
      <div class="ip-address-search-title">
        <span>Enter one or more IP addresses to get their country</span>
        <button @click="inputs.push('')">
          <svg
            enable-background="new 0 0 50 50"
            height="50px"
            id="Layer_1"
            version="1.1"
            viewBox="0 0 50 50"
            width="50px"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <rect fill="none" height="50" width="50" />
            <line
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="4"
              x1="9"
              x2="41"
              y1="25"
              y2="25"
            />
            <line
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="4"
              x1="25"
              x2="25"
              y1="9"
              y2="41"
            />
          </svg>
          Add
        </button>
      </div>
      <div v-for="(value, index) in inputs" :key="index">
        <IPAddressSearchInput
          @remove="removeInput(index)"
          v-model="inputs[index]"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import IPAddressSearchInput from "./IPAddressSearchInput.vue";

const inputs = ref<Array<string>>([""]);

function removeInput(index: number) {
  inputs.value = inputs.value.filter((item, i) => i !== index);
}
</script>

<style lang="scss" scoped>
.modal {
  max-width: 560px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  padding: 10px 14px;
  font-weight: 700;
}

.modal-body {
  padding: 8px 14px;
}

.ip-address-search-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  padding-bottom: 12px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;

  span {
    display: inline-block;
    margin-bottom: 6px;
    opacity: 0.9;
  }

  button {
    width: auto;
    max-width: fit-content;
    border: none;
    outline: none;
    background: #1e88e5;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border-radius: 6px;
    padding: 4px 9px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 0.1s;

    &:hover {
      background: #1679d0;
    }

    svg {
      margin-right: 3px;
      width: 22px;
      height: 22px;
    }
  }
}
</style>
