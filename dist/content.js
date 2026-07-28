(()=>{var y={};function v(e){y[e.id]=e}var M="pet-walker-overlay-",B="pet-walker-style-",b="pet-walker-launch-badge",O=20,$={speed:1,bottomOnly:!1,mode:"random"},r=null,g=null,u=null,t=null;function h(e){return Math.max(window.innerHeight-e-O,0)}function l(e,i,n){return Math.min(Math.max(e,i),n)}function T(e={}){return{speed:l(Number(e.speed)||$.speed,.25,3),bottomOnly:!!e.bottomOnly,mode:e.mode==="mouse"?"mouse":"random"}}function w(e){!t||Math.abs(e)<.05||(t.facing=e>=0?1:-1)}function F(){globalThis.__catWalkerMouseTracking||(globalThis.__catWalkerMouseTracking=!0,window.addEventListener("mousemove",e=>{t&&(t.mouseX=e.clientX,t.mouseY=e.clientY)}))}function P(e){let i=`${B}${e.id}`;if(document.getElementById(i))return;let n=document.createElement("style");n.id=i,n.textContent=e.getStyles(`${M}${e.id}`,e.size),(document.head||document.documentElement).appendChild(n)}function m(e){if(r&&r.isConnected)return r;P(e);let i=`${M}${e.id}`;return r=document.getElementById(i)||e.createElement(i),r.isConnected||(document.body||document.documentElement).appendChild(r),r}function A(e){let i=document.getElementById(b);i&&i.remove();let n=document.createElement("div");n.id=b,n.textContent=e.label,n.style.position="fixed",n.style.top="16px",n.style.right="16px",n.style.zIndex="2147483647",n.style.padding="8px 12px",n.style.borderRadius="999px",n.style.background="rgba(36, 28, 16, 0.96)",n.style.border="1px solid rgba(196, 174, 132, 0.55)",n.style.color="#fff1cb",n.style.font="600 13px/1.2 system-ui, sans-serif",n.style.pointerEvents="none",n.style.boxShadow="0 8px 18px rgba(0, 0, 0, 0.4)",(document.body||document.documentElement).appendChild(n),g!==null&&clearTimeout(g),g=setTimeout(()=>{n.remove(),g=null},1400)}function S(){u!==null&&(cancelAnimationFrame(u),u=null),r?.isConnected&&(r.classList.remove("is-sitting"),r.remove());let e=document.getElementById(b);e&&e.remove(),g!==null&&(clearTimeout(g),g=null),r=null,t=null}function L(e=0){if(!t)return;let{pet:i,behavior:n}=t,a=n==="sitting",s=a?0:Math.sin(e/140)*3,o=t.facing||1,c=0;if(!a){let f=t.vx||0,x=t.config.bottomOnly?0:t.vy||0,W=Math.atan2(x,Math.abs(f)||.01)*(180/Math.PI),z=o===1?-3:3;c=l(W*o+z,-35,35)}let d=a?.2:Math.min(1.8,Math.abs(t.vx||1)),p=m(i);p.style.transform=`translate(${t.x}px, ${t.y+s}px) rotate(${c}deg) scaleX(${o})`,p.style.setProperty("--pet-speed",d)}function H(e){let{size:i}=t.pet,n=Math.max(window.innerWidth-i,24);if(t.config.bottomOnly){t.x+=t.vx*e*t.config.speed,(t.x<=0||t.x>=n)&&(t.vx*=-1,t.x=l(t.x,0,n)),t.y+=(h(i)-t.y)*Math.min(.18*e,1),w(t.vx);return}let a=Math.max(window.innerHeight-i,24),s=t.x;t.x+=t.vx*e*t.config.speed,t.y+=t.vy*e*t.config.speed,(t.x<=0||t.x>=n)&&(t.vx*=-1,t.x=l(t.x,0,n)),(t.y<=0||t.y>=a)&&(t.vy*=-1,t.y=l(t.y,0,a)),w(t.x-s)}function D(e){let{size:i}=t.pet,n=Math.max(window.innerWidth-i,24),a=Math.max(window.innerHeight-i,24),s=l((t.mouseX??window.innerWidth/2)-i/2,0,n),o=t.config.bottomOnly?h(i):l((t.mouseY??window.innerHeight/2)-i/2,0,a),c=t.x,d=s-t.x,p=o-t.y,f=Math.hypot(d,p);if(f>.5){let x=t.config.speed*e;t.x+=d/f*Math.min(x,f),t.config.bottomOnly?t.y+=(o-t.y)*Math.min(.2*e,1):t.y+=p/f*Math.min(x,f)}t.x=l(t.x,0,n),t.y=l(t.y,0,a),w(t.x-c)}function k(){return 300+Math.random()*350}function j(e){if(t.config.mode==="mouse"){let{size:n}=t.pet,a=t.mouseX??window.innerWidth/2,s=t.mouseY??window.innerHeight/2,o=t.x+n/2,c=t.y+n/2,d=Math.hypot(a-o,s-c);if(t.behavior==="sitting"){t.mouseX!==null&&d>n*1.5&&(m(t.pet).classList.remove("is-sitting"),t.behavior="wandering");return}D(e),d<n*.6&&(t.behavior="sitting",m(t.pet).classList.add("is-sitting"));return}let{behavior:i}=t;if(i==="wandering"||i==="fleeing"){if(t.behaviorTimer-=e,t.behaviorTimer<=0)if(i==="wandering"){t.behavior="sitting",t.behaviorTimer=180+Math.random()*280,m(t.pet).classList.add("is-sitting");return}else t.behavior="wandering",t.behaviorTimer=k();H(e)}else if(i==="sitting"){if(t.mouseX!==null){let n=t.mouseX,a=t.mouseY,s=t.x+t.pet.size/2,o=t.y+t.pet.size/2;if(Math.hypot(n-s,a-o)<130){m(t.pet).classList.remove("is-sitting");let c=Math.atan2(o-a,s-n);t.vx=Math.cos(c)*(2+t.config.speed),t.vy=Math.sin(c)*(2+t.config.speed),t.behavior="fleeing",t.behaviorTimer=100+Math.random()*80;return}}t.behaviorTimer-=e,t.behaviorTimer<=0&&(m(t.pet).classList.remove("is-sitting"),t.behavior="wandering",t.behaviorTimer=k())}}function E(e={}){t&&(t.config=T(e),t.config.bottomOnly&&(t.y=Math.min(t.y,h(t.pet.size))))}function C(e){if(!t)return;t.lastTimestamp||(t.lastTimestamp=e);let i=Math.min((e-t.lastTimestamp)/16.67,2);t.lastTimestamp=e,j(i),L(e),u=requestAnimationFrame(C)}function Y(e,i=$){let n=y[e]??y.cat;if(u!==null){E(i);return}m(n);let{size:a}=n;t={pet:n,x:Math.max((window.innerWidth-a)/2,0),y:Math.max((window.innerHeight-a)/2,0),vx:2.2,vy:1.4,lastTimestamp:0,mouseX:null,mouseY:null,facing:1,config:T(i),behavior:"wandering",behaviorTimer:k()},t.config.bottomOnly&&(t.y=h(a)),F(),L(),A(n),u=requestAnimationFrame(C)}async function N(){let e=window.location.hostname;if(!e)return;let i=await chrome.storage.local.get([`${e}:catEnabled`,`${e}:catConfig`]);i[`${e}:catEnabled`]&&Y("cat",i[`${e}:catConfig`])}function X(){N(),window.addEventListener("resize",()=>{if(!t)return;let{size:e}=t.pet;t.x=Math.min(t.x,Math.max(window.innerWidth-e,0)),t.y=Math.min(t.y,Math.max(window.innerHeight-e,0)),t.config.bottomOnly&&(t.y=h(e))}),chrome.runtime.onMessage.addListener((e,i,n)=>{if(e.action==="ping"){n({ready:!0});return}if(e.action==="startCatWalker"){Y("cat",e.config),n({success:!0});return}if(e.action==="updateCatConfig"){E(e.config),n({success:!0});return}e.action==="stopCatWalker"&&(S(),n({success:!0}))})}var _={id:"cat",size:88,label:"Cat released",getStyles(e,i){return`
      #${e} {
        position: fixed;
        left: 16px;
        top: 24px;
        z-index: 2147483647;
        pointer-events: none;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${i}px;
        height: ${i}px;
        will-change: transform;
      }

      #${e} .cat-walker-svg {
        width: ${i}px;
        height: ${i}px;
        overflow: visible;
        filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
      }

      #${e} .cat-shadow {
        animation: cat-shadow-pulse 420ms ease-in-out infinite alternate;
        transform-origin: center;
      }

      #${e} .cat-body-group {
        animation: cat-body-bob 520ms cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        animation-duration: calc(520ms / var(--pet-speed, 1));
        transform-origin: center;
      }

      #${e} .cat-head {
        animation: cat-head-bob 520ms ease-in-out infinite alternate;
        transform-origin: center;
      }

      #${e} .cat-tail {
        animation: cat-tail-swish 900ms cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
        transform-origin: 31px 26px;
      }

      #${e} .cat-leg-fr,
      #${e} .cat-leg-bl,
      #${e} .cat-leg-fl,
      #${e} .cat-leg-br {
        transform-box: view-box;
      }

      #${e} .cat-leg-br {
        transform-origin: 36px 47px;
        animation: cat-leg-back 700ms ease-in-out infinite;
      }

      #${e} .cat-leg-bl {
        transform-origin: 45px 47px;
        animation: cat-leg-back 700ms ease-in-out infinite;
        animation-delay: -350ms;
      }

      #${e} .cat-leg-fr {
        transform-origin: 53px 48px;
        animation: cat-leg-front 700ms ease-in-out infinite;
      }

      #${e} .cat-leg-fl {
        transform-origin: 63px 48px;
        animation: cat-leg-front 700ms ease-in-out infinite;
        animation-delay: -350ms;
      }

      @keyframes cat-body-bob {
        0%   { transform: translateY(0) scaleY(1); }
        100% { transform: translateY(3px) scaleY(0.96); }
      }

      @keyframes cat-head-bob {
        0%   { transform: translateY(0); }
        100% { transform: translateY(1.5px); }
      }

      @keyframes cat-shadow-pulse {
        from { transform: scaleX(0.96); opacity: 0.28; }
        to { transform: scaleX(1.04); opacity: 0.18; }
      }

      @keyframes cat-tail-swish {
        0%   { transform: rotate(18deg); }
        50%  { transform: rotate(-10deg); }
        100% { transform: rotate(-22deg); }
      }

      @keyframes cat-leg-front {
        0%   { transform: rotate(-20deg); }
        25%  { transform: rotate(10deg) translateY(-2px); }
        50%  { transform: rotate(28deg); }
        75%  { transform: rotate(6deg); }
        100% { transform: rotate(-20deg); }
      }

      @keyframes cat-leg-back {
        0%   { transform: rotate(18deg); }
        25%  { transform: rotate(0deg); }
        50%  { transform: rotate(-22deg) translateY(2px); }
        75%  { transform: rotate(-6deg); }
        100% { transform: rotate(18deg); }
      }

      /* \u2500\u2500 Sitting pose \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
      #${e}.is-sitting .cat-leg-fr,
      #${e}.is-sitting .cat-leg-fl {
        animation: cat-leg-sit-front 3s ease-in-out infinite alternate;
      }

      #${e}.is-sitting .cat-leg-br,
      #${e}.is-sitting .cat-leg-bl {
        animation: cat-leg-sit-back 3s ease-in-out infinite alternate;
      }

      #${e}.is-sitting .cat-body-group {
        animation: cat-body-sit 2.5s ease-in-out infinite alternate;
      }

      #${e}.is-sitting .cat-tail {
        animation: cat-tail-sit 2.8s ease-in-out infinite alternate;
        transform-origin: 31px 26px;
      }

      @keyframes cat-leg-sit-front {
        from { transform: rotate(72deg); }
        to   { transform: rotate(68deg); }
      }

      @keyframes cat-leg-sit-back {
        from { transform: rotate(-68deg); }
        to   { transform: rotate(-72deg); }
      }

      @keyframes cat-body-sit {
        0%   { transform: translateY(5px) scaleY(0.91); }
        100% { transform: translateY(7px) scaleY(0.89); }
      }

      @keyframes cat-tail-sit {
        from { transform: rotate(-25deg); }
        to   { transform: rotate(-45deg); }
      }
    `},createElement(e){let i=document.createElement("div");return i.id=e,i.setAttribute("aria-hidden","true"),i.innerHTML=`
      <svg class="cat-walker-svg" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" role="presentation">
        <ellipse class="cat-shadow" cx="45" cy="69" rx="18" ry="5" fill="rgba(0, 0, 0, 0.28)" />
        <g class="cat-body-group">
          <path class="cat-tail" d="M31 27 C19 18, 12 27, 18 37 C22 43, 16 49, 10 45" fill="none" stroke="#cba6f7" stroke-width="5" stroke-linecap="round" />
          <g class="cat-leg-br">
            <path d="M36 47 Q35 56 33 65" stroke="#a87fd4" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <ellipse cx="32" cy="66.5" rx="5.5" ry="2.5" fill="#f2cdcd"/>
          </g>
          <g class="cat-leg-bl">
            <path d="M45 47 Q44 56 42 65" stroke="#a87fd4" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <ellipse cx="41" cy="66.5" rx="5" ry="2.5" fill="#f2cdcd"/>
          </g>
          <ellipse cx="46" cy="38" rx="18" ry="12.5" fill="#cba6f7" />
          <g class="cat-head">
            <ellipse cx="52" cy="34" rx="13" ry="11" fill="#cba6f7" />
            <path d="M44 28 L48 18 L52 28 Z" fill="#a87fd4" />
            <path d="M54 28 L58 18 L62 28 Z" fill="#a87fd4" />
            <path d="M46.5 27.5 L48.4 22.5 L50.3 27.5 Z" fill="#f5c2e7" />
            <path d="M55.7 27.5 L57.6 22.5 L59.5 27.5 Z" fill="#f5c2e7" />
            <circle cx="50" cy="33" r="1.4" fill="#1e1e2e" />
            <circle cx="57.5" cy="33" r="1.4" fill="#1e1e2e" />
            <path d="M52.8 36.5 Q54 38 55.2 36.5" stroke="#1e1e2e" stroke-width="1.5" fill="none" stroke-linecap="round" />
            <path d="M52.8 36.5 L50 37.5" stroke="#1e1e2e" stroke-width="1.2" stroke-linecap="round" />
            <path d="M55.2 36.5 L58 37.5" stroke="#1e1e2e" stroke-width="1.2" stroke-linecap="round" />
            <path d="M49 36.5 L44 35.5" stroke="#e8d5f8" stroke-width="1" stroke-linecap="round" />
            <path d="M49 38 L44 39.5" stroke="#e8d5f8" stroke-width="1" stroke-linecap="round" />
            <path d="M59 36.5 L64 35.5" stroke="#e8d5f8" stroke-width="1" stroke-linecap="round" />
            <path d="M59 38 L64 39.5" stroke="#e8d5f8" stroke-width="1" stroke-linecap="round" />
          </g>
          <g class="cat-leg-fr">
            <path d="M53 48 Q55 57 57 65" stroke="#a87fd4" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <ellipse cx="58" cy="66.5" rx="5.5" ry="2.5" fill="#f2cdcd"/>
          </g>
          <g class="cat-leg-fl">
            <path d="M63 48 Q65 57 67 65" stroke="#a87fd4" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <ellipse cx="68" cy="66.5" rx="5" ry="2.5" fill="#f2cdcd"/>
          </g>
        </g>
      </svg>
    `,i}};globalThis.__catWalkerLoaded||(globalThis.__catWalkerLoaded=!0,v(_),X());})();
