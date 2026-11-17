import {defineComponent} from 'vue';
import {useHead} from '#imports';
export default defineComponent({props:['error'],created(){useHead({title:'Страница не найдена — Детка Плюс',meta:[{name:'robots',content:'noindex,nofollow'}]});}});
