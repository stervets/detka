export type PublicationFields = { visible:boolean; sortOrder:number; updatedAt:string };
export type SeoFields = { title:string; description:string };
export type Employee = PublicationFields & { slug:string; name:string; position:string; biography:string; qualifications:string[]; photoId:string|null; serviceSlugs:string[] };
export type Service = PublicationFields & { slug:string; title:string; description:string; sections:{title:string;text:string}[]; employeeSlugs:string[]; seo:SeoFields };
export type Article = PublicationFields & { slug:string; title:string; sections:{title:string;text:string}[]; authorEmployeeSlug:string|null; reviewedAt:string|null; seo:SeoFields };
export type Media = PublicationFields & { id:string; type:'photo'|'video'; path:string; alt:string; width:number|null; height:number|null; recognizableChildren:boolean; permission:{status:'pending'|'verified'|'rejected'; evidenceReference:string|null; verifiedAt:string|null} };
export type Price = PublicationFields & { serviceSlug:string; amountRub:number; unit:string };
export type CenterSettings = { name:string; phone:string|null; hours:string|null; address:string; showPrices:boolean; logoMediaId:string|null };
export type BusinessCardTemplate = PublicationFields & { slug:string; name:string; layout:'botanical'|'minimal'; widthMm:number; heightMm:number; bleedMm:number; safeMm:number; front:{background:string}; back:{background:string} };
export type Callback = { id:number; name:string; phone:string; comment:string; consentVersion:string; consentAt:string; status:'new'|'contacted'|'closed'; notificationStatus:'pending'|'mock_sent'|'mock_failed' };
export function mayPublishMedia(media:Media) {
 return media.visible && (!media.recognizableChildren || (media.permission.status==='verified' && !!media.permission.evidenceReference && !!media.permission.verifiedAt));
}
