<template>
  <div class="ip-address-search">
    <label :for="`input-${index}`" class="ip-address-search-index">{{
      index + 1
    }}</label>
    <input
      :id="`input-${index}`"
      :class="{ invalid: !isValid || fetchError }"
      :value="modelValue"
      @input="updateValue"
      @blur="handleBlur"
      type="text"
      :disabled="isFetching"
    />
    <template v-if="IPInfo">
      <div class="ip-address-search-flag">
        {{ getUnicodeFlagIcon(IPInfo.countryCode) }}
      </div>
      <div class="ip-address-search-time">
        {{ currentLocalDate }}
      </div>
    </template>
    <Loader v-if="isFetching" />
    <span v-if="fetchError">{{ fetchError }}</span>
    <button v-if="index != 0" @click="emit('remove')">Remove</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { fetchIpAddressInformation } from "../api";
import Loader from "./Loader.vue";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

const props = defineProps<{
  index: number;
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "remove"): void;
}>();

const IPInfo = ref<Awaited<
  ReturnType<typeof fetchIpAddressInformation>
> | null>(null);
const isFetching = ref(false);
const fetchError = ref<Error | null>(null);
const currentLocalDate = ref("");
const timer = ref<null | ReturnType<typeof setInterval>>(null);

const isValid = computed(() => {
  if (!props.modelValue.length) return true;
  return isIPv4(props.modelValue);
});

function updateValue(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value.trim());
}

function handleBlur() {
  fetchError.value = null;
  if (props.modelValue.length && isValid.value) {
    fetchApi(props.modelValue);
  } else {
    IPInfo.value = null;
  }
}

async function fetchApi(ip: string) {
  try {
    isFetching.value = true;
    clearTimer();
    IPInfo.value = await fetchIpAddressInformation(ip);
    runTimer();
  } catch (err) {
    fetchError.value = err as Error;
  } finally {
    isFetching.value = false;
  }
}

function isIPv4(val: string) {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
  return ipv4Regex.test(val);
}

function runTimer() {
  timer.value = setInterval(() => {
    currentLocalDate.value = getTimeZoneTime();
  });
}

function clearTimer() {
  if (timer.value) {
    clearInterval(timer.value);
  }
}

function getTimeZoneTime() {
  const now: Date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: IPInfo.value?.timezone,
  };

  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    "en-US",
    options
  );
  return formatter.format(now);
}

onBeforeUnmount(() => {
  clearTimer();
});

defineExpose({
  isValid,
  isFetching,
  emit,
});
</script>

<style lang="scss">
input {
  &.invalid {
    border: 1px solid red;
  }

  border-radius: 4px;
  border: 1px solid rgb(187, 187, 187);
  height: 30px;
  padding: 0 5px;
  margin-right: 5px;
}

.ip-address-search {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
  button {
    margin-left: auto;
    border: none;
    background: none;
    font-size: 10px;
    color: rgb(138, 138, 138);
    cursor: pointer;
  }
}

.ip-address-search-index {
  background: rgb(233, 232, 232);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
}

.ip-address-search-flag {
  font-size: 22px;
  width: 30px;
  height: 30px;
}
</style>
