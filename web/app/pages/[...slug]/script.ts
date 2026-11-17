import {defineComponent} from 'vue';
import {useRoute,useRuntimeConfig,useHead,createError,definePageMeta} from '#imports';
import snapshot from '@content';
import type {SiteContent,Page} from '../../../../shared/content';
import SiteHeader from '../../components/SiteHeader/index.vue';
import SiteFooter from '../../components/SiteFooter/index.vue';
import CallbackForm from '../../components/CallbackForm/index.vue';
import PageContacts from '../../components/PageContacts/index.vue';
import PageGallery from '../../components/PageGallery/index.vue';
const detailComponents:Record<string,unknown>={contacts:PageContacts,gallery:PageGallery};
definePageMeta({
 validate: route => snapshot.pages.some(page => page.path === (route.path.replace(/\/$/,'') || '/'))
});
const content=snapshot as SiteContent;
export default defineComponent({
 components:{SiteHeader,SiteFooter,CallbackForm},
 setup(){return {route:useRoute(),config:useRuntimeConfig(),settings:content.settings};},
 computed:{
  page(this:any):Page|undefined{return content.pages.find(page=>page.path===(this.route.path.replace(/\/$/,'')||'/'));},
  detailComponent(this:any){return detailComponents[this.page?.kind];}
 },
 created(){
  if(!this.page)throw createError({statusCode:404,statusMessage:'Страница не найдена'});
  useHead(()=> {
   const page=this.page!;
   const canonical=this.config.public.siteUrl+page.path;
   const schema:Record<string,unknown>={'@context':'https://schema.org','@type':page.kind==='article'?'Article':'WebPage',name:page.title,description:page.description,url:canonical,inLanguage:'ru'};
   const graph:Record<string,unknown>[]=[schema];
   if(page.path==='/')graph.push({'@type':'LocalBusiness','@id':this.config.public.siteUrl+'/#center',name:'Детка Плюс',url:this.config.public.siteUrl,logo:this.config.public.siteUrl+'/images/logo-384.webp',address:{'@type':'PostalAddress',addressLocality:'Липецк',streetAddress:'улица Циолковского, 32/3',postalCode:'398043',addressCountry:'RU'},geo:{'@type':'GeoCoordinates',latitude:52.609204,longitude:39.569692}});
   return {title:page.title,meta:[{name:'description',content:page.description},{name:'robots',content:this.config.public.indexable?'index,follow':'noindex,nofollow'},{property:'og:title',content:page.title},{property:'og:description',content:page.description},{property:'og:url',content:canonical},{property:'og:type',content:page.kind==='article'?'article':'website'},{property:'og:locale',content:'ru_RU'},{property:'og:site_name',content:'Детка Плюс'},{property:'og:image',content:this.config.public.siteUrl+'/social-card.png'},{property:'og:image:width',content:'1200'},{property:'og:image:height',content:'630'},{property:'og:image:alt',content:'Детка Плюс — помощь особенным детям и поддержка семьи в Липецке'}],link:[{rel:'canonical',href:canonical}],script:[{type:'application/ld+json',innerHTML:JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}]};
  });
 }
});
