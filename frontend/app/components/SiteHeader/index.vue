<template>
<header class="site-header">
 <div class="shell header-inner">
  <NuxtLink to="/" class="brand" aria-label="Детка Плюс — главная"><img src="/images/logo-transparent-192.webp" srcset="/images/logo-transparent-192.webp 1x, /images/logo-transparent-384.webp 2x" width="144" height="144" alt="Детка Плюс"><span class="brand-note">Центр коррекции<br>и развития детей<span>Липецк</span></span></NuxtLink>
  <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="main-nav" @click="toggleMenu">{{ menuOpen ? 'Закрыть ×' : 'Меню ☰' }}</button>
  <nav id="main-nav" :class="{open:menuOpen}" aria-label="Основная навигация">
   <NuxtLink v-for="link in links" :key="link.href" :to="link.href" :class="{selected:activeHref===link.href}" :aria-current="activeHref===link.href ? (route.path===link.href ? 'page' : 'location') : undefined" @click="closeMenu">{{ link.title }}</NuxtLink>
  </nav>
  <a href="#callback" class="header-cta" @click="closeMenu">Обратный звонок <span aria-hidden="true">↗</span></a>
 </div>
</header>
</template>
<script src="./script.ts" lang="ts"></script>
<style src="./style.less" lang="less"></style>
