import React, {useEffect,useRef,useState} from 'react';
export default function PaymentPlans(){
 const frame=useRef(null);const [height,setHeight]=useState(2100);
 useEffect(()=>{const resize=e=>{if(e.origin!==location.origin||e.source!==frame.current?.contentWindow||e.data?.type!=='aestheticeye-cherry-size')return;const h=Number(e.data.height);if(Number.isFinite(h)&&h>0)setHeight(Math.min(16000,Math.max(300,h+8)));};window.addEventListener('message',resize);return()=>window.removeEventListener('message',resize);},[]);
 return <section className="payment-plans-widget" aria-label="Payment options with Cherry"><iframe ref={frame} src="/integrations/cherry.html" title="AestheticEye Cherry payment plans, calculator, and frequently asked questions" style={{height}}/><p>Questions about payment options? <a href="tel:9379079009">Call (937) 907-9009</a>.</p></section>;
}
