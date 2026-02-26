
// ============================================================
// DEMO ACCOUNT (built-in, không lưu localStorage)
// ============================================================
const DEMO = {
  id: 'demo',
  fullname: 'Học Sinh Demo',
  email: 'demo@studyai.vn',
  password: 'demo123',
  gender: 'male',
  avatar: null, // set after AVATARS defined
  isDemo: true,
  data: null // set in initDemo()
};

function initDemoData() {
  const today = new Date();
  const dates = [];
  for(let i=6;i>=0;i--){const d=new Date();d.setDate(today.getDate()-i);dates.push(d.toDateString());}
  DEMO.data = {
    subjects:[
      {id:1,name:'Toán',score:5.5},
      {id:2,name:'Văn',score:7.0},
      {id:3,name:'Anh',score:4.0},
      {id:4,name:'Lý',score:6.5},
      {id:5,name:'Hóa',score:3.5}
    ],
    schedule:{
      1:{mon:{time:'18:00',duration:90,completed:true},wed:{time:'18:00',duration:90,completed:false},fri:{time:'18:00',duration:90,completed:true}},
      2:{tue:{time:'19:30',duration:60,completed:true},thu:{time:'19:30',duration:60,completed:false},sat:{time:'09:00',duration:60,completed:true}},
      3:{mon:{time:'20:30',duration:90,completed:false},wed:{time:'20:30',duration:90,completed:true},fri:{time:'20:30',duration:90,completed:false},sat:{time:'14:00',duration:90,completed:true}},
      4:{tue:{time:'18:00',duration:60,completed:true},thu:{time:'18:00',duration:60,completed:false}},
      5:{wed:{time:'17:00',duration:90,completed:true},sat:{time:'10:30',duration:90,completed:false},sun:{time:'10:00',duration:90,completed:true}}
    },
    exams:[
      {id:1,name:'Thi Học Kỳ I',date:new Date(today.getFullYear(),today.getMonth()+1,15).toISOString().split('T')[0]},
      {id:2,name:'Kiểm tra Toán',date:new Date(today.getFullYear(),today.getMonth(),today.getDate()+10).toISOString().split('T')[0]}
    ],
    timeSlots:{mon:'17:00-21:00',tue:'18:00-21:00',wed:'17:00-21:00',thu:'18:00-21:00',fri:'18:00-21:00',sat:'08:00-15:00',sun:'09:00-12:00'},
    streak:{cur:7,longest:12,total:18,lastDate:today.toDateString(),dates,freezes:2,achievements:['s3','s7']},
    messages:[
      {type:'success',title:'🎉 Hoàn thành xuất sắc!',content:'Bạn đã hoàn thành 3/3 buổi học hôm qua! 🌟',date:new Date(today-864e5).toDateString()},
      {type:'warning',title:'⚠️ Chưa hoàn thành hết',content:'Hôm kia bạn còn 2 buổi chưa học xong!',date:new Date(today-2*864e5).toDateString()}
    ],
    missedDays:0,lastCheck:null
  };
  DEMO.avatar = AVATARS[0];
}

// ============================================================
// STORAGE
// ============================================================
let users = [];
let CU = null;
const KEY_USERS = 'sai_users_v2';
const KEY_SESSION = 'sai_session_v2';

function loadStore(){ try{users=JSON.parse(localStorage.getItem(KEY_USERS)||'[]');}catch(e){users=[];} }
function saveStore(){
  if(!CU || CU.isDemo) return; // never save demo to localStorage
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
}
function saveSession(){ if(CU) localStorage.setItem(KEY_SESSION, CU.id+''); }
function clearSession(){ localStorage.removeItem(KEY_SESSION); }
function D(){ return CU ? CU.data : null; }
function emptyData(){
  return{subjects:[],schedule:{},exams:[],timeSlots:{},streak:{cur:0,longest:0,total:0,lastDate:null,dates:[],freezes:0,achievements:[]},messages:[],missedDays:0,lastCheck:null};
}

// ============================================================
// AVATARS
// ============================================================
const AVATARS = [
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23667eea"/%3E%3Ccircle cx="50" cy="38" r="18" fill="%23FFDBAC"/%3E%3Cpath d="M35 32 Q35 22 50 22 Q65 22 65 32 L65 40 Q65 46 50 46 Q35 46 35 40Z" fill="%233B241F"/%3E%3Ccircle cx="43" cy="38" r="2.5" fill="%23333"/%3E%3Ccircle cx="57" cy="38" r="2.5" fill="%23333"/%3E%3Cpath d="M43 47 Q50 51 57 47" stroke="%23333" stroke-width="1.5" fill="none"/%3E%3Crect x="35" y="58" width="30" height="28" rx="4" fill="%234285F4"/%3E%3Crect x="25" y="58" width="11" height="22" rx="5.5" fill="%23FFDBAC"/%3E%3Crect x="64" y="58" width="11" height="22" rx="5.5" fill="%23FFDBAC"/%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23FF90BC"/%3E%3Ccircle cx="50" cy="38" r="18" fill="%23FFDBAC"/%3E%3Cellipse cx="50" cy="28" rx="22" ry="18" fill="%236A4C2E"/%3E%3Ccircle cx="72" cy="33" r="8" fill="%236A4C2E"/%3E%3Ccircle cx="43" cy="38" r="2.5" fill="%23333"/%3E%3Ccircle cx="57" cy="38" r="2.5" fill="%23333"/%3E%3Cpath d="M43 47 Q50 51 57 47" stroke="%23333" stroke-width="1.5" fill="none"/%3E%3Crect x="35" y="58" width="30" height="28" rx="4" fill="%23FFE4E1"/%3E%3Crect x="25" y="58" width="11" height="22" rx="5.5" fill="%23FFDBAC"/%3E%3Crect x="64" y="58" width="11" height="22" rx="5.5" fill="%23FFDBAC"/%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%2334d399"/%3E%3Ccircle cx="50" cy="38" r="18" fill="%23D4A574"/%3E%3Cpath d="M35 32 Q35 24 50 24 Q65 24 65 32 L65 40 Q65 46 50 46 Q35 46 35 40Z" fill="%23000"/%3E%3Ccircle cx="43" cy="38" r="2.5" fill="%23333"/%3E%3Ccircle cx="57" cy="38" r="2.5" fill="%23333"/%3E%3Cpath d="M44 47 Q50 50 56 47" stroke="%23333" stroke-width="1.5" fill="none"/%3E%3Crect x="35" y="58" width="30" height="28" rx="4" fill="%23FF6B35"/%3E%3Crect x="25" y="58" width="11" height="22" rx="5.5" fill="%23D4A574"/%3E%3Crect x="64" y="58" width="11" height="22" rx="5.5" fill="%23D4A574"/%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23a78bfa"/%3E%3Ccircle cx="50" cy="38" r="18" fill="%23F5CBA7"/%3E%3Cpath d="M34 27 Q34 18 50 20 Q66 18 66 27 L66 38 Q62 46 50 46 Q38 46 34 38Z" fill="%23D4A017"/%3E%3Ccircle cx="43" cy="38" r="2.5" fill="%23333"/%3E%3Ccircle cx="57" cy="38" r="2.5" fill="%23333"/%3E%3Cpath d="M44 47 Q50 51 56 47" stroke="%23333" stroke-width="1.5" fill="none"/%3E%3Crect x="35" y="58" width="30" height="28" rx="4" fill="%23EC4899"/%3E%3Crect x="25" y="58" width="11" height="22" rx="5.5" fill="%23F5CBA7"/%3E%3Crect x="64" y="58" width="11" height="22" rx="5.5" fill="%23F5CBA7"/%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f59e0b"/%3E%3Ccircle cx="50" cy="38" r="18" fill="%23F5D5B8"/%3E%3Cpath d="M37 30 Q40 24 50 25 Q60 24 63 30 L63 40 Q60 46 50 46 Q40 46 37 40Z" fill="%23FFA500"/%3E%3Ccircle cx="43" cy="38" r="2.5" fill="%23333"/%3E%3Ccircle cx="57" cy="38" r="2.5" fill="%23333"/%3E%3Cpath d="M44 47 Q50 51 56 47" stroke="%23333" stroke-width="1.5" fill="none"/%3E%3Crect x="35" y="58" width="30" height="28" rx="4" fill="%23DC2626"/%3E%3Crect x="25" y="58" width="11" height="22" rx="5.5" fill="%23F5D5B8"/%3E%3Crect x="64" y="58" width="11" height="22" rx="5.5" fill="%23F5D5B8"/%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%2306b6d4"/%3E%3Ccircle cx="50" cy="38" r="18" fill="%23C68642"/%3E%3Cpath d="M35 33 Q37 26 50 26 Q63 26 65 33 L64 41 Q62 46 50 46 Q38 46 36 41Z" fill="%23654321"/%3E%3Ccircle cx="43" cy="38" r="2.5" fill="%23333"/%3E%3Ccircle cx="57" cy="38" r="2.5" fill="%23333"/%3E%3Cpath d="M44 47 Q50 50 56 47" stroke="%23333" stroke-width="1.5" fill="none"/%3E%3Crect x="35" y="58" width="30" height="28" rx="4" fill="%2322c55e"/%3E%3Crect x="25" y="58" width="11" height="22" rx="5.5" fill="%23C68642"/%3E%3Crect x="64" y="58" width="11" height="22" rx="5.5" fill="%23C68642"/%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23fb7185"/%3E%3Ccircle cx="50" cy="38" r="18" fill="%23D4A574"/%3E%3Cpath d="M34 29 Q36 22 50 23 Q64 22 66 29 L65 41 Q62 46 50 46 Q38 46 35 41Z" fill="%23000"/%3E%3Ccircle cx="43" cy="38" r="2.5" fill="%23333"/%3E%3Ccircle cx="57" cy="38" r="2.5" fill="%23333"/%3E%3Cpath d="M44 47 Q50 51 56 47" stroke="%23333" stroke-width="1.5" fill="none"/%3E%3Crect x="35" y="58" width="30" height="28" rx="4" fill="%2322d3ee"/%3E%3Crect x="25" y="58" width="11" height="22" rx="5.5" fill="%23D4A574"/%3E%3Crect x="64" y="58" width="11" height="22" rx="5.5" fill="%23D4A574"/%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%2310b981"/%3E%3Ccircle cx="50" cy="38" r="18" fill="%23F5D5B8"/%3E%3Cpath d="M36 31 Q37 23 50 24 Q63 23 64 31 L63 40 Q61 46 50 46 Q39 46 37 40Z" fill="%23FFB6C1"/%3E%3Ccircle cx="43" cy="38" r="2.5" fill="%23333"/%3E%3Ccircle cx="57" cy="38" r="2.5" fill="%23333"/%3E%3Cpath d="M44 47 Q50 51 56 47" stroke="%23333" stroke-width="1.5" fill="none"/%3E%3Crect x="35" y="58" width="30" height="28" rx="4" fill="%23667eea"/%3E%3Crect x="25" y="58" width="11" height="22" rx="5.5" fill="%23F5D5B8"/%3E%3Crect x="64" y="58" width="11" height="22" rx="5.5" fill="%23F5D5B8"/%3E%3C/svg%3E'
];
function defaultAvatar(g){ return g==='female'?AVATARS[1]:AVATARS[0]; }

// ============================================================
// WELCOME + STARS
// ============================================================
function spawnStars(){
  const c=document.getElementById('stars');
  const emojis=['⭐','✨','🌟','💫','⚡'];
  for(let i=0;i<18;i++){
    const s=document.createElement('div');
    s.className='star';
    s.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    s.style.left=Math.random()*100+'%';
    s.style.animationDuration=(6+Math.random()*8)+'s';
    s.style.animationDelay=(Math.random()*6)+'s';
    s.style.fontSize=(14+Math.random()*16)+'px';
    c.appendChild(s);
  }
}

function enterLogin(){
  const ws=document.getElementById('welcome-screen');
  ws.style.transition='opacity .6s ease, transform .6s ease';
  ws.style.opacity='0';
  ws.style.transform='scale(1.05)';
  setTimeout(()=>{
    ws.style.display='none';
    document.getElementById('login-screen').style.display='flex';
  },600);
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded',()=>{
  loadStore();
  loadTheme();
  initDemoData();
  DEMO.avatar = AVATARS[0];
  buildSlotGrid();
  spawnStars();

  document.getElementById('theme-btn').onclick=toggleTheme;
  document.getElementById('avatar-wrap').onclick=e=>{
    e.stopPropagation();
    document.getElementById('avatar-menu').classList.toggle('open');
  };
  document.addEventListener('click',()=>document.getElementById('avatar-menu').classList.remove('open'));

  // Auto-login session
  const sid=localStorage.getItem(KEY_SESSION);
  if(sid==='demo'){ CU=DEMO; enterApp(); return; }
  if(sid){ const u=users.find(u=>u.id==sid); if(u){CU=u;enterApp();return;} }

  // Show welcome
  document.getElementById('welcome-screen').style.display='flex';
});

// ============================================================
// THEME
// ============================================================
function toggleTheme(){
  document.body.classList.toggle('dark');
  const dk=document.body.classList.contains('dark');
  document.getElementById('theme-btn').textContent=dk?'☀️':'🌙';
  localStorage.setItem('theme_pref',dk?'dark':'light');
}
function loadTheme(){
  if(localStorage.getItem('theme_pref')==='dark'){
    document.body.classList.add('dark');
    document.getElementById('theme-btn').textContent='☀️';
  }
}

// ============================================================
// AUTH
// ============================================================
function showLogin(){
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('reg-screen').style.display='none';
  document.getElementById('forgot-screen').style.display='none';
}
function showReg(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('reg-screen').style.display='flex';
}
function showForgot(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('forgot-screen').style.display='flex';
  document.getElementById('fp-1').style.display='block';
  document.getElementById('fp-2').style.display='none';
  document.getElementById('fp-3').style.display='none';
}

function togglePw(id,icon){
  const inp=document.getElementById(id);
  const eo=icon.querySelector('.eo'),ec=icon.querySelector('.ec');
  if(inp.type==='password'){inp.type='text';eo.style.display='none';ec.style.display='block';}
  else{inp.type='password';eo.style.display='block';ec.style.display='none';}
}
function showErr(id,msg){const e=document.getElementById(id);if(e){e.textContent=msg;e.classList.add('show');}}
function clearErr(id){const e=document.getElementById(id);if(e)e.classList.remove('show');}

function loginDemo(){
  CU=DEMO;
  localStorage.setItem(KEY_SESSION,'demo');
  enterApp();
}

function doLogin(){
  clearErr('l-email-err');clearErr('l-pw-err');
  const email=document.getElementById('l-email').value.trim();
  const pw=document.getElementById('l-pw').value;
  if(!email){showErr('l-email-err','Nhập email');return;}
  if(!pw){showErr('l-pw-err','Nhập mật khẩu');return;}
  // check demo
  if(email===DEMO.email&&pw===DEMO.password){loginDemo();return;}
  const u=users.find(u=>u.email===email);
  if(!u){showErr('l-email-err','Email không tồn tại');return;}
  if(u.password!==pw){showErr('l-pw-err','Mật khẩu sai');return;}
  CU=u; saveSession(); enterApp();
}

function doRegister(){
  clearErr('r-name-err');clearErr('r-email-err');clearErr('r-gender-err');clearErr('r-pw-err');clearErr('r-cpw-err');
  const name=document.getElementById('r-name').value.trim();
  const email=document.getElementById('r-email').value.trim();
  const gender=document.getElementById('r-gender').value;
  const pw=document.getElementById('r-pw').value;
  const cpw=document.getElementById('r-cpw').value;
  let ok=true;
  if(!name){showErr('r-name-err','Nhập họ tên');ok=false;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showErr('r-email-err','Email không hợp lệ');ok=false;}
  else if(email===DEMO.email){showErr('r-email-err','Email đã tồn tại');ok=false;}
  else if(users.find(u=>u.email===email)){showErr('r-email-err','Email đã tồn tại');ok=false;}
  if(!gender){showErr('r-gender-err','Chọn giới tính');ok=false;}
  if(pw.length<6){showErr('r-pw-err','Tối thiểu 6 ký tự');ok=false;}
  if(pw!==cpw){showErr('r-cpw-err','Không khớp');ok=false;}
  if(!ok)return;
  const u={id:Date.now(),fullname:name,email,gender,password:pw,avatar:defaultAvatar(gender),data:emptyData()};
  users.push(u);
  localStorage.setItem(KEY_USERS,JSON.stringify(users));
  alert('✅ Đăng ký thành công!');
  showLogin();
}

function doLogout(){
  if(CU&&!CU.isDemo) saveStore();
  CU=null; clearSession();
  document.getElementById('app').style.display='none';
  document.getElementById('topbar').style.display='none';
  [pChart,sChart,wChart].forEach(c=>{if(c)c.destroy();});
  pChart=sChart=wChart=null;
  // Back to welcome
  const ws=document.getElementById('welcome-screen');
  ws.style.display='flex';
  ws.style.opacity='0';
  ws.style.transform='scale(.95)';
  setTimeout(()=>{ws.style.transition='opacity .5s,transform .5s';ws.style.opacity='1';ws.style.transform='scale(1)';},50);
  document.getElementById('login-screen').style.display='none';
}

// OTP
let _otp='',_otpEmail='';
function moveNext(el,nid){if(el.value&&nid)document.getElementById(nid).focus();}
function movePrev(e,el,pid){if(e.key==='Backspace'&&!el.value&&pid)document.getElementById(pid).focus();}
function sendOTP(){
  clearErr('fp-email-err');
  const email=document.getElementById('fp-email').value.trim();
  if(!email){showErr('fp-email-err','Nhập email');return;}
  const u=users.find(u=>u.email===email);
  if(!u&&email!==DEMO.email){showErr('fp-email-err','Email chưa đăng ký');return;}
  _otp=Math.floor(100000+Math.random()*900000)+'';_otpEmail=email;
  document.getElementById('otp-show').textContent=_otp;
  ['o1','o2','o3','o4','o5','o6'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('fp-1').style.display='none';
  document.getElementById('fp-2').style.display='block';
  document.getElementById('o1').focus();
}
function verifyOTP(){
  clearErr('otp-err');
  const entered=['o1','o2','o3','o4','o5','o6'].map(id=>document.getElementById(id).value).join('');
  if(entered.length<6){showErr('otp-err','Nhập đủ 6 số');return;}
  if(entered!==_otp){showErr('otp-err','Mã OTP sai');return;}
  document.getElementById('fp-2').style.display='none';
  document.getElementById('fp-3').style.display='block';
}
function resetPw(){
  clearErr('fp-npw-err');clearErr('fp-cpw-err');
  const npw=document.getElementById('fp-npw').value;
  const cpw=document.getElementById('fp-cpw').value;
  if(npw.length<6){showErr('fp-npw-err','Tối thiểu 6 ký tự');return;}
  if(npw!==cpw){showErr('fp-cpw-err','Không khớp');return;}
  const u=users.find(u=>u.email===_otpEmail);
  if(u){u.password=npw;localStorage.setItem(KEY_USERS,JSON.stringify(users));}
  alert('✅ Đặt lại mật khẩu thành công!');showLogin();
}

// ============================================================
// ENTER APP
// ============================================================
function enterApp(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('reg-screen').style.display='none';
  document.getElementById('forgot-screen').style.display='none';
  document.getElementById('welcome-screen').style.display='none';
  document.getElementById('app').style.display='flex';
  document.getElementById('topbar').style.display='flex';
  document.getElementById('avatar-img').src=CU.avatar;
  document.getElementById('avatar-name').textContent=CU.fullname;
  renderSubjects();renderSchedule();renderExams();loadSlots();
  updateStreak();renderCalendar();renderAchievements();renderMessages();
  if(!document.getElementById('chat-msgs-main').children.length)initChat('main');
  checkDailyStatus();
}

// ============================================================
// SECTION NAV
// ============================================================
function gotoSection(id,el){
  document.querySelectorAll('.main-content > div').forEach(d=>d.style.display='none');
  document.getElementById(id+'-section').style.display='block';
  document.querySelectorAll('.sidebar-item').forEach(i=>i.classList.remove('active'));
  if(el)el.classList.add('active');
  if(id==='analytics')setTimeout(updateAnalytics,80);
}

// ============================================================
// SLOTS
// ============================================================
const DAYS_INFO=[['mon','Thứ 2'],['tue','Thứ 3'],['wed','Thứ 4'],['thu','Thứ 5'],['fri','Thứ 6'],['sat','Thứ 7'],['sun','CN']];
function buildSlotGrid(){
  document.getElementById('slot-grid').innerHTML=DAYS_INFO.map(([k,l])=>`
    <div class="slot-item"><label>${l}</label>
      <input type="text" id="slot-${k}" placeholder="18:00-21:00">
      <label class="busy-label"><input type="checkbox" id="busy-${k}" onchange="toggleBusy('${k}')"><span>Bận</span></label>
    </div>`).join('');
}
function toggleBusy(k){const b=document.getElementById('busy-'+k).checked,i=document.getElementById('slot-'+k);i.disabled=b;i.style.opacity=b?.5:1;if(b)i.value='';}
function saveSlots(){
  const d=D();if(!d)return;
  d.timeSlots={};
  DAYS_INFO.forEach(([k])=>{const v=document.getElementById('slot-'+k).value.trim();if(!document.getElementById('busy-'+k).checked&&v)d.timeSlots[k]=v;});
  if(!CU.isDemo)saveStore();
  alert('✅ Đã lưu!');
}
function loadSlots(){
  const d=D();if(!d)return;
  DAYS_INFO.forEach(([k])=>{const i=document.getElementById('slot-'+k),cb=document.getElementById('busy-'+k);i.value=d.timeSlots[k]||'';cb.checked=false;i.disabled=false;i.style.opacity=1;});
}

// ============================================================
// SUBJECTS
// ============================================================
function addSubject(){
  const d=D();if(!d)return;
  const name=document.getElementById('s-name').value.trim();
  const score=parseFloat(document.getElementById('s-score').value);
  if(!name){alert('Nhập tên môn!');return;}
  if(isNaN(score)||score<0||score>10){alert('Điểm 0-10!');return;}
  if(d.subjects.find(s=>s.name.toLowerCase()===name.toLowerCase())){alert('Môn đã tồn tại!');return;}
  d.subjects.push({id:Date.now(),name,score});
  if(!CU.isDemo)saveStore();
  renderSubjects();
  document.getElementById('s-name').value='';document.getElementById('s-score').value='';
}
function deleteSubject(id){
  const d=D();if(!d)return;
  d.subjects=d.subjects.filter(s=>s.id!==id);delete d.schedule[id];
  if(!CU.isDemo)saveStore();
  renderSubjects();renderSchedule();
}
function renderSubjects(){
  const d=D();const el=document.getElementById('subj-list');if(!el)return;
  if(!d||!d.subjects.length){el.innerHTML='<p style="color:#999;text-align:center;padding:16px;font-size:13px">Chưa có môn học</p>';return;}
  el.innerHTML='';
  d.subjects.forEach(s=>{
    const div=document.createElement('div');
    div.className='subj-item'+(s.score<5?' low':'');
    div.innerHTML=`<div><strong>${s.name}</strong><br><small style="color:#666">${s.score.toFixed(1)}/10</small></div>
      <div style="display:flex;align-items:center;gap:8px"><span class="score-badge">${s.score.toFixed(1)}</span><button class="del-btn">🗑️</button></div>`;
    div.querySelector('.del-btn').onclick=()=>deleteSubject(s.id);
    el.appendChild(div);
  });
}

// ============================================================
// SCHEDULE
// ============================================================
function parseTime(t){const[h,m]=t.split(':').map(Number);return h*60+m;}
function fmt(m){return`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;}
function generateSchedule(){
  const d=D();if(!d)return;
  if(!d.subjects.length){alert('Thêm môn học trước!');return;}
  if(!Object.keys(d.timeSlots).length){alert('Nhập thời gian rảnh trước!');return;}
  const sorted=[...d.subjects].sort((a,b)=>a.score-b.score);
  d.schedule={};
  const daySlots={};
  DAYS_INFO.forEach(([k])=>{if(d.timeSlots[k])daySlots[k]=[];});
  const dur=s=>s.score<5?90:s.score<7?60:45;
  const sessions=s=>s.score<5?5:s.score<7?4:3;
  sorted.forEach(s=>{
    let n=sessions(s),dt=dur(s);
    for(let pass=0;pass<3&&n>0;pass++){
      for(const k of Object.keys(daySlots)){
        if(n<=0)break;if(daySlots[k].length>=3)continue;
        const[ss,es]=d.timeSlots[k].split('-');if(!ss||!es)continue;
        const st=parseTime(ss.trim()),en=parseTime(es.trim());let cur=st;
        while(cur+dt+10<=en){
          if(!daySlots[k].some(x=>!(cur+dt+10<=x.s||cur>=x.e))){
            if(!d.schedule[s.id])d.schedule[s.id]={};
            d.schedule[s.id][k]={time:fmt(cur),duration:dt,completed:false};
            daySlots[k].push({s:cur,e:cur+dt+10});n--;break;
          }
          cur+=30;
        }
      }
    }
  });
  if(!CU.isDemo)saveStore();
  renderSchedule();gotoSection('schedule',null);
  document.querySelectorAll('.sidebar-item')[1].classList.add('active');
}
function renderSchedule(){
  const d=D();const body=document.getElementById('sch-body');
  const dk=['mon','tue','wed','thu','fri','sat','sun'];
  const slots=[{n:'🌅 Sáng',s:6,e:12},{n:'☀️ Chiều',s:12,e:18},{n:'🌙 Tối',s:18,e:24}];
  if(!d||!d.subjects.length||!Object.keys(d.schedule).length){
    body.innerHTML='<tr><td colspan="8" style="text-align:center;padding:28px;color:#999;font-size:13px">Vào "Thiết lập" để thêm môn và tạo lịch</td></tr>';return;
  }
  body.innerHTML=slots.map(slot=>`<tr>
    <td style="font-weight:700;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:13px">${slot.n}</td>
    ${dk.map(k=>{
      let html='';
      d.subjects.forEach(s=>{
        if(d.schedule[s.id]&&d.schedule[s.id][k]){
          const t=d.schedule[s.id][k];const h=parseInt(t.time.split(':')[0]);
          if(h>=slot.s&&h<slot.e){
            html+=`<div class="task-item${t.completed?' completed':''}${s.score<5?' priority':''}" onclick="toggleTask(${s.id},'${k}')">
              <input type="checkbox"${t.completed?' checked':''} onclick="event.stopPropagation();toggleTask(${s.id},'${k}')" style="margin-right:4px">
              <strong>${s.name}</strong><br><small>⏰${t.time}·${t.duration}p${s.score<5?' ⭐':''}</small></div>`;
          }
        }
      });
      return`<td class="task-cell">${html||'<small style="color:#bbb">—</small>'}</td>`;
    }).join('')}</tr>`).join('');
}
function toggleTask(sid,day){
  const d=D();if(!d)return;
  if(d.schedule[sid]&&d.schedule[sid][day]){
    d.schedule[sid][day].completed=!d.schedule[sid][day].completed;
    if(!CU.isDemo)saveStore();
    renderSchedule();updateAnalytics();
    if(d.schedule[sid][day].completed)checkAndUpdateStreak();
  }
}

// ============================================================
// EXAMS
// ============================================================
function addExam(){
  const d=D();if(!d)return;
  const name=document.getElementById('e-name').value.trim();
  const date=document.getElementById('e-date').value;
  if(!name||!date){alert('Điền đầy đủ!');return;}
  d.exams.push({id:Date.now(),name,date});
  if(!CU.isDemo)saveStore();
  renderExams();
  document.getElementById('e-name').value='';document.getElementById('e-date').value='';
}
function deleteExam(id){
  const d=D();if(!d)return;
  d.exams=d.exams.filter(e=>e.id!==id);
  if(!CU.isDemo)saveStore();renderExams();
}
function renderExams(){
  const d=D();const el=document.getElementById('exam-list');if(!el)return;
  if(!d||!d.exams.length){el.innerHTML='<p style="color:#999;text-align:center;padding:16px;font-size:13px">Chưa có kỳ thi</p>';return;}
  el.innerHTML='';
  d.exams.forEach(e=>{
    const days=Math.ceil((new Date(e.date)-new Date())/864e5);
    const div=document.createElement('div');div.className='subj-item';
    div.innerHTML=`<div><strong>${e.name}</strong><br><small style="color:#666">${new Date(e.date).toLocaleDateString('vi-VN')}</small>${days>=0?`<br><small style="color:#667eea;font-weight:600">⏰ Còn ${days} ngày</small>`:'<br><small style="color:#999">Đã qua</small>'}</div><button class="del-btn">🗑️</button>`;
    div.querySelector('.del-btn').onclick=()=>deleteExam(e.id);
    el.appendChild(div);
  });
}

// ============================================================
// TIMER
// ============================================================
let timerSec=2700,timerRunning=false,timerInt=null;
function startTimer(){if(!timerRunning){timerRunning=true;timerInt=setInterval(()=>{timerSec--;updateTimerDisp();if(timerSec<=0){clearInterval(timerInt);timerRunning=false;document.getElementById('timer-status').textContent='⏰ Hết giờ!';alert('⏰ Hết giờ! Nghỉ ngơi đi nào!');}},1000);document.getElementById('timer-status').textContent='⏱️ Đang chạy...';}}
function pauseTimer(){clearInterval(timerInt);timerRunning=false;document.getElementById('timer-status').textContent='⏸️ Tạm dừng';}
function resetTimer(){pauseTimer();timerSec=2700;updateTimerDisp();document.getElementById('timer-status').textContent='Sẵn sàng';}
function setTimer(m){pauseTimer();timerSec=m*60;updateTimerDisp();document.getElementById('timer-status').textContent=`Đặt ${m} phút`;}
function updateTimerDisp(){const m=String(Math.floor(timerSec/60)).padStart(2,'0'),s=String(timerSec%60).padStart(2,'0');document.getElementById('timer-disp').textContent=m+':'+s;}

// ============================================================
// STREAK
// ============================================================
function updateStreak(){
  const d=D();if(!d)return;const sk=d.streak;
  document.getElementById('streak-cur').textContent=sk.cur;
  document.getElementById('streak-total').textContent=sk.total;
  document.getElementById('streak-longest').textContent=sk.longest;
  document.getElementById('streak-freeze').textContent=sk.freezes;
  const today=new Date().toDateString();
  document.getElementById('streak-msg').textContent=sk.dates.includes(today)?'🎉 Bạn đã học hôm nay!':'Hoàn thành 1 buổi để giữ chuỗi!';
}
function checkAndUpdateStreak(){
  const d=D();if(!d)return;const sk=d.streak;
  const today=new Date().toDateString();
  if(sk.dates.includes(today))return;
  sk.dates.push(today);sk.total++;
  const yest=new Date();yest.setDate(yest.getDate()-1);
  if(!sk.lastDate||sk.lastDate===yest.toDateString())sk.cur++;
  else{const diff=Math.round((new Date()-new Date(sk.lastDate))/864e5);if(diff===2&&sk.freezes>0){sk.freezes--;sk.cur++;}else sk.cur=1;}
  sk.lastDate=today;if(sk.cur>sk.longest)sk.longest=sk.cur;
  if(!CU.isDemo)saveStore();
  updateStreak();renderCalendar();checkAchievements();
}
function renderCalendar(){
  const d=D();const g=document.getElementById('cal-grid');const t=document.getElementById('cal-title');
  const now=new Date();
  const mn=['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  t.textContent=mn[now.getMonth()]+' '+now.getFullYear();
  const days=[];for(let i=29;i>=0;i--){const dt=new Date();dt.setDate(now.getDate()-i);days.push(dt);}
  const todayStr=now.toDateString();const doneSet=new Set(d?d.streak.dates:[]);
  g.innerHTML=days.map(dt=>{
    const ds=dt.toDateString();
    let cls='cal-day',emoji='';
    if(ds===todayStr){cls+=' today';emoji='⭐';}
    else if(dt>now){cls+=' future';}
    else if(doneSet.has(ds)){cls+=' done';emoji='✓';}
    else{cls+=' miss';emoji='✗';}
    return`<div class="${cls}"><div style="font-size:13px">${dt.getDate()}</div><div style="font-size:10px">${emoji}</div></div>`;
  }).join('');
}
function buyFreeze(){const d=D();if(!d)return;if(d.streak.cur<10){alert('Cần 10 ngày chuỗi!');return;}if(confirm('Đổi 10🔥 lấy 1 đóng băng?')){d.streak.cur-=10;d.streak.freezes++;if(!CU.isDemo)saveStore();updateStreak();}}
function buyReward(){const d=D();if(!d)return;if(d.streak.cur<15){alert('Cần 15 ngày chuỗi!');return;}if(confirm('Đổi 15🔥 lấy phần thưởng?')){d.streak.cur-=15;if(!CU.isDemo)saveStore();updateStreak();const r=['🎉 Kiên trì của bạn sẽ được đền đáp!','⭐ Thành công không xa!','💪 Bạn đã chứng minh quyết tâm!'];alert('🎁 '+r[Math.floor(Math.random()*r.length)]);}}
function buyBadge(){const d=D();if(!d)return;if(d.streak.cur<30){alert('Cần 30 ngày chuỗi!');return;}if(confirm('Đổi 30🔥 lấy huy hiệu?')){d.streak.cur-=30;if(!d.streak.achievements.includes('master'))d.streak.achievements.push('master');if(!CU.isDemo)saveStore();updateStreak();renderAchievements();alert('🏅 Mở khóa Bậc Thầy!');}}
const ACH_LIST=[{id:'s3',icon:'🔥',name:'Người Mới',desc:'3 ngày'},{id:'s7',icon:'⭐',name:'Kiên Trì',desc:'7 ngày'},{id:'s14',icon:'💪',name:'Quyết Tâm',desc:'14 ngày'},{id:'s30',icon:'🏆',name:'Vô Địch',desc:'30 ngày'},{id:'t50',icon:'📚',name:'Học Giả',desc:'50 ngày'},{id:'master',icon:'🏅',name:'Bậc Thầy',desc:'Huy hiệu'}];
function checkAchievements(){
  const d=D();if(!d)return;const sk=d.streak,a=sk.achievements,ns=[];
  const chk=(id,c,l)=>{if(c&&!a.includes(id)){a.push(id);ns.push(l);}};
  chk('s3',sk.cur>=3,'🔥 Người Mới');chk('s7',sk.cur>=7,'⭐ Kiên Trì');chk('s14',sk.cur>=14,'💪 Quyết Tâm');chk('s30',sk.cur>=30,'🏆 Vô Địch');chk('t50',sk.total>=50,'📚 Học Giả');
  if(ns.length){if(!CU.isDemo)saveStore();renderAchievements();setTimeout(()=>alert('🎊 Thành tựu mới!\n'+ns.join('\n')),400);}
}
function renderAchievements(){
  const d=D();const a=d?d.streak.achievements:[];
  document.getElementById('ach-grid').innerHTML=ACH_LIST.map(x=>`
    <div class="ach-card ${a.includes(x.id)?'unlocked':'locked'}">
      <div class="ach-icon">${x.icon}</div><div class="ach-name">${x.name}</div><div class="ach-desc">${x.desc}</div>
      ${a.includes(x.id)?'<div style="color:#22c55e;font-size:12px;font-weight:600;margin-top:4px">✓ Đã mở</div>':''}
    </div>`).join('');
}

// ============================================================
// MESSAGES
// ============================================================
function renderMessages(){
  const d=D();const el=document.getElementById('msg-list');
  if(!d||!d.messages.length){el.innerHTML='<div class="msg-card success"><h4>💪 Chào mừng!</h4><p>Mình sẽ gửi thông báo học tập cho bạn!</p></div>';return;}
  el.innerHTML=d.messages.map(m=>`<div class="msg-card ${m.type}"><h4>${m.title}</h4><p>${m.content}</p><div class="msg-date">${new Date(m.date).toLocaleDateString('vi-VN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div></div>`).join('');
}
function checkDailyStatus(){
  const d=D();if(!d)return;
  const now=new Date();if(now.getHours()<20)return;
  const today=now.toDateString();if(d.lastCheck===today)return;
  const dk=['sun','mon','tue','wed','thu','fri','sat'][now.getDay()];
  let total=0,done=0;
  d.subjects.forEach(s=>{if(d.schedule[s.id]&&d.schedule[s.id][dk]){total++;if(d.schedule[s.id][dk].completed)done++;}});
  if(total>0&&done===0){d.missedDays=(d.missedDays||0)+1;const sv=getMissedSev(d.missedDays);d.messages.unshift({type:'warning',title:sv.title,content:sv.msg,date:today});}
  else if(total>0&&done===total){d.missedDays=0;d.messages.unshift({type:'success',title:'🎉 Xuất sắc!',content:`Hoàn thành ${total} buổi học hôm nay! 🌟`,date:today});}
  if(d.messages.length>30)d.messages=d.messages.slice(0,30);
  d.lastCheck=today;if(!CU.isDemo)saveStore();renderMessages();
}
function getMissedSev(n){
  if(n===1)return{title:'😢 Hôm nay chưa học',msg:'Đừng lo, ngày mai cố lên! 💪'};
  if(n===2)return{title:'⚠️ 2 ngày không học',msg:'Hãy quay lại ngay! 🔥'};
  if(n===3)return{title:'🚨 3 ngày không học!',msg:'Bắt đầu lại ngay - dù 15 phút thôi! ⚡'};
  return{title:`❌ ${n} ngày không học`,msg:'Mục tiêu đang xa dần. Hành động ngay! 🎯'};
}

// ============================================================
// ANALYTICS
// ============================================================
let pChart=null,sChart=null,wChart=null;
function updateAnalytics(){
  const d=D();let total=0,done=0,mins=0;
  if(d){d.subjects.forEach(s=>{Object.keys(d.schedule[s.id]||{}).forEach(k=>{total++;if(d.schedule[s.id][k].completed){done++;mins+=d.schedule[s.id][k].duration||0;}});});}
  const rate=total?((done/total)*100).toFixed(1):0;
  const h=Math.floor(mins/60),m=mins%60;
  document.getElementById('an-total').textContent=total;
  document.getElementById('an-done').textContent=done;
  document.getElementById('an-rate').textContent=rate+'%';
  document.getElementById('an-time').textContent=h+'h'+(m?` ${m}m`:'');
  renderPC(done,total-done);renderSC();renderWC();renderDT();
}
function renderPC(done,undone){
  const ctx=document.getElementById('chart-progress');if(!ctx)return;
  if(pChart)pChart.destroy();
  pChart=new Chart(ctx,{type:'doughnut',data:{labels:['Hoàn thành','Chưa xong'],datasets:[{data:[done,undone],backgroundColor:['rgba(102,126,234,.8)','rgba(220,220,220,.5)'],borderWidth:2}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});
}
function renderSC(){
  const ctx=document.getElementById('chart-subject');if(!ctx)return;
  const d=D();if(!d)return;
  const names=[],rates=[],colors=[];
  d.subjects.forEach(s=>{let t=0,c=0;Object.keys(d.schedule[s.id]||{}).forEach(k=>{t++;if(d.schedule[s.id][k].completed)c++;});if(t>0){names.push(s.name);rates.push(((c/t)*100).toFixed(1));colors.push(s.score<5?'rgba(239,68,68,.8)':s.score<7?'rgba(251,191,36,.8)':'rgba(34,197,94,.8)');}});
  if(sChart)sChart.destroy();
  sChart=new Chart(ctx,{type:'bar',data:{labels:names,datasets:[{label:'%',data:rates,backgroundColor:colors,borderWidth:2}]},options:{responsive:true,scales:{y:{beginAtZero:true,max:100}},plugins:{legend:{display:false}}}});
}
function renderWC(){
  const ctx=document.getElementById('chart-weekly');if(!ctx)return;
  const d=D();if(!d)return;
  const dks=['mon','tue','wed','thu','fri','sat','sun'],lb=['T2','T3','T4','T5','T6','T7','CN'],tot=[0,0,0,0,0,0,0],done=[0,0,0,0,0,0,0];
  d.subjects.forEach(s=>{dks.forEach((k,i)=>{if(d.schedule[s.id]&&d.schedule[s.id][k]){tot[i]++;if(d.schedule[s.id][k].completed)done[i]++;}});});
  if(wChart)wChart.destroy();
  wChart=new Chart(ctx,{type:'bar',data:{labels:lb,datasets:[{label:'Hoàn thành',data:done,backgroundColor:'rgba(102,126,234,.8)',stack:'s'},{label:'Chưa xong',data:dks.map((_,i)=>tot[i]-done[i]),backgroundColor:'rgba(220,220,220,.5)',stack:'s'}]},options:{responsive:true,scales:{x:{stacked:true},y:{stacked:true,beginAtZero:true}},plugins:{legend:{position:'bottom'}}}});
}
function renderDT(){
  const d=D();const body=document.getElementById('an-tbody');
  if(!d||!d.subjects.length){body.innerHTML='<tr><td colspan="6" style="text-align:center;color:#999;padding:20px">Chưa có dữ liệu</td></tr>';return;}
  body.innerHTML=d.subjects.map(s=>{
    let t=0,c=0,m=0;
    Object.keys(d.schedule[s.id]||{}).forEach(k=>{t++;if(d.schedule[s.id][k].completed){c++;m+=d.schedule[s.id][k].duration||0;}});
    const r=t?((c/t)*100).toFixed(1):0;
    return`<tr><td><strong>${s.name}</strong></td><td>${s.score.toFixed(1)}</td><td>${t}</td><td>${c}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${r}%"></div></div><span style="font-weight:600;min-width:40px">${r}%</span></div></td><td>${Math.floor(m/60)}h ${m%60}m</td></tr>`;
  }).join('');
}

// ============================================================
// CHATBOT
// ============================================================
let fabInited=false;
function toggleFab(){
  const w=document.getElementById('fab-win');const isOpen=w.classList.toggle('open');
  document.getElementById('fab-btn').textContent=isOpen?'✕':'💬';
  if(isOpen&&!fabInited){initChat('fab');fabInited=true;}
}
function initChat(t){
  botMsg(t,`Chào ${CU?CU.fullname:'bạn'}! 😊\n\nHỏi mình bất cứ điều gì về học tập nhé!`,['Lịch hôm nay','Tiến độ','Mẹo học','Động viên']);
}
function sendChat(t){const inp=document.getElementById('chat-in-'+t);const msg=inp.value.trim();if(!msg)return;userMsg(t,msg);inp.value='';setTimeout(()=>handleChat(msg,t),500);}
function userMsg(t,text){const el=document.getElementById('chat-msgs-'+t);const d=document.createElement('div');d.className='msg-bubble-wrap user';d.innerHTML=`<div class="bubble">${text}</div>`;el.appendChild(d);el.scrollTop=el.scrollHeight;}
function botMsg(t,text,qrs=[]){
  const el=document.getElementById('chat-msgs-'+t);const d=document.createElement('div');d.className='msg-bubble-wrap bot';
  let html=`<div class="bubble">${text.replace(/\n/g,'<br>')}</div>`;
  if(qrs.length)html+=`<div class="qr-list">${qrs.map(q=>`<div class="qr" onclick="handleQR('${q}','${t}')">${q}</div>`).join('')}</div>`;
  d.innerHTML=html;el.appendChild(d);el.scrollTop=el.scrollHeight;
}
function handleQR(q,t){userMsg(t,q);setTimeout(()=>handleChat(q,t),400);}
function handleChat(msg,t){
  const m=msg.toLowerCase();const d=D();
  if(/chào|hi|hello|hey/.test(m)){botMsg(t,'Chào bạn! 👋',['Lịch hôm nay','Tiến độ','Mẹo học']);return;}
  if(/cảm ơn|thanks/.test(m)){botMsg(t,'Không có gì! 😊 Cố lên nhé!');return;}
  if(/lịch|hôm nay/.test(m)){
    const dk=['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];const ln=['CN','T2','T3','T4','T5','T6','T7'];
    let tasks=[];if(d)d.subjects.forEach(s=>{if(d.schedule[s.id]&&d.schedule[s.id][dk]){const t2=d.schedule[s.id][dk];tasks.push(`• ${s.name}: ${t2.time} (${t2.duration}p) ${t2.completed?'✅':'⏳'}`);}});
    botMsg(t,tasks.length?`📅 Hôm nay (${ln[new Date().getDay()]}):\n\n${tasks.join('\n')}\n\nCố lên! 💪`:`Hôm nay không có lịch! Nghỉ ngơi đi nào! 😊`);return;
  }
  if(/tiến độ|progress/.test(m)){
    let total=0,done=0;if(d)d.subjects.forEach(s=>{Object.keys(d.schedule[s.id]||{}).forEach(k=>{total++;if(d.schedule[s.id][k].completed)done++;});});
    const r=total?((done/total)*100).toFixed(1):0;
    botMsg(t,`📊 Tiến độ:\n• ${done}/${total} buổi (${r}%)\n• Chuỗi: ${d?d.streak.cur:0}🔥\n\n${r>=70?'🌟 Xuất sắc!':r>=40?'💪 Tốt!':'🎯 Cố thêm nữa!'}`);return;
  }
  if(/mẹo|tip|cách học/.test(m)){
    const tips=['📚 Pomodoro: 25p học, 5p nghỉ!','🧠 Đọc to khi học - nhớ hơn 30%!','✍️ Viết tay thay đánh máy!','🎯 Giải thích như đang dạy người khác!','🔄 Ôn lại sau 1, 3, 7, 14 ngày!'];
    botMsg(t,'💡 '+tips[Math.floor(Math.random()*tips.length)],['Mẹo khác']);return;
  }
  if(/động viên|chán|buồn|mệt|stress/.test(m)){
    const q=['💪 Không ai giỏi ngay từ đầu!','⭐ Mỗi ngày học là đầu tư cho tương lai!','🚀 Thành công không đến với người chờ đợi!','🌟 Hôm nay khó, mai sẽ dễ hơn!'];
    botMsg(t,q[Math.floor(Math.random()*q.length)]+'\n\nBạn đang làm rất tốt! 🎉',['Cảm ơn!','Xem tiến độ']);return;
  }
  if(/yếu|kém|môn nào/.test(m)){
    const weak=d?d.subjects.filter(s=>s.score<5):[];
    botMsg(t,weak.length?'📉 Môn cần cải thiện:\n'+weak.map(s=>`• ${s.name}(${s.score}đ) → 90p/ngày`).join('\n'):'🎉 Không có môn nào dưới 5 điểm!');return;
  }
  if(/thi|exam/.test(m)){
    const up=d?d.exams.filter(e=>new Date(e.date)>=new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date)):[];
    botMsg(t,up.length?'📝 Kỳ thi:\n'+up.slice(0,3).map(e=>`• ${e.name}: còn ${Math.ceil((new Date(e.date)-new Date())/864e5)} ngày`).join('\n'):'Không có kỳ thi sắp tới!');return;
  }
  botMsg(t,'Mình chưa hiểu 🤔 Thử hỏi về lịch học, tiến độ, hay mẹo học nhé!',['Lịch hôm nay','Tiến độ','Mẹo học','Động viên']);
}

// ============================================================
// PROFILE
// ============================================================
function handleAvatarUpload(e){
  const file=e.target.files[0];if(!file)return;
  if(file.size>2*1024*1024){alert('⚠️ Ảnh quá lớn! Tối đa 2MB.');return;}
  const reader=new FileReader();
  reader.onload=ev=>{
    const data=ev.target.result;
    if(!CU)return;
    CU.avatar=data;
    if(!CU.isDemo)saveStore();
    document.getElementById('avatar-img').src=data;
    document.getElementById('pm-avatar').src=data;
    document.getElementById('pm-avatar-preview').src=data;
    renderAvatarPicker();
  };
  reader.readAsDataURL(file);
  e.target.value='';
}

function openProfile(){
  if(!CU)return;const d=CU.data;
  document.getElementById('pm-avatar').src=CU.avatar;
  document.getElementById('pm-avatar-preview').src=CU.avatar;
  document.getElementById('pm-name').textContent=CU.fullname;
  document.getElementById('pm-email').textContent=CU.email;
  document.getElementById('pm-streak').textContent=d.streak.cur;
  document.getElementById('pm-days').textContent=d.streak.total;
  document.getElementById('pm-longest').textContent=d.streak.longest;
  let mins=0;d.subjects.forEach(s=>{Object.keys(d.schedule[s.id]||{}).forEach(k=>{if(d.schedule[s.id][k].completed)mins+=d.schedule[s.id][k].duration||0;});});
  document.getElementById('pm-hours').textContent=Math.floor(mins/60);
  document.getElementById('pm-subjects').textContent=d.subjects.length;
  document.getElementById('pm-gender').textContent=CU.gender==='male'?'Nam':'Nữ';
  document.getElementById('pm-created').textContent=CU.isDemo?'Tài khoản Demo':new Date(CU.id).toLocaleDateString('vi-VN');
  renderAvatarPicker();
  document.getElementById('profile-modal').classList.add('open');
  document.getElementById('avatar-menu').classList.remove('open');
}
function closeProfile(){document.getElementById('profile-modal').classList.remove('open');}
function renderAvatarPicker(){
  const grid=document.getElementById('pm-avatar-grid');grid.innerHTML='';
  AVATARS.forEach((av,i)=>{
    const img=document.createElement('img');
    img.className='av-opt'+(CU.avatar===av?' selected':'');
    img.src=av;img.alt='Avatar '+(i+1);
    img.onclick=()=>selectAvatar(i);
    grid.appendChild(img);
  });
}
function selectAvatar(i){
  if(!CU)return;
  CU.avatar=AVATARS[i];
  if(!CU.isDemo)saveStore();
  document.getElementById('avatar-img').src=CU.avatar;
  document.getElementById('pm-avatar').src=CU.avatar;
  renderAvatarPicker();
}
