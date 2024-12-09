import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import IPAddressSearchInput from "./IPAddressSearchInput.vue";
import { fetchIpAddressInformation } from "../api";

vi.mock("../api", () => ({
  fetchIpAddressInformation: vi.fn(),
}));

vi.mock("country-flag-icons/unicode", () => ({
  default: vi.fn(() => "🇵🇱"),
}));

describe("IPAddressSearchInput", () => {
  it("renders correctly", () => {
    const wrapper = mount(IPAddressSearchInput, {
      props: {
        index: 0,
        modelValue: "",
      },
    });

    expect(wrapper.find(".ip-address-search-index").text()).toBe("1");
    expect(wrapper.find("input").attributes("disabled")).toBeUndefined();
  });

  it("Emits model value update when input changes", async () => {
    const wrapper = mount(IPAddressSearchInput, {
      props: {
        index: 1,
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("192.168.1.1");
    await input.trigger("blur");

    expect(wrapper.emitted()["update:modelValue"]).toEqual([["192.168.1.1"]]);
  });

  it("validates IPv4 addresses correctly", async () => {
    const wrapper = mount(IPAddressSearchInput, {
      props: {
        index: 0,
        modelValue: "192.168.1.1",
      },
    });

    expect(wrapper.vm.isValid).toBe(true);

    await wrapper.setProps({ index: 0, modelValue: "invalid-ip" });
    expect(wrapper.vm.isValid).toBe(false);
  });

  it("fetches IP information on blur with valid input", async () => {
    (fetchIpAddressInformation as vi.Mock).mockResolvedValueOnce({
      countryCode: "US",
      timezone: "America/New_York",
    });

    const wrapper = mount(IPAddressSearchInput, {
      props: {
        index: 0,
        modelValue: "192.168.1.1",
      },
    });

    const input = wrapper.find("input");
    await input.trigger("blur");

    expect(fetchIpAddressInformation).toHaveBeenCalledWith("192.168.1.1");
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".ip-address-search-flag").text()).toBe("🇵🇱");
  });

  it("shows an error message if fetching fails", async () => {
    const errorMessage = "Failed to fetch IP information";
    (fetchIpAddressInformation as vi.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const wrapper = mount(IPAddressSearchInput, {
      props: {
        index: 0,
        modelValue: "192.168.1.1",
      },
    });

    const input = wrapper.find("input");
    await input.trigger("blur");
    await wrapper.vm.$nextTick();

    expect(wrapper.find("span").text()).toBe(`Error: ${errorMessage}`);
  });

  it("disables the input when fetching", async () => {
    (fetchIpAddressInformation as vi.Mock).mockResolvedValueOnce({
      countryCode: "US",
      timezone: "America/New_York",
    });

    const wrapper = mount(IPAddressSearchInput, {
      props: {
        index: 0,
        modelValue: "192.168.1.1",
      },
    });

    expect(wrapper.vm.isFetching).toBe(false);

    const input = wrapper.find("input");
    input.trigger("blur");

    expect(wrapper.vm.isFetching).toBe(true);
  });

  it('emits "remove" event when the remove button is clicked', async () => {
    const wrapper = mount(IPAddressSearchInput, {
      props: {
        index: 1,
        modelValue: "",
      },
    });

    const removeButton = wrapper.find("button");
    await removeButton.trigger("click");

    expect(wrapper.emitted()["remove"]).toEqual([[]]);
  });
});
