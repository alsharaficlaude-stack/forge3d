/* ============================================================================
   Forge3D — prototype auth + user store (localStorage only)
   NOTE: This is a FRONT-END PROTOTYPE. Data lives in this browser only and is
   not secure (localStorage is readable by anyone with the device). It exists to
   design the flows; a real backend (Supabase/Node) replaces this layer later.
   ========================================================================== */
const Forge = (function(){
  const UKEY="forge3d_users", SKEY="forge3d_session", EVK="forge3d_events";

  async function sha(str){
    if(window.crypto && crypto.subtle){
      try{
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
        return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
      }catch(e){ /* fall through */ }
    }
    // fallback for non-secure contexts (e.g. opened via file://) — prototype only
    let h1=0x811c9dc5, h2=0xc2b2ae35;
    for(let i=0;i<str.length;i++){ const c=str.charCodeAt(i);
      h1=Math.imul(h1^c,0x01000193); h2=Math.imul(h2^c,0x85ebca77); }
    return ("00000000"+(h1>>>0).toString(16)).slice(-8)+("00000000"+(h2>>>0).toString(16)).slice(-8);
  }
  function load(){ try{ return JSON.parse(localStorage.getItem(UKEY))||[]; }catch(e){ return []; } }
  function save(u){ localStorage.setItem(UKEY, JSON.stringify(u)); }
  function events(){ try{ return JSON.parse(localStorage.getItem(EVK))||[]; }catch(e){ return []; } }
  function logEvent(type,email){ const e=events(); e.push({type,email,t:Date.now()});
    if(e.length>5000) e.splice(0,e.length-5000); localStorage.setItem(EVK, JSON.stringify(e)); }
  function uid(){ return "u"+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
  const emailOK = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

  async function signup(name,email,password){
    email=(email||"").trim().toLowerCase();
    if(!emailOK(email)) throw new Error("Please enter a valid email address.");
    if((password||"").length<6) throw new Error("Password must be at least 6 characters.");
    const users=load();
    if(users.some(u=>u.email===email)) throw new Error("That email is already registered.");
    const user={ id:uid(), name:(name||"").trim()||email.split("@")[0], email,
      pass:await sha(password+"::"+email),
      role: users.length===0 ? "admin" : "user",   // first account is the admin
      createdAt:Date.now(), lastLogin:Date.now(), logins:1, disabled:false };
    users.push(user); save(users); logEvent("signup",email); setSession(user);
    return user;
  }
  async function login(email,password){
    email=(email||"").trim().toLowerCase();
    const users=load(), u=users.find(x=>x.email===email);
    if(!u) throw new Error("No account found with that email.");
    if(u.disabled) throw new Error("This account has been disabled. Contact an admin.");
    if(u.pass !== await sha(password+"::"+email)) throw new Error("Incorrect password.");
    u.lastLogin=Date.now(); u.logins=(u.logins||0)+1; save(users); logEvent("login",email); setSession(u);
    return u;
  }
  function setSession(u){ localStorage.setItem(SKEY, JSON.stringify({id:u.id,t:Date.now()})); }
  function current(){
    try{ const s=JSON.parse(localStorage.getItem(SKEY)); if(!s) return null;
      return load().find(u=>u.id===s.id) || null; }catch(e){ return null; }
  }
  function logout(){ localStorage.removeItem(SKEY); }

  /* admin / moderation ops */
  function update(id,patch){ const us=load(); const u=us.find(x=>x.id===id); if(u){ Object.assign(u,patch); save(us); } return u; }
  function remove(id){ save(load().filter(u=>u.id!==id)); }
  async function setPassword(id,pw){ const us=load(); const u=us.find(x=>x.id===id);
    if(u){ u.pass=await sha(pw+"::"+u.email); save(us); } return u; }
  function recordEvent(type){ const c=current(); logEvent(type, c?c.email:"(guest)"); }

  return { sha,load,save,events,logEvent,recordEvent,signup,login,logout,current,setSession,update,remove,setPassword,emailOK };
})();

/* tiny toast helper shared by pages */
function toast(msg,kind){
  let t=document.getElementById("toast");
  if(!t){ t=document.createElement("div"); t.id="toast"; document.body.appendChild(t); }
  t.textContent=msg; t.className="show "+(kind||"");
  clearTimeout(toast._t); toast._t=setTimeout(()=>{ t.className=(kind||""); },2400);
}
