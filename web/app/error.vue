<template><main class="shell error-page"><span class="eyebrow">Детка Плюс · {{error?.statusCode || 500}}</span><h1>{{error?.statusCode===404?'Такой страницы нет':'Не удалось открыть страницу'}}</h1><p>Перейдите на главную или найдите нужный раздел в меню.</p><a href="/" class="button">На главную ↗</a></main></template>
<script src="./error.ts" lang="ts"></script>
<style src="./error.less" lang="less"></style>
