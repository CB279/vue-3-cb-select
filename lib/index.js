import vSelect from "../components/v-select.vue";
import "../css/index.css";

export default {
    install(app) {
        app.component("vSelect", vSelect);
    }
};
