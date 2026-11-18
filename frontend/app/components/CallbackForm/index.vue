<template>
<section id="callback" class="callback-section"><div class="shell callback-layout">
 <div class="callback-copy"><span class="eyebrow">Первый шаг — разговор</span><h2>Давайте<br><em>познакомимся</em></h2><p>Оставьте номер — сотрудник центра свяжется с вами, ответит на вопросы и обсудит знакомство.</p><p class="small">Это заявка на обратный звонок. Дата, формат и стоимость встречи согласуются лично.</p><img src="/images/botanical-640.webp" width="640" height="427" alt="" loading="lazy" class="callback-sprig"></div>
 <form @submit.prevent="submit" class="callback-form">
  <img class="callback-girl" src="/images/logo-girl.webp" width="480" height="320" alt="" aria-hidden="true" loading="lazy">
  <div class="field-row"><label>Ваше имя<input v-model="name" name="name" autocomplete="given-name" minlength="2" maxlength="80" required placeholder="Как к вам обращаться"></label><label>Телефон<input :value="phone" @focus="focusPhone" @blur="blurPhone" @beforeinput="editPhone" @input="inputPhone" @paste="pastePhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" pattern="\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}" title="Введите номер полностью: +7 (999) 123-45-67" required placeholder="+7 (___) ___-__-__"></label></div>
  <label>Комментарий <span class="optional">· необязательно</span><textarea v-model="comment" name="comment" maxlength="1000" rows="3" placeholder="О чём вы хотели бы спросить?"></textarea></label>
  <p class="small">Не указывайте медицинские сведения и данные ребёнка.</p>
  <label class="honeypot" aria-hidden="true">Сайт<input v-model="website" name="website" tabindex="-1" autocomplete="off"></label>
  <label class="consent"><input v-model="consent" type="checkbox" required><span>Соглашаюсь на обработку имени, телефона и комментария для обратного звонка. <NuxtLink to="/privacy">Условия обработки</NuxtLink></span></label>
  <button class="button" :disabled="pending" type="submit">{{ pending ? 'Сохраняем заявку…' : 'Заказать обратный звонок' }} <span aria-hidden="true">↗</span></button>
  <p v-if="message" role="status" :class="['form-message',{error:failed}]">{{ message }}</p>
  <noscript><p>Для отправки формы включите JavaScript. Адрес центра доступен на странице контактов.</p></noscript>
 </form>
</div></section>
</template>
<script src="./script.ts" lang="ts"></script>
<style src="./style.less" lang="less"></style>
