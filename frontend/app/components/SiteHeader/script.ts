import {defineComponent,ref} from 'vue';
import {useRoute} from '#imports';
export default defineComponent({
 setup(){return {route:useRoute(),menuOpen:ref(false),links:[{href:'/about',title:'О центре'},{href:'/services',title:'Услуги'},{href:'/specialists',title:'Специалисты'},{href:'/gallery',title:'Галерея'},{href:'/parents',title:'Родителям'},{href:'/contacts',title:'Контакты'}]};},
 computed:{activeHref(this:any){return this.links.find((link:{href:string})=>this.route.path===link.href || this.route.path.startsWith(link.href+'/'))?.href;}},
 methods:{toggleMenu(this:any){this.menuOpen=!this.menuOpen;},closeMenu(this:any){this.menuOpen=false;}}
});
