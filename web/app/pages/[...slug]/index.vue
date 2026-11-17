<template>
<div v-if="page" :class="{'home-page':page.kind==='home'}">
 <a class="skip-link" href="#main">К содержимому</a><SiteHeader/>
 <main id="main">
  <section :class="['hero',{'hero-home':page.kind==='home'}]">
   <div class="shell hero-layout">
    <div class="hero-copy">
     <div v-if="page.path!=='/'" class="breadcrumbs"><NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true"> / </span><span>{{page.eyebrow}}</span></div>
     <span class="eyebrow"><span class="little-dot" aria-hidden="true"></span>{{page.eyebrow}}</span>
     <h1><span v-for="(line,lineIndex) in page.heading.split('\n')" :key="lineIndex" :class="{'heading-accent':page.kind==='home' && lineIndex===1}">{{line}}<span v-if="lineIndex<page.heading.split('\n').length-1" class="heading-break"> </span></span></h1>
     <p class="hero-lead">{{page.lead}}</p>
     <div class="hero-actions"><a href="#callback" class="button">Записаться на знакомство <span aria-hidden="true">↗</span></a><NuxtLink v-if="page.kind==='home'" to="/about" class="text-link">О нашем подходе <span aria-hidden="true">↗</span></NuxtLink></div>
     <p v-if="page.demo" class="demo-label">Демонстрационный контент · требует подтверждения</p>
     <div v-if="page.kind==='home'" class="hero-footnote"><span class="footnote-line" aria-hidden="true"></span><p>Не нужно знать все ответы,<br>чтобы сделать первый шаг.</p></div>
    </div>
    <figure v-if="page.kind==='home'" class="hero-visual">
     <div class="hero-photo-wrap"><img class="hero-photo" src="/images/together-960.webp" srcset="/images/together-640.webp 640w, /images/together-960.webp 960w, /images/together-1440.webp 1440w" sizes="(max-width:700px) calc(100vw - 48px), (max-width:1100px) 46vw, 540px" width="960" height="640" alt="Иллюстративный образ занятия: взрослый и ребёнок вместе собирают деревянную пирамидку" fetchpriority="high"></div>
     <div class="art-caption" aria-hidden="true"><span>В своём ритме.</span><small>С поддержкой рядом.</small></div>
     <figcaption class="image-disclosure">Изображение создано ИИ для концепции сайта</figcaption>
    </figure>
   </div>
  </section>
  <div v-if="page.kind==='home'" class="values-strip"><div class="shell"><span><i aria-hidden="true">01</i> Внимание к особенностям</span><span><i aria-hidden="true">02</i> Партнёрство с семьёй</span><span><i aria-hidden="true">03</i> Бережное общение</span></div></div>
  <component :is="detailComponent" v-if="detailComponent"/>
  <section v-for="(section,index) in page.sections" :key="section.title" :class="['content-section',{'tinted':index%2===1,'approach-section':page.kind==='home' && index===1,'team-section':page.kind==='home' && index===2,'space-section':page.kind==='home' && index===3}]">
   <div class="shell">
    <figure v-if="page.kind==='home' && index===3" class="space-photo"><img src="/images/room-960.webp" srcset="/images/room-640.webp 640w, /images/room-960.webp 960w, /images/room-1440.webp 1440w" sizes="(max-width:700px) calc(100vw - 48px), 43vw" width="960" height="640" alt="Иллюстративный образ кабинета: светлая комната с деревянными игрушками" loading="lazy"><figcaption>ИИ-изображение для макета · не фото центра</figcaption></figure>
    <div class="section-intro"><span class="section-number">{{String(index+1).padStart(2,'0')}} /</span><div><h2>{{section.title}}</h2><p v-if="section.text" class="section-description">{{section.text}}</p></div></div>
    <div v-if="section.cards" :class="['cards',{single:section.cards.length===1}]">
     <article v-for="(card,cardIndex) in section.cards" :key="card.title" class="card">
      <span class="card-index">{{String(cardIndex+1).padStart(2,'0')}}<span aria-hidden="true">{{card.href ? '↗' : '—'}}</span></span>
      <span v-if="card.label" class="card-label">{{card.label}}</span><h3><NuxtLink v-if="card.href" :to="card.href">{{card.title}}</NuxtLink><template v-else>{{card.title}}</template></h3><p>{{card.text}}</p>
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
