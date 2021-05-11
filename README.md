# Other

> <a href="https://github.com/CB279/vue-3-cb-validate">validate</a>

> <a href="https://github.com/CB279/vue-3-cb-alert">alert</a>

> <a href="https://github.com/CB279/vue-3-cb-modal">modal</a>

> <a href="https://github.com/CB279/vue-3-cb-datepicker">datepicker</a>

> <a href="https://github.com/CB279/vue-3-cb-grid">grid</a>

> <a href="https://github.com/CB279/vue-3-cb-sidenav">sidenav</a>

> <a href="https://github.com/CB279/vue-3-cb-paginate">paginate</a>

## Development

npm install @vue-cb/select

## Config

```js
import select from "@vue-cb/select";

createApp(app).use(select);
```

## Usage

```html
<v-select v-model="state.val" :datas="state.ops" placeholder="เลือก" />
```

```js
const state = reactive({
    val: null,
    ops: [
        { value: "s1", label: "s1" },
        { value: "s2", label: "s2" },
        { value: "s3", label: "s3" },
        { value: "s4", label: "s4" },
        { value: "s5", label: "s5" },
        { value: "s6", label: "s6" },
    ],
});
```

## Props

| name        | value   | default |
| ----------- | ------- | ------- |
| datas       | array   | -       |
| multiple    | boolean | -       |
| placeholder | string  | -       |

## 📑 License

[MIT License](./LICENSE)
