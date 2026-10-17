import {useEffect} from 'react';
// Keep the provider's resize/message handling; submissions remain on its own service.
export function useFormEmbeds(content){
 useEffect(()=>{
  if(!content?.includes('api.leadconnectorhq.com'))return;
  if(document.getElementById('aestheticeye-form-embed'))return;
  const script=document.createElement('script');script.id='aestheticeye-form-embed';script.src='https://link.msgsndr.com/js/form_embed.js';script.async=true;document.body.append(script);
 },[content]);
}
