import {defineComponent,ref} from 'vue';
export default defineComponent({
 setup(){return {menuOpen:ref(false),links:[{href:'/about',title:'О центре'},{href:'/services',title:'Услуги'},{href:'/specialists',title:'Специалисты'},{href:'/gallery',title:'Галерея'},{href:'/parents',title:'Родителям'},{href:'/contacts',title:'Контакты'}]};},
 methods:{toggleMenu(this:any){this.menuOpen=!this.menuOpen;},closeMenu(this:any){this.menuOpen=false;}}
});
