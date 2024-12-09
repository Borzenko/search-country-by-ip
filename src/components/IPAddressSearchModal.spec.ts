import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import IPAddressSearchModal from "./IPAddressSearchModal.vue";
import IPAddressSearchInput from "./IPAddressSearchInput.vue";

describe("IPAddressSearchModal", () => {
  it("Component Render", () => {
    const wrapper = mount(IPAddressSearchModal);

    expect(wrapper.find(".modal-header").text()).toBe("IP Lookup");
    expect(wrapper.find(".ip-address-search-title span").text()).toBe(
      "Enter one or more IP addresses to get their country"
    );
    expect(wrapper.findAllComponents(IPAddressSearchInput)).toHaveLength(1);
  });

  it('Adds new input fields when the "Add" button is clicked', async () => {
    const wrapper = mount(IPAddressSearchModal);

    const addButton = wrapper.find("button");
    await addButton.trigger("click");
    await addButton.trigger("click");

    const inputs = wrapper.findAllComponents(IPAddressSearchInput);
    expect(inputs).toHaveLength(3);
  });

  it('Removes the correct input field when "remove" is emitted', async () => {
    const wrapper = mount(IPAddressSearchModal);

    const addButton = wrapper.find("button");
    await addButton.trigger("click");
    await addButton.trigger("click");

    let inputs = wrapper.findAllComponents(IPAddressSearchInput);
    expect(inputs).toHaveLength(3);

    await inputs[0].vm.$emit("remove");
    await wrapper.vm.$nextTick();

    inputs = wrapper.findAllComponents(IPAddressSearchInput);
    expect(inputs).toHaveLength(2);

    expect(wrapper.vm.inputs).toEqual(["", ""]);
  });
});
