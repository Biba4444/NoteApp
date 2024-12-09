(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))d(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&d(i)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function d(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}})();const s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));function q(e,t=0){return(s[e[t+0]]+s[e[t+1]]+s[e[t+2]]+s[e[t+3]]+"-"+s[e[t+4]]+s[e[t+5]]+"-"+s[e[t+6]]+s[e[t+7]]+"-"+s[e[t+8]]+s[e[t+9]]+"-"+s[e[t+10]]+s[e[t+11]]+s[e[t+12]]+s[e[t+13]]+s[e[t+14]]+s[e[t+15]]).toLowerCase()}let L;const O=new Uint8Array(16);function P(){if(!L){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");L=crypto.getRandomValues.bind(crypto)}return L(O)}const f={};function b(e,t,r){let d;{const o=Date.now(),n=P();A(f,o,n),d=N(n,f.msecs,f.nsecs,f.clockseq,f.node,t,r)}return t?d:q(d)}function A(e,t,r){return e.msecs??(e.msecs=-1/0),e.nsecs??(e.nsecs=0),t===e.msecs?(e.nsecs++,e.nsecs>=1e4&&(e.node=void 0,e.nsecs=0)):t>e.msecs?e.nsecs=0:t<e.msecs&&(e.node=void 0),e.node||(e.node=r.slice(10,16),e.node[0]|=1,e.clockseq=(r[8]<<8|r[9])&16383),e.msecs=t,e}function N(e,t,r,d,o,n,i=0){n||(n=new Uint8Array(16),i=0),t??(t=Date.now()),r??(r=0),d??(d=(e[8]<<8|e[9])&16383),o??(o=e.slice(10,16)),t+=122192928e5;const u=((t&268435455)*1e4+r)%4294967296;n[i++]=u>>>24&255,n[i++]=u>>>16&255,n[i++]=u>>>8&255,n[i++]=u&255;const p=t/4294967296*1e4&268435455;n[i++]=p>>>8&255,n[i++]=p&255,n[i++]=p>>>24&15|16,n[i++]=p>>>16&255,n[i++]=d>>>8|128,n[i++]=d&255;for(let l=0;l<6;++l)n[i++]=o[l];return n}const T=document.querySelector("#rightContainer"),$=async()=>await(await fetch("http://localhost:3000/api/data")).json(),j=async e=>{try{const t=await fetch("http://localhost:3000/api/data-add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){console.error(`Error: ${t.status} - ${t.statusText}`);return}const r=await t.json();console.log("Successfully added:",r)}catch(t){console.error("An error occurred while posting data",t)}},B=async e=>{try{const t=await fetch("http://localhost:3000/api/data-change",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){console.error(`Error: ${t.status} - ${t.statusText}`);return}}catch(t){console.error("An error occurred while posting data",t)}},k=async e=>{try{const t=await fetch("http://localhost:3000/api/data-delete",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e})});if(!t.ok){console.error(`Error: ${t.status} - ${t.statusText}`);return}const r=await t.json();console.log("Successfully deleted:",r)}catch(t){console.error("An error occurred while deleting data",t)}};let M,C;(async()=>{let e=1,t=await $(),r;const d=3;if(!t){console.log("Data is not found");return}const o=()=>{if(!T){console.error("rightContainer not found in the DOM!");return}T.innerHTML="",C=(e-1)*d;const l=Math.min(C+d,t.length);M=t.slice(C,l),M.map(a=>{const c=document.createElement("div"),h=b();c.classList.add("note-block"),c.setAttribute("id",h),c.setAttribute("data-id",a.id),c.innerHTML=`
        <div class="noteDiv1">
          <p class="pMainText">${a.title}</p>
          <div class="divDescrText">${a.description}</div>
        </div>
        <div class="noteDiv2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
        class="redactImage"/></svg>
          <img 
            width="20px" 
            height="20px" 
            src="https://img.icons8.com/ios-glyphs/30/multiply.png" 
            alt="multiply"
            class="noteImage"
          />
        </div>
        <dialog id="editDialog">
        <div id="dialogContainer">
    <form method="dialog">
        <div id="dialogGap">
        <label for="editInput">Edit note:</label>
        <input type="text" id="editInput" />
        <input type="text" id="editDescription" />
        <div>
        <div id="dialogButtons">
        <menu>
        <button value="cancel">Decline</button>
        <button value="confirm">Save</button>
        </menu>
        <div>
        <div>
    </form>
</dialog>
      `;const m=c.querySelector(".noteImage");m&&m.addEventListener("click",async()=>{const w=a.id;await k(w),t=t.filter(y=>y.id!==a.id),o()});const g=c.querySelector(".redactImage");g&&g.addEventListener("click",()=>{const w=a.id,y=c.querySelector("#editDialog"),D=c.querySelector("#editInput"),S=c.querySelector("#editDescription");if(!y||!D||!S){console.error("Dialog or input elements not found.");return}D.value=a.title,S.value=a.description,y.showModal(),y.addEventListener("close",async()=>{if(y.returnValue==="confirm"){const v=D.value.trim(),x=S.value.trim();if(v&&x){a.title=v,a.description=x,await B({id:w,title:v,description:x});const E=c.querySelector(".pMainText"),I=c.querySelector(".divDescrText");E&&(E.textContent=v),I&&(I.textContent=x)}else console.log("Both fields must be filled.")}},{once:!0})}),T.appendChild(c)}),n()},n=()=>{const l=document.querySelector("#pagination");if(!l){console.error("Pagination container not found!");return}l.innerHTML="";const a=Math.max(1,Math.ceil(t.length/d));if(t.length===0)return;if(e>a){e=a,o();return}const c=document.createElement("button");c.textContent="Previous",c.disabled=e===1,c.addEventListener("click",()=>{e=Math.max(1,e-1),o(),n()}),l.appendChild(c);for(let m=1;m<=a;m++){const g=document.createElement("button");g.textContent=m.toString(),g.disabled=m===e,g.addEventListener("click",()=>{e=m,o(),n()}),l.appendChild(g)}const h=document.createElement("button");h.textContent="Next",h.disabled=e===a,h.addEventListener("click",()=>{e=Math.min(a,e+1),o(),n()}),l.appendChild(h)},i=document.querySelector("#noteSubmit"),u=document.querySelector("#noteInput"),p=document.querySelector("#noteDescription");i&&u&&p?i.addEventListener("click",async l=>{l.preventDefault(),u.value.length>0&&p.value.length>0?(r={id:b(),title:u.value,description:p.value},t.push(r),await j(r),o(),u.value="",p.value=""):console.log("Write your note firstly")}):console.error("Required elements are missing in the DOM!"),o()})();
