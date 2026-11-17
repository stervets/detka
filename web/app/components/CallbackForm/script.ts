import {defineComponent,ref} from 'vue';
export default defineComponent({
 setup(){return {name:ref(''),phone:ref(''),comment:ref(''),consent:ref(false),website:ref(''),pending:ref(false),message:ref(''),failed:ref(false)};},
 methods:{
  async submit(this:any){
   if(this.pending)return;
   this.pending=true;this.message='';this.failed=false;
   try{
    const response=await fetch('/api/callbacks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:this.name,phone:this.phone,comment:this.comment,consent:this.consent,website:this.website})});
    const result=await response.json();
    if(!response.ok)throw new Error(typeof result.message==='string'?result.message:'Не удалось сохранить заявку. Попробуйте ещё раз.');
    this.message='Заявка сохранена. В рабочей версии с вами свяжется сотрудник центра.';
    this.name='';this.phone='';this.comment='';this.consent=false;
   }catch(error){this.failed=true;this.message=error instanceof Error?error.message:'Нет связи с сервером. Попробуйте позже.';}
   finally{this.pending=false;}
  }
 }
});
