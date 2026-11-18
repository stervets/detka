import {defineComponent,ref} from 'vue';
const phoneSlots=[4,5,6,9,10,11,13,14,16,17];
export default defineComponent({
 setup(){return {name:ref(''),phone:ref(''),comment:ref(''),consent:ref(false),website:ref(''),pending:ref(false),message:ref(''),failed:ref(false)};},
 methods:{
  setPhone(this:any,input:HTMLInputElement,digits:string,cursor:number){
   let digitIndex=0;
   this.phone='+7 (___) ___-__-__'.replace(/_/g,()=>digits[digitIndex++] || '_');
   input.value=this.phone;
   const position=phoneSlots[Math.min(cursor,9)]!+(cursor>=10?1:0);
   input.setSelectionRange(position,position);
  },
  focusPhone(this:any,event:FocusEvent){
   const input=event.target as HTMLInputElement;
   const digits=this.phone.replace(/\D/g,'').slice(1);
   this.setPhone(input,digits,digits.length);
  },
  blurPhone(this:any){if(!this.phone.replace(/\D/g,'').slice(1))this.phone='';},
  editPhone(this:any,event:InputEvent){
   const inserting=event.inputType==='insertText';
   const deleting=event.inputType==='deleteContentBackward' || event.inputType==='deleteContentForward';
   if(!event.cancelable || (!inserting && !deleting))return;
   event.preventDefault();
   const input=event.target as HTMLInputElement;
   const digits=this.phone.replace(/\D/g,'').slice(1);
   let start=Math.min(phoneSlots.filter(position=>position<(input.selectionStart ?? 0)).length,digits.length);
   let end=Math.min(phoneSlots.filter(position=>position<(input.selectionEnd ?? 0)).length,digits.length);
   let added=inserting?(event.data || '').replace(/\D/g,''):'';
   if(added.length>=11 && /^[78]/.test(added))added=added.slice(1);
   if(!digits && /^[78]$/.test(added)){this.setPhone(input,'',0);return;}
   if(inserting && !added)return;
   if(deleting && start===end){
    if(event.inputType==='deleteContentBackward')start=Math.max(0,start-1);
    else end=Math.min(digits.length,end+1);
   }
   const updated=(digits.slice(0,start)+added+digits.slice(end)).slice(0,10);
   this.setPhone(input,updated,Math.min(start+added.length,10));
  },
  inputPhone(this:any,event:Event){
   const input=event.target as HTMLInputElement;
   let digits=input.value.replace(/\D/g,'');
   if(digits.length>10 && /^[78]/.test(digits))digits=digits.slice(1);
   digits=digits.slice(0,10);
   this.setPhone(input,digits,digits.length);
  },
  pastePhone(this:any,event:ClipboardEvent){
   const text=event.clipboardData?.getData('text');
   if(!text)return;
   event.preventDefault();
   const input=event.target as HTMLInputElement;
   let pasted=text.replace(/\D/g,'');
   if(pasted.length>=11 && /^[78]/.test(pasted))pasted=pasted.slice(1);
   const digits=this.phone.replace(/\D/g,'').slice(1);
   const start=phoneSlots.filter(position=>position<(input.selectionStart ?? 0)).length;
   const end=phoneSlots.filter(position=>position<(input.selectionEnd ?? 0)).length;
   const updated=pasted.length>=10?pasted.slice(0,10):(digits.slice(0,start)+pasted+digits.slice(end)).slice(0,10);
   this.setPhone(input,updated,pasted.length>=10?10:Math.min(start+pasted.length,10));
  },
  async submit(this:any){
   if(this.pending)return;
   this.pending=true;this.message='';this.failed=false;
   try{
    const response=await fetch('/api/callbacks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:this.name,phone:this.phone,comment:this.comment,consent:this.consent,website:this.website})});
    const result=await response.json();
    if(!response.ok)throw new Error(typeof result.message==='string'?result.message:'Не удалось сохранить заявку. Попробуйте ещё раз.');
    this.message='Заявка сохранена. Спасибо за обращение!';
    this.name='';this.phone='';this.comment='';this.consent=false;
   }catch(error){this.failed=true;this.message=error instanceof Error?error.message:'Нет связи с сервером. Попробуйте позже.';}
   finally{this.pending=false;}
  }
 }
});
