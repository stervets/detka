<template>
<div v-if="page" :class="{'home-page':page.kind==='home','gallery-page':page.kind==='gallery','contacts-page':page.kind==='contacts'}">
 <a class="skip-link" href="#main">К содержимому</a><SiteHeader/>
 <main id="main">
  <section :class="['hero',{'hero-home':page.kind==='home'}]">
   <div class="shell hero-layout">
    <div class="hero-copy">
     <div v-if="page.path!=='/'" class="breadcrumbs"><NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true"> / </span><span>{{page.eyebrow}}</span></div>
     <span class="eyebrow"><span class="little-dot" aria-hidden="true"></span>{{page.eyebrow}}</span>
     <h1><span v-for="(line,lineIndex) in page.heading.split('\n')" :key="lineIndex" :class="{'heading-accent':lineIndex===1}">{{line}}<span v-if="lineIndex<page.heading.split('\n').length-1" class="heading-break"> </span></span></h1>
     <p class="hero-lead">{{page.lead}}</p>
     <div class="hero-actions"><a href="#callback" class="button">Давайте познакомимся <span aria-hidden="true">↗</span></a><NuxtLink v-if="page.kind==='home'" to="/about" class="text-link">О нашем подходе <span aria-hidden="true">↗</span></NuxtLink></div>
    </div>
    <figure v-if="page.kind==='home'" class="hero-visual">
     <div class="hero-photo-wrap"><img class="hero-photo" src="/images/together-960.webp" srcset="/images/together-640.webp 640w, /images/together-960.webp 960w, /images/together-1440.webp 1440w" sizes="(max-width:700px) calc(100vw - 48px), (max-width:1100px) 46vw, 540px" width="960" height="640" alt="Взрослый и ребёнок вместе собирают деревянную пирамидку" fetchpriority="high"></div>
     <div class="art-caption"><span>В своём ритме.</span><small>С поддержкой рядом.</small></div>
    </figure>
   </div>
  </section>
  <div v-if="page.kind==='home'" class="values-strip"><div class="shell"><span>Внимание к особенностям</span><span>Партнёрство с семьёй</span><span>Бережное общение</span></div></div>
  <component :is="detailComponent" v-if="detailComponent"/>
  <section v-for="(section,index) in page.sections" :key="section.title" :class="['content-section',{'tinted':index%2===1,'section-with-image':section.image,'approach-section':page.kind==='home' && index===1,'team-section':page.kind==='home' && index===2,'space-section':page.kind==='home' && index===3}]">
   <div class="shell">
    <figure v-if="section.image" class="section-photo"><img :src="section.image" :alt="section.imageAlt || ''" width="1440" height="960" loading="lazy"></figure>
    <figure v-if="page.kind==='home' && index===3" class="space-photo"><img src="/images/room-960.webp" srcset="/images/room-640.webp 640w, /images/room-960.webp 960w, /images/room-1440.webp 1440w" sizes="(max-width:700px) calc(100vw - 48px), 43vw" width="960" height="640" alt="Светлая комната с деревянными игрушками" loading="lazy"></figure>
    <div class="section-intro"><div><h2>{{section.title}}</h2><p v-if="section.text" class="section-description">{{section.text}}</p></div></div>
    <div v-if="section.cards" :class="['cards',{single:section.cards.length===1}]">
     <article v-for="card in section.cards" :key="card.title" :class="['card',{'card-with-image':card.image}]">
      <NuxtLink v-if="card.image && card.href" :to="card.href" class="card-image-link"><img :src="card.image" :alt="card.imageAlt || card.title" width="960" height="640" loading="lazy"></NuxtLink>
      <img v-else-if="card.image" :src="card.image" :alt="card.imageAlt || card.title" width="560" height="700" loading="lazy">
      <span v-if="card.label" class="card-label">{{card.label}}</span><h3><NuxtLink v-if="card.href" :to="card.href">{{card.title}}</NuxtLink><template v-else>{{card.title}}</template></h3><p>{{card.text}}</p>
      <div v-if="card.paragraphs" class="card-paragraphs"><div v-for="paragraph in card.paragraphs" :key="paragraph.title"><h4>{{paragraph.title}}</h4><p>{{paragraph.text}}</p></div></div>
      <NuxtLink v-if="card.href" :to="card.href" class="card-more" :aria-label="'Подробнее: '+card.title">Подробнее <span aria-hidden="true">→</span></NuxtLink>
     </article>
    </div>
   </div>
  </section>
 </main>
 <CallbackForm v-if="page.kind!=='privacy'"/><div v-else id="callback" class="shell privacy-return"><NuxtLink to="/contacts#callback" class="button">К форме обратного звонка ↗</NuxtLink></div><SiteFooter/>
</div>
</template>
<script src="./script.ts" lang="ts"></script>
<style src="./style.less" lang="less"></style>
