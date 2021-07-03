<template>
    <div :ref="box" :class="['cb-select', 'cb-select-open-' + visible, 'cb-select-disabled-' + disabled]">
        <div :ref="pre" class="cb-select-box" @click="show(!visible)">
            <slot name="placeholder">
                <div :class="['cb-select-placeholder', !labelSelected && 'cb-no-selected']">
                    {{ textSelected }}
                </div>
            </slot>
        </div>
        <div :ref="ul" class="cb-select-ul" v-show="visible">
            <slot name="top" />
            <div :ref="lis" class="cb-select-lis">
                <div
                    :class="['cb-select-li', css(data)]"
                    v-for="(data, i) in datas"
                    :key="i"
                    @click="select(data)"
                >
                    <slot name="li" :data="data">
                        {{ data[fleidText] }}
                    </slot>
                </div>
            </div>
            <slot name="bottom" />
        </div>
    </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
import { reactive, computed, watch, nextTick, onBeforeUnmount } from "vue";

export default {
    inheritAttrs: false,
    props: {
        datas: Array,
        multiple: Boolean,
        modelValue: [Number, String],
        placeholder: String,
        fleidValue: String,
        fleidText: String,
        disabled: Boolean
    },
    setup(props, { emit }) {
        const state = reactive({
            box: null,
            pre: null,
            ul: null,
            lis: null,
            show: false,
            popper: false,
        });

        const box = (el) => {
            state.box = el;
        };

        const pre = (el) => {
            state.pre = el;
        };

        const ul = (el) => {
            state.ul = el;
        };

        const lis = (el) => {
            state.lis = el;
        };

        const noParentPop = (el) => {
            if (!el) {
                return true;
            }
            if (el.localName == "body") {
                return true;
            }
            if (el === state.box) {
                return false;
            }
            return noParentPop(el.parentElement);
        };

        const clickOutside = (e) => {
            if (state.show && noParentPop(e.target)) {
                state.show = false;
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("click", clickOutside);
        }

        const visible = computed(() => state.show);
        watch(
            () => state.show,
            (bool) => {
                if (bool) {
                    state.popper.update();
                    nextTick(() => {
                        for (const n of state.lis.children) {
                            if (n.classList.contains("active")) {
                                state.lis.scrollTop =
                                    n.offsetTop -
                                    (state.lis.clientHeight / 2 -
                                        n.clientHeight / 2);
                            }
                        }
                    });
                }
            }
        );

        nextTick(() => {
            if (state.pre && state.ul) {
                state.popper = createPopper(state.pre, state.ul, {
                    placement: "bottom",
                    modifiers: [
                        {
                            name: "flip",
                            options: {
                                fallbackPlacements: ["top", "bottom"],
                            },
                        },
                    ],
                });
            }
        });

        onBeforeUnmount(() => {
            state.popper.destroy();
            window.removeEventListener("click", clickOutside);
        });

        const dataSelected = computed(() => {
            if (props.multiple) {
                return props.modelValue;
            } else {
                return [props.modelValue];
            }
        });

        const active = (d) => {
            return dataSelected.value.find((data) => data == d[props.fleidValue]);
        };

        const css = (d) => {
            const cs = [];
            if (active(d)) {
                cs.push("active");
            }
            if (d.disabled) {
                cs.push("disabled");
            }
            return cs;
        };

        const select = (d) => {
            if (props.disabled) return;
            if (d.disabled) return;
            if (props.multiple) {
                if (active(d)) {
                    props.modelValue.splice(props.modelValue.indexOf(d[props.fleidValue]), 1);
                } else {
                    props.modelValue.push(d[props.fleidValue]);
                }
            } else {
                emit("update:modelValue", d[props.fleidValue]);
                state.show = false;
            }
        };

        const labelSelected = computed(() => dataSelected.value
                .reduce((f, data) => {
                    const d = props.datas.find(d => d[props.fleidValue] == data)
                    if (d) {
                        f.push(d[props.fleidText])
                    }
                    return f
                }, [])
                .join(","))

        const textSelected = computed(() => {
            if (labelSelected.value) {
                return labelSelected.value;
            } else {
                return props.placeholder;
            }
        });

        const show = (bool) => {
            state.show = bool;
        };

        const update = () => {
            state.popper.update();
        };

        return {
            box,
            visible,
            pre,
            ul,
            lis,
            active,
            labelSelected,
            css,
            select,
            textSelected,
            show,
            update,
        };
    },
};
</script>
