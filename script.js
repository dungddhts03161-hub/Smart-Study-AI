
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
  return{subjects:[],schedule:{},exams:[],timeSlots:{},streak:{cur:0,longest:0,total:0,lastDate:null,dates:[],freezes:0,achievements:[]},messages:[],missedDays:0,lastCheck:null,xp:0,level:1,peakHour:'18',studyStyle:'balanced',selfRatings:{}};
}

// ============================================================
// AVATARS
// ============================================================
const AVATARS = [
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22%23e8f4f8%22%2F%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2228%22%20r%3D%2214%22%20fill%3D%22%23222%22%2F%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%2228%22%20r%3D%2214%22%20fill%3D%22%23222%22%2F%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2228%22%20r%3D%228%22%20fill%3D%22%23333%22%2F%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%2228%22%20r%3D%228%22%20fill%3D%22%23333%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2254%22%20r%3D%2230%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2238%22%20cy%3D%2248%22%20rx%3D%229%22%20ry%3D%228%22%20fill%3D%22%23222%22%2F%3E%3Cellipse%20cx%3D%2262%22%20cy%3D%2248%22%20rx%3D%229%22%20ry%3D%228%22%20fill%3D%22%23222%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2249%22%20r%3D%224%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2249%22%20r%3D%224%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2239%22%20cy%3D%2250%22%20r%3D%222.5%22%20fill%3D%22%23111%22%2F%3E%3Ccircle%20cx%3D%2263%22%20cy%3D%2250%22%20r%3D%222.5%22%20fill%3D%22%23111%22%2F%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2249%22%20r%3D%221%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2264%22%20cy%3D%2249%22%20r%3D%221%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2260%22%20rx%3D%225%22%20ry%3D%223.5%22%20fill%3D%22%23222%22%2F%3E%3Cpath%20d%3D%22M44%2065%20Q50%2070%2056%2065%22%20stroke%3D%22%23222%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3Ccircle%20cx%3D%2234%22%20cy%3D%2265%22%20r%3D%226%22%20fill%3D%22%23ffb3c1%22%20opacity%3D%220.6%22%2F%3E%3Ccircle%20cx%3D%2266%22%20cy%3D%2265%22%20r%3D%226%22%20fill%3D%22%23ffb3c1%22%20opacity%3D%220.6%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22%23fff3e0%22%2F%3E%3Cpolygon%20points%3D%2222%2C42%2015%2C12%2040%2C32%22%20fill%3D%22%23e65100%22%2F%3E%3Cpolygon%20points%3D%2225%2C40%2020%2C18%2038%2C33%22%20fill%3D%22%23ff8a65%22%2F%3E%3Cpolygon%20points%3D%2278%2C42%2085%2C12%2060%2C32%22%20fill%3D%22%23e65100%22%2F%3E%3Cpolygon%20points%3D%2275%2C40%2080%2C18%2062%2C33%22%20fill%3D%22%23ff8a65%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2258%22%20rx%3D%2232%22%20ry%3D%2228%22%20fill%3D%22%23ef6c00%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2265%22%20rx%3D%2220%22%20ry%3D%2218%22%20fill%3D%22%23fff8f0%22%2F%3E%3Cellipse%20cx%3D%2238%22%20cy%3D%2252%22%20rx%3D%225%22%20ry%3D%225.5%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2262%22%20cy%3D%2252%22%20rx%3D%225%22%20ry%3D%225.5%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2253%22%20r%3D%223%22%20fill%3D%22%232d1b00%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2253%22%20r%3D%223%22%20fill%3D%22%232d1b00%22%2F%3E%3Ccircle%20cx%3D%2239%22%20cy%3D%2252%22%20r%3D%221%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2263%22%20cy%3D%2252%22%20r%3D%221%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2263%22%20rx%3D%224%22%20ry%3D%223%22%20fill%3D%22%23bf360c%22%2F%3E%3Cpath%20d%3D%22M44%2068%20Q50%2073%2056%2068%22%20stroke%3D%22%23bf360c%22%20stroke-width%3D%221.8%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3Ccircle%20cx%3D%2234%22%20cy%3D%2265%22%20r%3D%226%22%20fill%3D%22%23ff8a65%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2266%22%20cy%3D%2265%22%20r%3D%226%22%20fill%3D%22%23ff8a65%22%20opacity%3D%220.5%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22%23fce4ec%22%2F%3E%3Cellipse%20cx%3D%2234%22%20cy%3D%2222%22%20rx%3D%229%22%20ry%3D%2220%22%20fill%3D%22%23f8bbd0%22%2F%3E%3Cellipse%20cx%3D%2266%22%20cy%3D%2222%22%20rx%3D%229%22%20ry%3D%2220%22%20fill%3D%22%23f8bbd0%22%2F%3E%3Cellipse%20cx%3D%2234%22%20cy%3D%2222%22%20rx%3D%225%22%20ry%3D%2215%22%20fill%3D%22%23f48fb1%22%2F%3E%3Cellipse%20cx%3D%2266%22%20cy%3D%2222%22%20rx%3D%225%22%20ry%3D%2215%22%20fill%3D%22%23f48fb1%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2260%22%20r%3D%2230%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2239%22%20cy%3D%2255%22%20r%3D%226%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2261%22%20cy%3D%2255%22%20r%3D%226%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2239%22%20cy%3D%2256%22%20r%3D%223.5%22%20fill%3D%22%23e91e63%22%2F%3E%3Ccircle%20cx%3D%2261%22%20cy%3D%2256%22%20r%3D%223.5%22%20fill%3D%22%23e91e63%22%2F%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2255%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2255%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2265%22%20rx%3D%223.5%22%20ry%3D%222.5%22%20fill%3D%22%23f48fb1%22%2F%3E%3Cpath%20d%3D%22M46%2068%20Q50%2072%2054%2068%22%20stroke%3D%22%23e91e63%22%20stroke-width%3D%221.8%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3Cline%20x1%3D%2230%22%20y1%3D%2263%22%20x2%3D%2244%22%20y2%3D%2265%22%20stroke%3D%22%23ddd%22%20stroke-width%3D%221%22%2F%3E%3Cline%20x1%3D%2230%22%20y1%3D%2267%22%20x2%3D%2244%22%20y2%3D%2267%22%20stroke%3D%22%23ddd%22%20stroke-width%3D%221%22%2F%3E%3Cline%20x1%3D%2256%22%20y1%3D%2265%22%20x2%3D%2270%22%20y2%3D%2263%22%20stroke%3D%22%23ddd%22%20stroke-width%3D%221%22%2F%3E%3Cline%20x1%3D%2256%22%20y1%3D%2267%22%20x2%3D%2270%22%20y2%3D%2267%22%20stroke%3D%22%23ddd%22%20stroke-width%3D%221%22%2F%3E%3Ccircle%20cx%3D%2233%22%20cy%3D%2266%22%20r%3D%226%22%20fill%3D%22%23f48fb1%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2267%22%20cy%3D%2266%22%20r%3D%226%22%20fill%3D%22%23f48fb1%22%20opacity%3D%220.5%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22%23efebe9%22%2F%3E%3Ccircle%20cx%3D%2228%22%20cy%3D%2230%22%20r%3D%2214%22%20fill%3D%22%238d6e63%22%2F%3E%3Ccircle%20cx%3D%2272%22%20cy%3D%2230%22%20r%3D%2214%22%20fill%3D%22%238d6e63%22%2F%3E%3Ccircle%20cx%3D%2228%22%20cy%3D%2230%22%20r%3D%228%22%20fill%3D%22%23a1887f%22%2F%3E%3Ccircle%20cx%3D%2272%22%20cy%3D%2230%22%20r%3D%228%22%20fill%3D%22%23a1887f%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2258%22%20r%3D%2230%22%20fill%3D%22%23a1887f%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2268%22%20rx%3D%2214%22%20ry%3D%2210%22%20fill%3D%22%23bcaaa4%22%2F%3E%3Ccircle%20cx%3D%2239%22%20cy%3D%2252%22%20r%3D%225.5%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2261%22%20cy%3D%2252%22%20r%3D%225.5%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2239%22%20cy%3D%2253%22%20r%3D%223%22%20fill%3D%22%23212121%22%2F%3E%3Ccircle%20cx%3D%2261%22%20cy%3D%2253%22%20r%3D%223%22%20fill%3D%22%23212121%22%2F%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2252%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2252%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2263%22%20rx%3D%224.5%22%20ry%3D%223%22%20fill%3D%22%234e342e%22%2F%3E%3Cpath%20d%3D%22M44%2068%20Q50%2073%2056%2068%22%20stroke%3D%22%234e342e%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3Ccircle%20cx%3D%2233%22%20cy%3D%2266%22%20r%3D%227%22%20fill%3D%22%23ef9a9a%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2267%22%20cy%3D%2266%22%20r%3D%227%22%20fill%3D%22%23ef9a9a%22%20opacity%3D%220.5%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22%23e8eaf6%22%2F%3E%3Cpolygon%20points%3D%2225%2C48%2018%2C18%2044%2C38%22%20fill%3D%22%239c8bb0%22%2F%3E%3Cpolygon%20points%3D%2228%2C46%2023%2C22%2042%2C37%22%20fill%3D%22%23ce93d8%22%2F%3E%3Cpolygon%20points%3D%2275%2C48%2082%2C18%2056%2C38%22%20fill%3D%22%239c8bb0%22%2F%3E%3Cpolygon%20points%3D%2272%2C46%2077%2C22%2058%2C37%22%20fill%3D%22%23ce93d8%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2258%22%20r%3D%2230%22%20fill%3D%22%23b39ddb%22%2F%3E%3Cellipse%20cx%3D%2238%22%20cy%3D%2253%22%20rx%3D%227%22%20ry%3D%227%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2262%22%20cy%3D%2253%22%20rx%3D%227%22%20ry%3D%227%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2238%22%20cy%3D%2254%22%20rx%3D%223%22%20ry%3D%225%22%20fill%3D%22%232e7d32%22%2F%3E%3Cellipse%20cx%3D%2262%22%20cy%3D%2254%22%20rx%3D%223%22%20ry%3D%225%22%20fill%3D%22%232e7d32%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2252%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2252%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Cpolygon%20points%3D%2250%2C63%2047%2C67%2053%2C67%22%20fill%3D%22%23d81b60%22%2F%3E%3Cpath%20d%3D%22M44%2068%20Q50%2072%2056%2068%22%20stroke%3D%22%237b1fa2%22%20stroke-width%3D%221.8%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3Cline%20x1%3D%2228%22%20y1%3D%2263%22%20x2%3D%2244%22%20y2%3D%2265%22%20stroke%3D%22%239e7cc1%22%20stroke-width%3D%221.2%22%20opacity%3D%220.7%22%2F%3E%3Cline%20x1%3D%2228%22%20y1%3D%2268%22%20x2%3D%2244%22%20y2%3D%2267%22%20stroke%3D%22%239e7cc1%22%20stroke-width%3D%221.2%22%20opacity%3D%220.7%22%2F%3E%3Cline%20x1%3D%2256%22%20y1%3D%2265%22%20x2%3D%2272%22%20y2%3D%2263%22%20stroke%3D%22%239e7cc1%22%20stroke-width%3D%221.2%22%20opacity%3D%220.7%22%2F%3E%3Cline%20x1%3D%2256%22%20y1%3D%2267%22%20x2%3D%2272%22%20y2%3D%2268%22%20stroke%3D%22%239e7cc1%22%20stroke-width%3D%221.2%22%20opacity%3D%220.7%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2266%22%20r%3D%226%22%20fill%3D%22%23f48fb1%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2268%22%20cy%3D%2266%22%20r%3D%226%22%20fill%3D%22%23f48fb1%22%20opacity%3D%220.5%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22%23e3f2fd%22%2F%3E%3Cellipse%20cx%3D%2222%22%20cy%3D%2252%22%20rx%3D%2216%22%20ry%3D%2222%22%20fill%3D%22%2390caf9%22%2F%3E%3Cellipse%20cx%3D%2278%22%20cy%3D%2252%22%20rx%3D%2216%22%20ry%3D%2222%22%20fill%3D%22%2390caf9%22%2F%3E%3Cellipse%20cx%3D%2222%22%20cy%3D%2252%22%20rx%3D%2210%22%20ry%3D%2215%22%20fill%3D%22%23bbdefb%22%2F%3E%3Cellipse%20cx%3D%2278%22%20cy%3D%2252%22%20rx%3D%2210%22%20ry%3D%2215%22%20fill%3D%22%23bbdefb%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2252%22%20r%3D%2228%22%20fill%3D%22%2390caf9%22%2F%3E%3Cpath%20d%3D%22M42%2072%20Q38%2082%2044%2088%20Q50%2092%2050%2088%22%20stroke%3D%22%2364b5f6%22%20stroke-width%3D%228%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2247%22%20r%3D%226%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2247%22%20r%3D%226%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2248%22%20r%3D%223.5%22%20fill%3D%22%231a237e%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2248%22%20r%3D%223.5%22%20fill%3D%22%231a237e%22%2F%3E%3Ccircle%20cx%3D%2239%22%20cy%3D%2247%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2263%22%20cy%3D%2247%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2260%22%20r%3D%227%22%20fill%3D%22%23ef9a9a%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2268%22%20cy%3D%2260%22%20r%3D%227%22%20fill%3D%22%23ef9a9a%22%20opacity%3D%220.5%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22%23fff8e1%22%2F%3E%3Cellipse%20cx%3D%2227%22%20cy%3D%2242%22%20rx%3D%2214%22%20ry%3D%2218%22%20fill%3D%22%23d4a96a%22%20transform%3D%22rotate%28-15%2027%2042%29%22%2F%3E%3Cellipse%20cx%3D%2273%22%20cy%3D%2242%22%20rx%3D%2214%22%20ry%3D%2218%22%20fill%3D%22%23d4a96a%22%20transform%3D%22rotate%2815%2073%2042%29%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2256%22%20r%3D%2230%22%20fill%3D%22%23f5c97a%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2268%22%20rx%3D%2215%22%20ry%3D%2211%22%20fill%3D%22%23fbe9a0%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2251%22%20r%3D%226%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2251%22%20r%3D%226%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2252%22%20r%3D%223.5%22%20fill%3D%22%234e2600%22%2F%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2252%22%20r%3D%223.5%22%20fill%3D%22%234e2600%22%2F%3E%3Ccircle%20cx%3D%2239%22%20cy%3D%2251%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2263%22%20cy%3D%2251%22%20r%3D%221.2%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2262%22%20rx%3D%225%22%20ry%3D%224%22%20fill%3D%22%234e2600%22%2F%3E%3Cpath%20d%3D%22M43%2068%20Q50%2074%2057%2068%22%20stroke%3D%22%238d4e00%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2265%22%20r%3D%227%22%20fill%3D%22%23ff8a65%22%20opacity%3D%220.45%22%2F%3E%3Ccircle%20cx%3D%2268%22%20cy%3D%2265%22%20r%3D%227%22%20fill%3D%22%23ff8a65%22%20opacity%3D%220.45%22%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22%23e0f7fa%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2245%22%20r%3D%2228%22%20fill%3D%22%23212121%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2252%22%20rx%3D%2218%22%20ry%3D%2220%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2243%22%20r%3D%227%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2243%22%20r%3D%227%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2244%22%20r%3D%224%22%20fill%3D%22%231a1a1a%22%2F%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2244%22%20r%3D%224%22%20fill%3D%22%231a1a1a%22%2F%3E%3Ccircle%20cx%3D%2238%22%20cy%3D%2242%22%20r%3D%221.5%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2258%22%20cy%3D%2242%22%20r%3D%221.5%22%20fill%3D%22%23fff%22%2F%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2256%22%20rx%3D%225%22%20ry%3D%223.5%22%20fill%3D%22%23ff8f00%22%2F%3E%3Ccircle%20cx%3D%2233%22%20cy%3D%2256%22%20r%3D%226%22%20fill%3D%22%23ef9a9a%22%20opacity%3D%220.6%22%2F%3E%3Ccircle%20cx%3D%2267%22%20cy%3D%2256%22%20r%3D%226%22%20fill%3D%22%23ef9a9a%22%20opacity%3D%220.6%22%2F%3E%3Cpolygon%20points%3D%2242%2C68%2050%2C72%2042%2C76%22%20fill%3D%22%23e53935%22%2F%3E%3Cpolygon%20points%3D%2258%2C68%2050%2C72%2058%2C76%22%20fill%3D%22%23e53935%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2272%22%20r%3D%223%22%20fill%3D%22%23c62828%22%2F%3E%3C%2Fsvg%3E'
];
function defaultAvatar(g){ return g==='female'?AVATARS[1]:AVATARS[0]; }

// ============================================================
// WELCOME + STARS
// ============================================================
function spawnStars(){
  const c=document.getElementById('stars'); if(!c)return;
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
  document.getElementById('login-screen').style.display='flex';
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

  // Landing shown by default - explicitly init landing-fixed
  showLanding();
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
  _authFadeIn('login-screen');
  _authFadeOut('reg-screen');
  _authFadeOut('forgot-screen');
}
function showReg(){
  _authFadeOut('login-screen');
  _authFadeIn('reg-screen');
}
function showForgot(){
  _authFadeOut('login-screen');
  _authFadeIn('forgot-screen');
  document.getElementById('fp-1').style.display='block';
  document.getElementById('fp-2').style.display='none';
  document.getElementById('fp-3').style.display='none';
}
function _authFadeIn(id){
  const el=document.getElementById(id);
  if(!el)return;
  el.style.display='flex';
  // Double rAF ensures browser has painted before transition starts
  requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('visible'))));
}
function _authFadeOut(id){
  const el=document.getElementById(id);
  if(!el)return;
  el.classList.remove('visible');
  setTimeout(()=>{if(!el.classList.contains('visible'))el.style.display='none';},450);
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
  showLanding();
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
  // Fade out all auth screens
  ['login-screen','reg-screen','forgot-screen'].forEach(id=>_authFadeOut(id));
  var _lay=document.getElementById('landing-layer');
  var _fix=document.getElementById('landing-fixed');
  if(_lay){_lay.style.display='none';}
  if(_fix){_fix.style.display='none';}

  // Fade in app after auth fades out
  setTimeout(function(){
    const app=document.getElementById('app');
    const topbar=document.getElementById('topbar');
    app.style.opacity='0';
    app.style.display='flex';
    topbar.style.opacity='0';
    topbar.style.display='flex';
    app.style.transition='opacity 0.4s ease';
    topbar.style.transition='opacity 0.4s ease';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      app.style.opacity='1';
      topbar.style.opacity='1';
    }));
    const toggleBtn=document.getElementById('sidebar-toggle');
    if(toggleBtn){toggleBtn.style.display='none';}
    setTimeout(syncToggleBtn,30);
    document.getElementById('avatar-img').src=CU.avatar;
    document.getElementById('avatar-name').textContent=CU.fullname;
    renderSubjects();renderSchedule();renderExams();loadSlots();
    updateStreak();renderCalendar();renderAchievements();renderMessages();
    if(!document.getElementById('chat-msgs-main').children.length)initChat('main');
    checkDailyStatus();
    updateXPBar();
  }, 350);
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
  if(id==='streak'){calYear=new Date().getFullYear();calMonth=new Date().getMonth();updateStreak();renderCalendar();renderAchievements();}
  if(id==='messages'){msgFilter='all';document.querySelectorAll('.msg-ftab').forEach((t,i)=>t.classList.toggle('active',i===0));renderMessages();}
  // Auto-close on mobile
  if(window.innerWidth<=768){
    const sb=document.getElementById('sidebar');
    if(sb&&!sb.classList.contains('collapsed')){toggleSidebar();}
  }
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
  const selfRating=parseInt(document.getElementById('s-selfrating').value)||50;
  const chapTime=parseInt(document.getElementById('s-chaptime').value)||45;
  if(!name){alert('Nhập tên môn!');return;}
  if(isNaN(score)||score<0||score>10){alert('Điểm 0-10!');return;}
  if(d.subjects.find(s=>s.name.toLowerCase()===name.toLowerCase())){alert('Môn đã tồn tại!');return;}
  d.subjects.push({id:Date.now(),name,score,selfRating,chapTime});
  if(!d.selfRatings) d.selfRatings={};
  d.selfRatings[name]=selfRating;
  if(!CU.isDemo)saveStore();
  renderSubjects();
  updateAIProfileBadge();
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
    const selfR=s.selfRating||50;
    const ratingLabel=selfR<=25?'😰 Yếu':selfR<=50?'😐 TB':selfR<=75?'😊 Khá':'💪 Giỏi';
    const ratingColor=selfR<=25?'#ef4444':selfR<=50?'#f59e0b':selfR<=75?'#10b981':'#667eea';
    const div=document.createElement('div');
    div.className='subj-item'+(s.score<5?' low':'');
    div.innerHTML=`<div><strong>${s.name}</strong><br><small style="color:#8892b0">${s.score.toFixed(1)}/10 · <span style="color:${ratingColor}">${ratingLabel}</span> · ${s.chapTime||45}p/chương</small></div>
      <div style="display:flex;align-items:center;gap:8px"><span class="score-badge">${s.score.toFixed(1)}</span><button class="del-btn">🗑️</button></div>`;
    div.querySelector('.del-btn').onclick=()=>deleteSubject(s.id);
    el.appendChild(div);
  });
}
function updateAIProfileBadge(){
  const d=D();const badge=document.getElementById('ai-profile-badge');if(!badge||!d)return;
  if(!d.subjects.length){badge.style.display='none';return;}
  const weak=d.subjects.filter(s=>s.score<5||s.selfRating<=25);
  const peak=document.getElementById('s-peak');
  const peakLabel=peak?peak.options[peak.selectedIndex].text:'18:00';
  badge.style.display='block';
  badge.innerHTML=`🤖 AI đã phân tích: <strong>${d.subjects.length} môn</strong> · ${weak.length} môn cần ưu tiên · Học hiệu quả nhất lúc <strong>${peakLabel.split('(')[1]?.replace(')','')}</strong>`;
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

  // ── AI LOGIC: collect personalization params ──
  const peakHourEl=document.getElementById('s-peak');
  const styleEl=document.getElementById('s-style');
  const peakHour=peakHourEl?parseInt(peakHourEl.value):18;
  const studyStyle=styleEl?styleEl.value:'balanced';
  if(d) { d.peakHour=peakHour; d.studyStyle=studyStyle; }

  // ── AI Priority Score: combines score + selfRating + urgency ──
  const upcoming=d.exams.filter(e=>new Date(e.date)>=new Date())
    .sort((a,b)=>new Date(a.date)-new Date(b.date));
  
  const aiScore=s=>{
    const invScore=(10-s.score)/10; // lower score = higher priority
    const invSelf=(100-(s.selfRating||50))/100; // lower self-rating = higher priority
    const urgency=upcoming.find(e=>e.name.toLowerCase().includes(s.name.toLowerCase()))?0.3:0;
    return invScore*0.5 + invSelf*0.35 + urgency*0.15;
  };

  // ── AI Duration: based on selfRating + studyStyle ──
  const aiDuration=s=>{
    const selfR=s.selfRating||50;
    const chapT=s.chapTime||45;
    let base=chapT;
    if(studyStyle==='intensive') base=Math.max(base,75);
    else if(studyStyle==='spread') base=Math.min(base,40);
    if(selfR<=25) base=Math.round(base*1.5); // weak: longer
    else if(selfR>=90) base=Math.round(base*0.7); // strong: shorter
    return Math.min(Math.max(base,25),120);
  };

  // ── AI Sessions per week ──
  const aiSessions=s=>{
    const selfR=s.selfRating||50;
    if(studyStyle==='intensive') return selfR<=25?4:selfR<=50?3:2;
    if(studyStyle==='spread') return selfR<=25?6:selfR<=50?5:3;
    return selfR<=25?5:selfR<=50?4:3; // balanced
  };

  const sorted=[...d.subjects].sort((a,b)=>aiScore(b)-aiScore(a));
  d.schedule={};
  const daySlots={};
  DAYS_INFO.forEach(([k])=>{if(d.timeSlots[k])daySlots[k]=[];});

  // ── AI Peak Hour Preference: sort days to prefer peak hour matches ──
  const dayKeys=Object.keys(daySlots);

  sorted.forEach(s=>{
    let n=aiSessions(s),dt=aiDuration(s);
    for(let pass=0;pass<4&&n>0;pass++){
      const maxPerDay=studyStyle==='intensive'?2:studyStyle==='spread'?4:3;
      for(const k of dayKeys){
        if(n<=0)break;if(daySlots[k].length>=maxPerDay)continue;
        const[ss,es]=d.timeSlots[k].split('-');if(!ss||!es)continue;
        const st=parseTime(ss.trim()),en=parseTime(es.trim());
        // ── AI: prefer peak hour ──
        const peakStart=peakHour*60;
        let cur=Math.max(st, Math.min(peakStart, en-dt-10));
        // If peak not available, fallback to start
        if(cur<st) cur=st;
        let tried=0;
        while(cur+dt+10<=en && tried<20){
          tried++;
          if(!daySlots[k].some(x=>!(cur+dt+10<=x.s||cur>=x.e))){
            if(!d.schedule[s.id])d.schedule[s.id]={};
            d.schedule[s.id][k]={time:fmt(cur),duration:dt,completed:false};
            daySlots[k].push({s:cur,e:cur+dt+10});n--;break;
          }
          cur+=15;
        }
      }
    }
  });

  if(!CU.isDemo)saveStore();
  
  // ── AI Summary Toast ──
  showAIScheduleToast(sorted, studyStyle, peakHour);
  
  renderSchedule();gotoSection('schedule',null);
  document.querySelectorAll('.sidebar-item')[2].classList.add('active');
}

function showAIScheduleToast(sorted, style, peak){
  const weakSubjs=sorted.filter(s=>s.score<5||(s.selfRating||50)<=25).map(s=>s.name);
  const styleLabel={intensive:'Tập trung cao độ',balanced:'Cân bằng',spread:'Dàn trải'}[style];
  let msg=`🤖 AI đã tạo lịch cá nhân hóa!\n\n`;
  msg+=`📊 Phong cách: ${styleLabel}\n`;
  msg+=`⏰ Ưu tiên khung ${peak}:00-${peak+2}:00\n`;
  if(weakSubjs.length) msg+=`⚠️ Ưu tiên cao: ${weakSubjs.join(', ')}\n`;
  msg+=`\n✅ Lịch đã được tối ưu theo thói quen của bạn!`;
  setTimeout(()=>alert(msg),100);
}
let schView='day';
function switchSchView(v){
  schView=v;
  document.getElementById('btn-view-day').classList.toggle('active',v==='day');
  document.getElementById('btn-view-week').classList.toggle('active',v==='week');
  const d2=document.getElementById('btn-view-day2');const w2=document.getElementById('btn-view-week2');
  if(d2)d2.classList.toggle('active',v==='day');if(w2)w2.classList.toggle('active',v==='week');
  document.getElementById('sch-day-view').style.display=v==='day'?'block':'none';
  document.getElementById('sch-week-view').style.display=v==='week'?'block':'none';
  renderSchedule();
}
function renderSchedule(){
  if(schView==='week')renderWeekView();
  else renderDayView();
}
function renderDayView(){
  const d=D();
  const statsBar=document.getElementById('day-stats-bar');
  const timeline=document.getElementById('day-timeline');
  if(!statsBar||!timeline)return;
  const now=new Date();
  const dkMap=['sun','mon','tue','wed','thu','fri','sat'];
  const todayKey=dkMap[now.getDay()];
  let todayTasks=[];
  if(d&&d.subjects.length){
    d.subjects.forEach(s=>{
      if(d.schedule[s.id]&&d.schedule[s.id][todayKey])
        todayTasks.push({s,t:d.schedule[s.id][todayKey],key:todayKey});
    });
    todayTasks.sort((a,b)=>a.t.time.localeCompare(b.t.time));
  }
  const totalAll=d?Object.values(d.schedule).reduce((acc,sch)=>acc+Object.keys(sch).length,0):0;
  const doneToday=todayTasks.filter(x=>x.t.completed).length;
  statsBar.innerHTML=`
    <div class="day-stat-chip chip-blue"><span class="chip-num">${todayTasks.length}</span><span>lịch hôm nay</span></div>
    <div class="day-stat-chip chip-green"><span class="chip-num">${doneToday}</span><span>hoàn thành</span></div>
    <div class="day-stat-chip chip-orange"><span class="chip-num">${totalAll}</span><span>tổng cộng</span></div>`;
  if(!todayTasks.length){
    timeline.innerHTML=`<div class="day-empty"><div class="day-empty-icon">📭</div><div class="day-empty-text">Hôm nay không có lịch học!<br><span style="font-weight:400;font-size:13px">Vào Thiết lập để tạo lịch tự động</span></div></div>`;
    return;
  }
  timeline.innerHTML=todayTasks.map(({s,t,key})=>{
    const isPriority=s.score<5,isDone=t.completed;
    const [h,m]=t.time.split(':').map(Number);
    const endMin=h*60+m+(t.duration||45);
    const endH=String(Math.floor(endMin/60)).padStart(2,'0');
    const endM=String(endMin%60).padStart(2,'0');
    const accentCls=isDone?'done':isPriority?'priority':'';
    return`<div class="tl-item${isDone?' tl-done':''}">
      <div class="tl-accent ${accentCls}"></div>
      <div class="tl-time-col">
        <span class="tl-time-start">${t.time}</span>
        <div class="tl-time-line"></div>
        <span class="tl-time-end">${endH}:${endM}</span>
      </div>
      <div class="tl-body">
        <div class="tl-subject${isDone?' done-text':''}">${s.name}${isPriority?' ⭐':''}</div>
        <div class="tl-meta">⏱️ ${t.duration||45} phút${s.score<5?' · <span style="color:#ff6b6b;font-weight:700">Cần cải thiện</span>':''}</div>
        <div><button class="tl-tag${isDone?' done-tag':''}" onclick="toggleTask(${s.id},'${key}')">${isDone?'✅ Đã hoàn thành':'📚 Học'}</button></div>
      </div>
      <div class="tl-check">
        <div class="tl-check-btn${isDone?' checked':''}" onclick="toggleTask(${s.id},'${key}')">${isDone?'✓':''}</div>
      </div>
    </div>`;
  }).join('');
}
function renderWeekView(){
  const d=D();const body=document.getElementById('sch-body');
  const dk=['mon','tue','wed','thu','fri','sat','sun'];
  const slots=[{n:'🌅 Sáng',s:6,e:12},{n:'☀️ Chiều',s:12,e:18},{n:'🌙 Tối',s:18,e:24}];
  if(!d||!d.subjects.length||!Object.keys(d.schedule).length){
    body.innerHTML='<tr><td colspan="8" style="text-align:center;padding:28px;color:#999;font-size:13px">Vào &quot;Thiết lập&quot; để thêm môn và tạo lịch</td></tr>';return;
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
// ============================================================
// XP & LEVEL SYSTEM
// ============================================================
const XP_LEVELS=[
  {lvl:1,name:'Newbie 🌱',min:0,max:100},
  {lvl:2,name:'Learner 📖',min:100,max:250},
  {lvl:3,name:'Scholar 🎓',min:250,max:500},
  {lvl:4,name:'Expert 🧠',min:500,max:900},
  {lvl:5,name:'Master 🏆',min:900,max:99999}
];
function addXP(amount,reason){
  const d=D();if(!d)return;
  if(!d.xp) d.xp=0;
  if(!d.level) d.level=1;
  d.xp+=amount;
  const prev=d.level;
  const lv=XP_LEVELS.find(l=>d.xp>=l.min&&d.xp<l.max)||XP_LEVELS[XP_LEVELS.length-1];
  d.level=lv.lvl;
  if(!CU.isDemo)saveStore();
  updateXPBar();
  if(d.level>prev) showLevelUp(lv);
}
function updateXPBar(){
  const d=D();if(!d)return;
  const xp=d.xp||0;const lv=XP_LEVELS.find(l=>xp>=l.min&&xp<l.max)||XP_LEVELS[XP_LEVELS.length-1];
  const next=XP_LEVELS.find(l=>l.lvl===lv.lvl+1);
  const pct=next?Math.min(100,((xp-lv.min)/(lv.max-lv.min))*100):100;
  const bar=document.getElementById('xp-bar');
  const badge=document.getElementById('xp-level-badge');
  const val=document.getElementById('xp-val');
  if(bar) bar.style.width=pct+'%';
  if(badge) badge.textContent=`⭐ Lv.${lv.lvl} – ${lv.name}`;
  if(val) val.textContent=`${xp} XP`;
}
function showLevelUp(lv){
  setTimeout(()=>alert(`🎉 LEVEL UP!\n\nBạn đã đạt Level ${lv.lvl}: ${lv.name}\n\nTiếp tục học để lên level tiếp! 🚀`),200);
}

function toggleTask(sid,day){
  const d=D();if(!d)return;
  if(d.schedule[sid]&&d.schedule[sid][day]){
    d.schedule[sid][day].completed=!d.schedule[sid][day].completed;
    if(!CU.isDemo)saveStore();
    renderSchedule();updateAnalytics();
    if(d.schedule[sid][day].completed){
      checkAndUpdateStreak();
      addXP(20,'task'); // +20 XP per completed session
    }
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
    div.innerHTML=`<div><strong>${e.name}</strong><br><small style="color:#8892b0">${new Date(e.date).toLocaleDateString('vi-VN')}</small>${days>=0?`<br><small style="color:#22d3ee;font-weight:600">⏰ Còn ${days} ngày</small>`:'<br><small style="color:#999">Đã qua</small>'}</div><button class="del-btn">🗑️</button>`;
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
let calYear=new Date().getFullYear(), calMonth=new Date().getMonth();
function calPrev(){calMonth--;if(calMonth<0){calMonth=11;calYear--;}renderCalendar();}
function calNext(){
  const now=new Date();
  if(calYear>now.getFullYear()||(calYear===now.getFullYear()&&calMonth>=now.getMonth()))return;
  calMonth++;if(calMonth>11){calMonth=0;calYear++;}renderCalendar();
}
function renderCalendar(){
  const d=D();
  const g=document.getElementById('cal-grid');
  const t=document.getElementById('cal-title');
  const dowRow=document.getElementById('cal-dow-row');
  const mn=['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  t.textContent='T'+(calMonth+1)+' '+calYear;
  // Day of week headers: Mon-Sun
  const dows=['T2','T3','T4','T5','T6','T7','CN'];
  if(dowRow)dowRow.innerHTML=dows.map(d=>`<div class="cal-dow">${d}</div>`).join('');
  // Build days in month
  const firstDay=new Date(calYear,calMonth,1);
  // offset: Monday=0 ... Sunday=6
  let offset=(firstDay.getDay()+6)%7;
  const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
  const todayStr=new Date().toDateString();
  const doneSet=new Set(d?d.streak.dates:[]);
  // freezeSet - mark freeze used days (we don't track specifically, so just use a placeholder)
  let cells=[];
  // empty cells before first day
  for(let i=0;i<offset;i++) cells.push(`<div class="cal-day empty"></div>`);
  for(let day=1;day<=daysInMonth;day++){
    const dt=new Date(calYear,calMonth,day);
    const ds=dt.toDateString();
    const now=new Date(); now.setHours(23,59,59,999);
    let cls='cal-day';
    if(ds===todayStr) cls+=' today';
    else if(dt>now) cls+=' future';
    else if(doneSet.has(ds)) cls+=' done';
    else cls+=' miss';
    cells.push(`<div class="${cls}">${day}</div>`);
  }
  g.innerHTML=cells.join('');
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
let msgFilter = 'all';
function filterMsgs(type, el) {
  msgFilter = type;
  document.querySelectorAll('.msg-ftab').forEach(t => t.classList.remove('active'));
  if(el) el.classList.add('active');
  renderMessages();
}
function clearMessages() {
  const d = D(); if(!d) return;
  // Dùng custom confirm thay vì window.confirm (tránh bị block trên file://)
  const btn = document.querySelector('[onclick="clearMessages()"]');
  if(btn && btn.dataset.confirming !== '1') {
    btn.dataset.confirming = '1';
    const origText = btn.innerHTML;
    btn.innerHTML = '❓ Chắc chắn?';
    btn.style.borderColor = '#ef4444';
    btn.style.color = '#ef4444';
    const reset = () => {
      btn.dataset.confirming = '0';
      btn.innerHTML = origText;
      btn.style.borderColor = '#e5e7eb';
      btn.style.color = '#888';
    };
    setTimeout(reset, 3000);
    return;
  }
  // Lần bấm thứ 2 → xóa thật
  if(btn) { btn.dataset.confirming = '0'; btn.innerHTML = '🗑️ Xóa hết'; btn.style.borderColor='#e5e7eb'; btn.style.color='#888'; }
  d.messages = [];
  if(!CU.isDemo) saveStore();
  renderMessages();
}

function renderSubjectOverview() {
  const d = D();
  const el = document.getElementById('msg-subject-overview');
  if(!el) return;
  if(!d || !d.subjects.length) { el.innerHTML = ''; return; }
  const dkMap = ['sun','mon','tue','wed','thu','fri','sat'];
  const todayKey = dkMap[new Date().getDay()];

  const cards = d.subjects.map(s => {
    const sch = d.schedule[s.id] || {};
    const allDays = Object.keys(sch);
    const totalSessions = allDays.length;
    const doneSessions = allDays.filter(k => sch[k].completed).length;
    const rate = totalSessions ? Math.round((doneSessions / totalSessions) * 100) : 0;
    const todayTask = sch[todayKey];
    const isTodayDone = todayTask?.completed;
    const isTodayPending = todayTask && !isTodayDone;
    const weekDone = ['mon','tue','wed','thu','fri','sat','sun'].filter(k => sch[k]?.completed).length;
    const weekTotal = ['mon','tue','wed','thu','fri','sat','sun'].filter(k => sch[k]).length;

    // Score color
    const scoreCls = s.score >= 7 ? 'score-high' : s.score >= 5 ? 'score-mid' : 'score-low';

    // Progress bar color
    const fillColor = rate >= 70 ? '#22c55e' : rate >= 40 ? '#f59e0b' : '#ef4444';

    // Tip
    let tip = '', tipCls = 'tip-ok';
    if (s.score < 5) {
      tip = `⚡ Điểm thấp! Cần tăng cường ôn tập, đặt mục tiêu ${Math.min(totalSessions, weekTotal + 2)} buổi/tuần.`;
      tipCls = 'tip-urgent';
    } else if (rate < 40) {
      tip = `📌 Tỷ lệ hoàn thành thấp. Cố gắng hoàn thành ít nhất ${Math.ceil(totalSessions * 0.5)} buổi.`;
      tipCls = 'tip-warn';
    } else if (isTodayPending) {
      tip = `⏰ Hôm nay có lịch học lúc ${todayTask.time}. Đừng bỏ lỡ nhé!`;
      tipCls = 'tip-warn';
    } else if (isTodayDone) {
      tip = `✅ Tuyệt vời! Đã hoàn thành buổi học hôm nay.`;
      tipCls = 'tip-ok';
    } else {
      tip = `📚 Tiến độ tốt! Duy trì ${weekDone}/${weekTotal} buổi/tuần.`;
      tipCls = 'tip-ok';
    }

    return `<div class="subj-ov-card">
      <div class="subj-ov-top">
        <div class="subj-ov-name">${s.name}</div>
        <span class="subj-ov-score ${scoreCls}">${s.score.toFixed(1)}đ</span>
      </div>
      <div class="subj-ov-progress">
        <div class="subj-ov-prog-label"><span>Tiến độ tuần</span><span style="color:${fillColor}">${rate}%</span></div>
        <div class="subj-ov-prog-track"><div class="subj-ov-prog-fill" style="width:${rate}%;background:${fillColor}"></div></div>
      </div>
      <div class="subj-ov-stats">
        <span class="subj-ov-stat">📅 ${doneSessions}/${totalSessions} buổi</span>
        <span class="subj-ov-stat">🔥 ${weekDone}/${weekTotal} tuần này</span>
        ${isTodayPending ? `<span class="subj-ov-stat" style="background:#fff3cd;color:#856404">⏰ Hôm nay ${todayTask.time}</span>` : ''}
        ${isTodayDone ? `<span class="subj-ov-stat" style="background:#d1fae5;color:#065f46">✅ Xong hôm nay</span>` : ''}
      </div>
      <div class="subj-ov-tip ${tipCls}">${tip}</div>
    </div>`;
  }).join('');

  el.innerHTML = (msgFilter === 'subject' || msgFilter === 'all')
    ? `<div class="subj-overview-grid">${cards}</div>` : '';
}

function renderMessages() {
  renderSubjectOverview();
  const d = D();
  const el = document.getElementById('msg-list');
  if(!el) return;
  let msgs = d ? [...d.messages] : [];
  if(msgFilter === 'warning') msgs = msgs.filter(m => m.type === 'warning');
  else if(msgFilter === 'success') msgs = msgs.filter(m => m.type === 'success');
  else if(msgFilter === 'fail') msgs = msgs.filter(m => m.type === 'fail' || m.type === 'warning');
  else if(msgFilter === 'subject') { el.innerHTML = ''; return; }

  if(!msgs.length && msgFilter === 'all') {
    el.innerHTML = `<div class="msg-card-new">
      <div class="msg-card-accent" style="background:linear-gradient(90deg,#667eea,#764ba2)"></div>
      <div class="msg-card-body">
        <div class="msg-card-head"><span class="msg-card-icon">💪</span><span class="msg-card-title">Chào mừng bạn!</span></div>
        <div class="msg-card-text">Hệ thống sẽ gửi thông báo nhắc nhở học tập chi tiết từng môn sau 20:00 mỗi ngày.</div>
      </div>
    </div>`; return;
  }
  if(!msgs.length) { el.innerHTML = `<div style="text-align:center;padding:40px;color:#aaa;font-size:14px">Không có thông báo nào</div>`; return; }

  const colors = { warning: '#ff6b6b', success: '#4ade80', subject: '#a78bfa', info: '#38bdf8' };
  const badges = { warning: ['badge-warn','⚠️ Cảnh báo'], success: ['badge-ok','✅ Đạt'], subject: ['badge-info','📚 Môn học'], info: ['badge-info','ℹ️ Thông tin'] };

  el.innerHTML = msgs.map(m => {
    const color = colors[m.type] || '#667eea';
    const [badgeCls, badgeTxt] = badges[m.type] || ['badge-info','📌'];
    return `<div class="msg-card-new">
      <div class="msg-card-accent" style="background:${color}"></div>
      <div class="msg-card-body">
        <div class="msg-card-head">
          <span class="msg-card-icon">${m.icon || (m.type==='warning'?'⚠️':m.type==='success'?'🎉':'📬')}</span>
          <span class="msg-card-title">${m.title}</span>
          <span class="msg-card-badge ${badgeCls}">${badgeTxt}</span>
        </div>
        <div class="msg-card-text">${m.content}</div>
        <div class="msg-card-meta">
          <span class="msg-card-date">🕐 ${new Date(m.date).toLocaleDateString('vi-VN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span>
          ${m.subject ? `<span class="msg-card-subj-tag">📖 ${m.subject}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

function checkDailyStatus(){
  const d=D();if(!d)return;
  const now=new Date();if(now.getHours()<20)return;
  const today=now.toDateString();if(d.lastCheck===today)return;
  const dk=['sun','mon','tue','wed','thu','fri','sat'][now.getDay()];

  // Per-subject notifications
  d.subjects.forEach(s => {
    const task = d.schedule[s.id]?.[dk];
    if(!task) return;
    if(task.completed) {
      d.messages.unshift({
        type:'success', icon:'✅',
        title:`${s.name} — Hoàn thành!`,
        content:`Bạn đã hoàn thành buổi học ${s.name} hôm nay. Tuyệt vời! 🌟 Tiếp tục duy trì nhé.`,
        subject: s.name, date: today
      });
    } else {
      const sv = getSubjectWarnMsg(s);
      d.messages.unshift({
        type:'warning', icon:'⚠️',
        title:`${s.name} — Chưa học hôm nay`,
        content: sv,
        subject: s.name, date: today
      });
    }
  });

  // Overall summary
  let total=0,done=0;
  d.subjects.forEach(s=>{if(d.schedule[s.id]?.[dk]){total++;if(d.schedule[s.id][dk].completed)done++;}});
  if(total>0){
    if(done===total){
      d.missedDays=0;
      d.messages.unshift({type:'success',icon:'🎉',title:'🎉 Xuất sắc! Hoàn thành tất cả',content:`Bạn đã hoàn thành cả ${total} môn hôm nay! Chuỗi ngày học đang tăng. 🔥 Tiếp tục phát huy!`,date:today});
    } else if(done===0){
      d.missedDays=(d.missedDays||0)+1;
      const sv=getMissedSev(d.missedDays);
      d.messages.unshift({type:'warning',icon:'😢',title:sv.title,content:sv.msg,date:today});
    } else {
      d.messages.unshift({type:'info',icon:'📊',title:`Hôm nay: ${done}/${total} môn hoàn thành`,content:`Còn ${total-done} môn chưa học hôm nay. Cố hoàn thành nốt trước khi đi ngủ nhé! 💪`,date:today});
    }
  }

  if(d.messages.length>50)d.messages=d.messages.slice(0,50);
  d.lastCheck=today;if(!CU.isDemo)saveStore();renderMessages();
}

function getSubjectWarnMsg(s) {
  const sch = s ? (D()?.schedule[s.id] || {}) : {};
  const allDays = Object.keys(sch);
  const doneDays = allDays.filter(k => sch[k].completed).length;
  const rate = allDays.length ? Math.round((doneDays/allDays.length)*100) : 0;
  if(s.score < 5) return `⚡ Môn ${s.name} đang ở mức điểm thấp (${s.score.toFixed(1)}đ). Cần học bù ngay hôm nay! Đặt mục tiêu ôn tập ít nhất 45 phút.`;
  if(rate < 30) return `📉 Tỷ lệ hoàn thành ${s.name} chỉ ${rate}%. Hãy học bù buổi hôm nay để cải thiện tiến độ.`;
  return `📌 Bạn chưa học ${s.name} hôm nay. Đừng để gián đoạn chuỗi học tập nhé!`;
}

function getMissedSev(n){
  if(n===1)return{title:'😢 Hôm nay chưa học môn nào',msg:'Đừng lo, ngày mai cố lên! Bắt đầu bằng 1 môn nhỏ thôi. 💪'};
  if(n===2)return{title:'⚠️ 2 ngày không học',msg:'Hãy quay lại ngay! Mở app và hoàn thành ít nhất 1 buổi hôm nay. 🔥'};
  if(n===3)return{title:'🚨 3 ngày không học!',msg:'Chuỗi ngày học sắp mất! Bắt đầu lại ngay - dù 15 phút thôi cũng được! ⚡'};
  return{title:`❌ ${n} ngày không học`,msg:`Mục tiêu đang xa dần. Mỗi ngày trôi qua là 1 cơ hội bị lãng phí. Hành động ngay hôm nay! 🎯`};
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
  
  // AI Prediction
  const pred=document.getElementById('ai-prediction');
  if(pred&&d){
    const weak=d.subjects.filter(s=>s.score<5||(s.selfRating||50)<=25);
    const upcoming=d.exams.filter(e=>new Date(e.date)>=new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date));
    const streakOk=d.streak.cur>=3;
    let predictions=[];
    if(rate>=70) predictions.push('🟢 <b>Tiến độ tốt</b> – Khả năng hoàn thành kế hoạch cao!');
    else if(rate>=40) predictions.push('🟡 <b>Tiến độ trung bình</b> – Cần tăng cường 20% để đạt mục tiêu.');
    else predictions.push('🔴 <b>Tiến độ thấp</b> – AI khuyên học bù vào cuối tuần!');
    if(weak.length) predictions.push(`⚠️ <b>Rủi ro</b>: ${weak.map(s=>s.name).join(', ')} có thể ảnh hưởng kết quả thi.`);
    if(upcoming.length){
      const days=Math.ceil((new Date(upcoming[0].date)-new Date())/864e5);
      const needed=Math.ceil(total*(1-done/total));
      if(days>0) predictions.push(`📅 <b>${upcoming[0].name}</b> còn ${days} ngày – cần hoàn thành ~${needed} buổi còn lại.`);
    }
    if(streakOk) predictions.push(`🔥 <b>Chuỗi ${d.streak.cur} ngày</b> – Thói quen học tốt, tiếp tục duy trì!`);
    pred.innerHTML=predictions.map(p=>`<div style="margin-bottom:8px">• ${p}</div>`).join('')||'Thêm môn học và hoàn thành buổi học để AI phân tích!';
  }

  // XP Card
  const xpCard=document.getElementById('analytics-xp');
  if(xpCard&&d){
    const xp=d.xp||0;const lv=XP_LEVELS.find(l=>xp>=l.min&&xp<l.max)||XP_LEVELS[XP_LEVELS.length-1];
    const next=XP_LEVELS.find(l=>l.lvl===lv.lvl+1);
    const pct=next?Math.min(100,((xp-lv.min)/(lv.max-lv.min))*100):100;
    const needed=next?next.min-xp:0;
    xpCard.innerHTML=`
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
        <div style="font-size:36px">${['🌱','📖','🎓','🧠','🏆'][lv.lvl-1]}</div>
        <div>
          <div style="font-size:18px;font-weight:800;color:#f59e0b">Level ${lv.lvl} – ${lv.name}</div>
          <div style="font-size:13px;color:#888">${xp} XP tích lũy${next?` · Cần thêm ${needed} XP để lên Level ${lv.lvl+1}`:' · Đã đạt cấp độ tối đa!'}</div>
        </div>
      </div>
      <div style="height:10px;background:#e5e7eb;border-radius:5px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#ffd700,#ff8c00);border-radius:5px;transition:width .5s"></div>
      </div>
      <div style="font-size:12px;color:#aaa;margin-top:8px">💡 +20 XP mỗi buổi học hoàn thành · +5 XP mỗi lần dùng AI chat</div>`;
  }
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
  if(!d||!d.subjects.length){body.innerHTML='<tr><td colspan="7" style="text-align:center;color:#999;padding:20px">Chưa có dữ liệu</td></tr>';return;}
  body.innerHTML=d.subjects.map(s=>{
    let t=0,c=0,m=0;
    Object.keys(d.schedule[s.id]||{}).forEach(k=>{t++;if(d.schedule[s.id][k].completed){c++;m+=d.schedule[s.id][k].duration||0;}});
    const r=t?((c/t)*100).toFixed(1):0;
    const sr=s.selfRating||50;const srLabel=sr<=25?'😰 Yếu':sr<=50?'😐 TB':sr<=75?'😊 Khá':'💪 Giỏi';
    const srColor=sr<=25?'#ef4444':sr<=50?'#f59e0b':sr<=75?'#10b981':'#667eea';
    return`<tr><td><strong>${s.name}</strong></td><td>${s.score.toFixed(1)}</td><td style="color:${srColor};font-weight:700">${srLabel}</td><td>${t}</td><td>${c}</td><td><div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${r}%"></div></div><span style="font-weight:600;min-width:40px">${r}%</span></div></td></tr>`;
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
  const d=D();
  const weak=d?d.subjects.filter(s=>s.score<5||(s.selfRating||50)<=25).map(s=>s.name):[];
  let greeting=`Xin chào ${CU?CU.fullname:'bạn'}! 👋 Mình là **Smart Study AI** – được tích hợp Claude AI thực sự!\n\n`;
  if(weak.length) greeting+=`⚠️ Mình thấy bạn cần ưu tiên: **${weak.join(', ')}**\n\n`;
  greeting+=`Hỏi mình bất cứ điều gì – chiến lược ôn thi, phân tích điểm yếu, hay lời khuyên cá nhân hóa nhé!`;
  botMsg(t,greeting,['Chiến lược ôn thi','Môn nào yếu?','Lịch hôm nay','Động viên mình']);
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
  const d=D();
  // Build context about the user
  let ctx='';
  if(d){
    const weak=d.subjects.filter(s=>s.score<5||(s.selfRating||50)<=25).map(s=>s.name).join(', ');
    const upcoming=d.exams.filter(e=>new Date(e.date)>=new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date));
    let total=0,done=0;
    d.subjects.forEach(s=>{Object.keys(d.schedule[s.id]||{}).forEach(k=>{total++;if(d.schedule[s.id][k].completed)done++;});});
    ctx=`Học sinh: ${CU?CU.fullname:''}. Môn học: ${d.subjects.map(s=>`${s.name}(${s.score}đ,tự đánh giá ${s.selfRating||50}%)`).join(', ')||'chưa có'}. Môn yếu: ${weak||'không có'}. Tiến độ: ${done}/${total} buổi. Chuỗi học: ${d.streak.cur} ngày. Kỳ thi sắp tới: ${upcoming.slice(0,2).map(e=>`${e.name} còn ${Math.ceil((new Date(e.date)-new Date())/864e5)} ngày`).join(', ')||'không có'}. Phong cách học: ${d.studyStyle||'cân bằng'}. Giờ học tốt nhất: ${d.peakHour||18}:00.`;
  }
  
  const systemPrompt=`Bạn là Smart Study AI – trợ lý học tập thông minh cho học sinh THCS-THPT Việt Nam. Bạn trả lời bằng tiếng Việt, thân thiện, ngắn gọn (tối đa 120 từ), dùng emoji phù hợp. Dữ liệu học sinh: ${ctx} Nhiệm vụ của bạn: phân tích dữ liệu cá nhân, đưa ra lời khuyên học tập cụ thể, động viên học sinh, và trả lời câu hỏi về học tập. Khi học sinh hỏi về chiến lược học, hãy đề xuất dựa trên điểm số và tự đánh giá của họ. Đây là AI thật dùng Claude API – không phải chatbot đơn giản.`;

  // Show typing indicator
  const el=document.getElementById('chat-msgs-'+t);
  const typingId='typing-'+Date.now();
  const typingDiv=document.createElement('div');
  typingDiv.className='msg-bubble-wrap bot';typingDiv.id=typingId;
  typingDiv.innerHTML='<div class="bubble" style="opacity:.6">🤖 <span style="letter-spacing:3px">···</span></div>';
  el.appendChild(typingDiv);el.scrollTop=el.scrollHeight;
}
  

// ============================================================
// PROFILE
// ============================================================
function openProfile(){
  if(!CU)return;const d=CU.data;
  document.getElementById('pm-avatar').src=CU.avatar;
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
    const animalNames=['🐼 Gấu Trúc','🦊 Cáo','🐰 Thỏ','🐻 Gấu','🐱 Mèo','🐘 Voi','🐶 Chó','🐧 Chim Cánh Cụt'];
    img.src=av;img.alt=animalNames[i]||'Avatar '+(i+1);img.title=animalNames[i]||'Avatar '+(i+1);
    img.onclick=()=>selectAvatar(i);
    grid.appendChild(img);
  });
}
function selectAvatar(i){
  if(!CU)return;
  CU.avatar=AVATARS[i];
  saveStore();
  document.getElementById('avatar-img').src=CU.avatar;
  document.getElementById('pm-avatar').src=CU.avatar;
  renderAvatarPicker();
}

// Expose all global functions
// ============================================================
// SECURITY MODAL (standalone)
// ============================================================
function openSecurity(){
  if(!CU)return;
  document.getElementById('avatar-menu').classList.remove('open');
  // reset fields
  ['sm-cur','sm-new','sm-conf'].forEach(id=>{const el=document.getElementById(id);if(el){el.value='';el.classList.remove('input-err');}});
  ['sm-cur-err','sm-conf-err'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('show');});
  const f=document.getElementById('sm-str-fill');if(f){f.style.width='0';}
  const l=document.getElementById('sm-str-label');if(l)l.textContent='';
  ['sm-r1','sm-r2','sm-r3'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('pass');});
  const t=document.getElementById('sm-toast');if(t)t.classList.remove('show');
  // set device info
  const di=document.getElementById('sm-device-info');
  const lt=document.getElementById('sm-login-time');
  if(di)di.textContent=(navigator.userAgent.includes('Chrome')?'Chrome':navigator.userAgent.includes('Firefox')?'Firefox':'Trình duyệt')+' · '+(navigator.platform||'Không rõ');
  if(lt&&CU)lt.textContent='🕐 Đăng nhập: '+new Date(parseInt(CU.id)).toLocaleString('vi-VN');
  // reset to first tab
  switchSecModal('pw', document.querySelector('.sec-modal-tab'));
  document.getElementById('security-modal').classList.add('open');
}
function closeSecurity(){document.getElementById('security-modal').classList.remove('open');}
function switchSecModal(tab,el){
  document.querySelectorAll('.sec-modal-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.sec-modal-panel').forEach(p=>p.classList.remove('active'));
  if(el)el.classList.add('active');
  document.getElementById('sec-panel-'+tab).classList.add('active');
}
function smToggle(id,icon){
  const inp=document.getElementById(id);
  inp.type=inp.type==='password'?'text':'password';
  icon.textContent=inp.type==='password'?'👁️':'🙈';
}
function smStrength(val){
  const fill=document.getElementById('sm-str-fill');
  const label=document.getElementById('sm-str-label');
  const r1=document.getElementById('sm-r1');
  const r2=document.getElementById('sm-r2');
  const r3=document.getElementById('sm-r3');
  const hasLen=val.length>=6, hasUp=/[A-Z]/.test(val), hasNum=/[0-9]/.test(val), hasSp=/[!@#$%^&*]/.test(val);
  r1&&r1.classList.toggle('pass',hasLen);
  r2&&r2.classList.toggle('pass',hasUp);
  r3&&r3.classList.toggle('pass',hasNum);
  if(!val.length){fill.style.width='0';label.textContent='';return;}
  const score=[hasLen,hasUp,hasNum,hasSp,val.length>=10].filter(Boolean).length;
  const lv=[
    {w:'20%',c:'#ef4444',t:'😟 Rất yếu'},
    {w:'40%',c:'#f97316',t:'😐 Yếu'},
    {w:'60%',c:'#eab308',t:'🙂 Trung bình'},
    {w:'80%',c:'#22c55e',t:'😊 Mạnh'},
    {w:'100%',c:'#10b981',t:'🔥 Rất mạnh!'}
  ][Math.min(score,4)];
  fill.style.width=lv.w;fill.style.background=lv.c;
  label.textContent=lv.t;label.style.color=lv.c;
}
function smSubmit(){
  if(!CU)return;
  const cur=document.getElementById('sm-cur').value.trim();
  const nw=document.getElementById('sm-new').value.trim();
  const conf=document.getElementById('sm-conf').value.trim();
  const curErr=document.getElementById('sm-cur-err');
  const confErr=document.getElementById('sm-conf-err');
  const btn=document.getElementById('sm-btn');
  // reset
  [document.getElementById('sm-cur'),document.getElementById('sm-new'),document.getElementById('sm-conf')].forEach(el=>el&&el.classList.remove('input-err'));
  curErr.classList.remove('show'); confErr.classList.remove('show');
  document.getElementById('sm-toast').classList.remove('show');
  if(CU.isDemo){curErr.textContent='⚠️ Tài khoản demo không thể đổi mật khẩu!';curErr.classList.add('show');document.getElementById('sm-cur').classList.add('input-err');return;}
  if(!cur||cur!==CU.password){curErr.textContent='❌ Mật khẩu hiện tại không đúng!';curErr.classList.add('show');document.getElementById('sm-cur').classList.add('input-err');return;}
  if(nw.length<6){confErr.textContent='❌ Mật khẩu mới phải có ít nhất 6 ký tự!';confErr.classList.add('show');document.getElementById('sm-new').classList.add('input-err');return;}
  if(nw===cur){confErr.textContent='⚠️ Mật khẩu mới phải khác mật khẩu cũ!';confErr.classList.add('show');document.getElementById('sm-new').classList.add('input-err');return;}
  if(nw!==conf){confErr.textContent='❌ Mật khẩu xác nhận không khớp!';confErr.classList.add('show');document.getElementById('sm-conf').classList.add('input-err');return;}
  btn.disabled=true;btn.textContent='⏳ Đang cập nhật...';
  setTimeout(()=>{
    CU.password=nw; saveStore();
    ['sm-cur','sm-new','sm-conf'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
    document.getElementById('sm-str-fill').style.width='0';
    document.getElementById('sm-str-label').textContent='';
    ['sm-r1','sm-r2','sm-r3'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('pass');});
    btn.disabled=false; btn.textContent='🔐 Cập nhật mật khẩu';
    document.getElementById('sm-toast').classList.add('show');
    setTimeout(()=>document.getElementById('sm-toast').classList.remove('show'),4000);
  },800);
}
function smLogoutAll(){
  if(confirm('Bạn có chắc muốn đăng xuất khỏi tất cả thiết bị?')){
    closeSecurity(); setTimeout(()=>doLogout(),200);
  }
}
window.openSecurity=openSecurity;
window.calPrev=calPrev;
window.calNext=calNext;
window.switchSchView=switchSchView;
window.filterMsgs=filterMsgs;
window.clearMessages=clearMessages;

// ============================================================
// SIDEBAR TOGGLE
// ============================================================
function toggleSidebar(){
  const sb=document.getElementById('sidebar');
  const overlay=document.getElementById('sidebar-overlay');
  const isMobile=window.innerWidth<=768;
  const isCollapsed=sb.classList.contains('collapsed');
  sb.classList.toggle('collapsed');
  if(isMobile){
    overlay.classList.toggle('show',isCollapsed);
  }
  syncToggleBtn();
}

// Update toggle button position on init and resize
function syncToggleBtn(){
  const sb=document.getElementById('sidebar');
  const btn=document.getElementById('sidebar-toggle');
  if(!sb||!btn)return;
  if(window.innerWidth<=768){btn.style.display='none';return;}
  btn.style.display='flex';
  const nowCollapsed=sb.classList.contains('collapsed');
  btn.style.left=nowCollapsed?'11px':'260px';
  const icon=document.getElementById('sidebar-toggle-icon');
  if(icon) icon.textContent=nowCollapsed?'▶':'◀';
}
window.addEventListener('resize',syncToggleBtn);

// Auto-collapse on mobile on init
(function initSidebar(){
  if(window.innerWidth<=768){
    const sb=document.getElementById('sidebar');
    if(sb)sb.classList.add('collapsed');
  }
  setTimeout(syncToggleBtn,50);
})();

window.toggleSidebar=toggleSidebar;
window.closeSecurity=closeSecurity;
window.switchSecModal=switchSecModal;
window.smToggle=smToggle;
window.smStrength=smStrength;
window.smSubmit=smSubmit;
window.smLogoutAll=smLogoutAll;


// ============================================================
// MUSIC PLAYER - Web Audio API Lo-fi Generator (real sounding)
// ============================================================
(function(){
  // ================================================================
  // 8 bài lo-fi chill khác nhau – mỗi bài có mood/scale/BPM riêng
  // ================================================================
  const TRACKS = [
    {name:'Café Sáng Sớm',      artist:'Lo-fi Chill',    mood:'☕ Cozy Morning',   emoji:'☕', grad:'linear-gradient(135deg,#f6d365,#fda085)', bpm:72, key:0,  style:'lofi'},
    {name:'Mưa Nhẹ Buổi Chiều', artist:'Rain Vibes',     mood:'🌧️ Rainy Afternoon',emoji:'🌧️', grad:'linear-gradient(135deg,#4facfe,#00f2fe)', bpm:63, key:5,  style:'ambient'},
    {name:'Thư Viện Yên Tĩnh',  artist:'Study Beats',    mood:'📚 Deep Focus',     emoji:'📚', grad:'linear-gradient(135deg,#43e97b,#38f9d7)', bpm:68, key:2,  style:'minimal'},
    {name:'Hoàng Hôn Tím',      artist:'Sunset Lofi',    mood:'🌅 Sunset Glow',    emoji:'🌅', grad:'linear-gradient(135deg,#fa709a,#fee140)', bpm:70, key:7,  style:'dreamy'},
    {name:'Không Gian Tĩnh',    artist:'Space Ambient',  mood:'🌌 Space Float',    emoji:'🌌', grad:'linear-gradient(135deg,#a18cd1,#fbc2eb)', bpm:58, key:9,  style:'space'},
    {name:'Rừng Xanh Sớm Mai',  artist:'Nature Lo-fi',   mood:'🌿 Forest Calm',    emoji:'🌿', grad:'linear-gradient(135deg,#d4fc79,#96e6a1)', bpm:66, key:3,  style:'nature'},
    {name:'Jazz Đêm Khuya',     artist:'Chill Jazz',     mood:'🎷 Midnight Jazz',  emoji:'🎷', grad:'linear-gradient(135deg,#f093fb,#f5576c)', bpm:80, key:4,  style:'jazz'},
    {name:'Biển Lúc Bình Minh',  artist:'Ocean Chill',   mood:'🌊 Ocean Breeze',   emoji:'🌊', grad:'linear-gradient(135deg,#4facfe,#764ba2)', bpm:60, key:1,  style:'ocean'},
  ];

  let AC = null, masterGain, compressor;
  let scheduledNodes = [];
  let isPlaying = false, curIdx = 0, muted = false, vol = 0.7, looping = false;
  let startedAt = 0, fakeDur = 0;
  let rafId = null;

  function getAC() {
    if (!AC) {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      compressor = AC.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 10;
      compressor.ratio.value = 3;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      masterGain = AC.createGain();
      masterGain.gain.value = vol;
      masterGain.connect(compressor);
      compressor.connect(AC.destination);
    }
    if (AC.state === 'suspended') AC.resume();
    return AC;
  }

  // ── Scales ────────────────────────────────────────────────────────
  const SCALES = {
    minor:     [0,2,3,5,7,8,10],   // natural minor – buồn nhẹ
    major:     [0,2,4,5,7,9,11],   // major – tươi sáng
    penta:     [0,2,4,7,9],        // major pentatonic – nhẹ nhàng, không gây cấn
    dorianPen: [0,3,5,7,10],       // dorian pentatonic – jazz chill
    lydian:    [0,2,4,6,7,9,11],   // lydian – dreamy, nổi
  };
  const STYLE_SCALES = {
    lofi:    SCALES.penta,
    ambient: SCALES.minor,
    minimal: SCALES.penta,
    dreamy:  SCALES.lydian,
    space:   SCALES.minor,
    nature:  SCALES.major,
    jazz:    SCALES.dorianPen,
    ocean:   SCALES.lydian,
  };

  function noteFreq(root, scaleNotes, degree, octave) {
    const n = scaleNotes[((degree % scaleNotes.length) + scaleNotes.length) % scaleNotes.length];
    const extra = Math.floor(degree / scaleNotes.length) * 12;
    const semi = root + n + extra;
    return 440 * Math.pow(2, (semi - 69 + octave * 12) / 12);
  }

  // ── Safe time (prevent negative AudioParam times) ────────────────
  function st(t) { return Math.max(AC.currentTime + 0.001, t); }

  // ── Reverb – dài, ấm, không harsh ────────────────────────────────
  function makeReverb(ac, dur, decay) {
    const len = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        // Smooth exponential decay, no sharp transients
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    const conv = ac.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  // ── Lo-fi filter chain – ấm, không rè ───────────────────────────
  // Lowpass thấp hơn nhiều (2000Hz), boost bass nhẹ, cut treble mạnh
  function makeLofiChain(ac) {
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2200; lp.Q.value = 0.5;

    const mid = ac.createBiquadFilter();
    mid.type = 'peaking'; mid.frequency.value = 800; mid.gain.value = 2; mid.Q.value = 1;

    const ls = ac.createBiquadFilter();
    ls.type = 'lowshelf'; ls.frequency.value = 180; ls.gain.value = 4;

    const hs = ac.createBiquadFilter();
    hs.type = 'highshelf'; hs.frequency.value = 3000; hs.gain.value = -12;

    lp.connect(mid); mid.connect(ls); ls.connect(hs);
    return { input: lp, output: hs };
  }

  // ── Vinyl crackle – cực nhẹ, không ồn ──────────────────────────
  function makeVinyl(ac, dest) {
    const len = ac.sampleRate * 4;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      // Rất thưa, chỉ 0.1% chance pop, nền noise cực nhỏ
      d[i] = (Math.random() * 2 - 1) * (Math.random() < 0.001 ? 0.4 : 0.006);
    }
    const src = ac.createBufferSource();
    src.buffer = buf; src.loop = true;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1200;
    const g = ac.createGain(); g.gain.value = 0.018;
    src.connect(lp); lp.connect(g); g.connect(dest);
    src.start();
    return src;
  }

  // ── Pad chord – sine pha nhau, rất mượt ─────────────────────────
  function makePad(ac, dest, freq, startT, durT, gainVal) {
    const g = ac.createGain();
    const fadeIn = 0.12, fadeOut = 0.18;
    g.gain.setValueAtTime(0, st(startT));
    g.gain.linearRampToValueAtTime(gainVal, st(startT + fadeIn));
    g.gain.setValueAtTime(gainVal, st(startT + durT - fadeOut));
    g.gain.linearRampToValueAtTime(0, st(startT + durT));

    // Stack 2 sines slightly detuned for warmth
    [0, 5].forEach(detune => {
      const osc = ac.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      osc.connect(g);
      osc.start(st(startT));
      osc.stop(st(startT + durT + 0.05));
      scheduledNodes.push(osc);
    });
    g.connect(dest);
    scheduledNodes.push(g);
  }

  // ── Soft bass – sine, ngắn, không boom ──────────────────────────
  function makeBass(ac, dest, freq, startT, durT) {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, st(startT));
    g.gain.linearRampToValueAtTime(0.14, st(startT + 0.02));
    g.gain.exponentialRampToValueAtTime(0.001, st(startT + durT));
    osc.connect(g); g.connect(dest);
    osc.start(st(startT)); osc.stop(st(startT + durT + 0.05));
    scheduledNodes.push(osc, g);
  }

  // ── Soft kick – rất nhẹ, frequency drop ─────────────────────────
  function makeKick(ac, dest, startT, vol) {
    const osc = ac.createOscillator(); osc.type = 'sine';
    const g = ac.createGain();
    osc.frequency.setValueAtTime(90, st(startT));
    osc.frequency.exponentialRampToValueAtTime(30, st(startT + 0.12));
    g.gain.setValueAtTime(vol * 0.5, st(startT));
    g.gain.exponentialRampToValueAtTime(0.001, st(startT + 0.18));
    osc.connect(g); g.connect(dest);
    osc.start(st(startT)); osc.stop(st(startT + 0.22));
    scheduledNodes.push(osc, g);
  }

  // ── Soft snare – noise rất nhẹ ─────────────────────────────────
  function makeSnare(ac, dest, startT, vol) {
    const len = Math.floor(ac.sampleRate * 0.12);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i/len, 2);
    const src = ac.createBufferSource(); src.buffer = buf;
    const bpf = ac.createBiquadFilter(); bpf.type = 'bandpass'; bpf.frequency.value = 2500; bpf.Q.value = 0.8;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol * 0.22, st(startT));
    g.gain.exponentialRampToValueAtTime(0.001, st(startT + 0.11));
    src.connect(bpf); bpf.connect(g); g.connect(dest);
    src.start(st(startT));
    scheduledNodes.push(src, g);
  }

  // ── Hi-hat – rất nhẹ, thưa thớt ────────────────────────────────
  function makeHat(ac, dest, startT, vol, isOpen) {
    const len = Math.floor(ac.sampleRate * (isOpen ? 0.08 : 0.025));
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1);
    const src = ac.createBufferSource(); src.buffer = buf;
    const hpf = ac.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 9000;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol * (isOpen ? 0.04 : 0.025), st(startT));
    g.gain.exponentialRampToValueAtTime(0.001, st(startT + len/ac.sampleRate));
    src.connect(hpf); hpf.connect(g); g.connect(dest);
    src.start(st(startT));
    scheduledNodes.push(src, g);
  }

  // ── Melody note – sine nhẹ, sparse ──────────────────────────────
  function makeMelody(ac, dest, freq, startT, durT, gainVal) {
    const osc = ac.createOscillator(); osc.type = 'sine';
    osc.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, st(startT));
    g.gain.linearRampToValueAtTime(gainVal, st(startT + 0.04));
    g.gain.setValueAtTime(gainVal, st(startT + durT * 0.7));
    g.gain.linearRampToValueAtTime(0, st(startT + durT));
    osc.connect(g); g.connect(dest);
    osc.start(st(startT)); osc.stop(st(startT + durT + 0.05));
    scheduledNodes.push(osc, g);
  }

  // ── Main schedule function ────────────────────────────────────────
  function scheduleTrack(track) {
    const ac = getAC();
    const now = ac.currentTime;
    const scale = STYLE_SCALES[track.style] || SCALES.penta;
    const root = track.key;
    const bps = track.bpm / 60;
    const beat = 1 / bps;          // 1 beat duration
    const bar  = beat * 4;         // 1 bar = 4 beats
    const bars = 48;               // total bars
    fakeDur = bars * bar;

    // Signal chain
    const reverb  = makeReverb(ac, 3.5, 2.5);
    const lofi    = makeLofiChain(ac);
    const dryGain = ac.createGain(); dryGain.gain.value = 0.72;
    const wetGain = ac.createGain(); wetGain.gain.value = 0.28;
    lofi.output.connect(dryGain); dryGain.connect(masterGain);
    lofi.output.connect(reverb);  reverb.connect(wetGain); wetGain.connect(masterGain);

    // Chord progressions per style
    const PROGS = {
      lofi:    [[0,2,4],[5,0,2],[3,5,0],[2,4,6]],
      ambient: [[0,2,4],[2,4,6],[5,0,2],[3,5,0]],
      minimal: [[0,2,4],[4,6,1],[2,4,6],[0,2,4]],
      dreamy:  [[0,2,4],[3,5,0],[1,3,5],[4,6,1]],
      space:   [[0,2,4],[2,4,6],[4,6,1],[5,0,2]],
      nature:  [[0,2,4],[5,0,2],[3,5,0],[1,3,5]],
      jazz:    [[0,2,4],[2,4,6],[1,3,5],[3,5,0]],
      ocean:   [[0,2,4],[4,6,1],[2,4,6],[5,0,2]],
    };
    const prog = PROGS[track.style] || PROGS.lofi;

    // Beat patterns per style (1=kick, 2=snare, 3=hat, 4=open hat)
    // Each bar = 16 steps (16th notes)
    const PATTERNS = {
      lofi:    [1,0,3,0, 2,0,3,0, 1,0,3,3, 2,0,3,0],
      ambient: [1,0,0,0, 0,0,2,0, 0,0,0,0, 2,0,0,0],
      minimal: [1,0,0,3, 2,0,3,0, 1,0,0,0, 2,0,0,3],
      dreamy:  [1,0,3,0, 0,0,2,0, 1,0,0,3, 2,0,3,0],
      space:   [1,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      nature:  [1,0,3,0, 2,0,3,0, 1,3,0,3, 2,0,3,0],
      jazz:    [1,0,3,3, 2,0,3,0, 1,3,0,3, 2,3,3,0],
      ocean:   [1,0,0,0, 2,0,0,3, 1,0,3,0, 2,0,0,0],
    };
    const pattern = PATTERNS[track.style] || PATTERNS.lofi;
    const stepDur = beat / 4; // 16th note

    // Drum volume per style (ambient/space = very quiet drums)
    const drumVol = {lofi:1, ambient:0.3, minimal:0.6, dreamy:0.55, space:0.2, nature:0.75, jazz:0.85, ocean:0.4};
    const dv = drumVol[track.style] || 0.7;

    for (let b = 0; b < bars; b++) {
      const barT = now + b * bar;
      const chord = prog[b % prog.length];
      const isBreak = (b % 8 === 7); // every 8th bar: empty/half bar for breathing

      // ── Pads (slow attack, full bar) ─────────────────────────────
      if (!isBreak) {
        chord.forEach((deg, ci) => {
          const freq = noteFreq(root, scale, deg, ci === 0 ? 3 : 4);
          makePad(ac, lofi.input, freq, barT, bar * 0.98, 0.06 - ci * 0.01);
        });
      }

      // ── Bass (root, every bar, soft) ─────────────────────────────
      if (!isBreak && b % 2 === 0) {
        const bassFreq = noteFreq(root, scale, chord[0], 2);
        makeBass(ac, masterGain, bassFreq, barT, beat * 0.8);
        // sometimes add passing bass on beat 3
        if (Math.random() < 0.4) {
          makeBass(ac, masterGain, noteFreq(root, scale, chord[1], 2), barT + beat * 2, beat * 0.6);
        }
      }

      // ── Drums (16th note grid) ────────────────────────────────────
      for (let s = 0; s < 16; s++) {
        const sT = barT + s * stepDur;
        const hit = pattern[s];
        if (hit === 1) makeKick(ac, masterGain, sT, dv);
        if (hit === 2) makeSnare(ac, masterGain, sT, dv);
        if (hit === 3) makeHat(ac, masterGain, sT, dv, false);
        if (hit === 4) makeHat(ac, masterGain, sT, dv, true);
        // Random ghost snare (very quiet)
        if (hit === 0 && Math.random() < 0.04) makeHat(ac, masterGain, sT, dv * 0.3, false);
      }

      // ── Melody (sparse, only on even bars, skip breaks) ──────────
      if (!isBreak && b % 2 === 0 && Math.random() < 0.65) {
        const melBar = b % 4;
        const melDegs = [chord[2], chord[0], chord[1], chord[2]];
        const positions = [0, beat, beat*2.5, beat*3.2];
        const numNotes = track.style === 'ambient' || track.style === 'space' ? 2 : 3;
        for (let n = 0; n < numNotes; n++) {
          if (Math.random() < 0.7) {
            const melFreq = noteFreq(root, scale, melDegs[n % melDegs.length] + (melBar > 1 ? 1 : 0), 5);
            const noteLen = beat * (0.4 + Math.random() * 0.5);
            makeMelody(ac, lofi.input, melFreq, barT + positions[n], noteLen, 0.045);
          }
        }
      }
    }

    // Vinyl noise (very quiet)
    const vinyl = makeVinyl(ac, masterGain);
    scheduledNodes.push(vinyl);

    startedAt = now;

    // Auto next
    const autoTimer = looping
      ? setTimeout(() => { if (isPlaying) _restart(); }, fakeDur * 1000 - 400)
      : setTimeout(() => { if (isPlaying) window.mpNext(); }, fakeDur * 1000 - 300);
    scheduledNodes._timer = autoTimer;
  }

  function _restart() { stopAll(); scheduleTrack(TRACKS[curIdx]); startRAF(); }

  function stopAll() {
    if (scheduledNodes._timer) clearTimeout(scheduledNodes._timer);
    scheduledNodes.forEach(n => { try { n.stop && n.stop(0); n.disconnect && n.disconnect(); } catch(e){} });
    scheduledNodes = [];
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function startRAF() {
    if (rafId) cancelAnimationFrame(rafId);
    function tick() {
      if (!isPlaying || !AC) return;
      const cur = Math.max(0, AC.currentTime - startedAt);
      const pct = fakeDur > 0 ? Math.min((cur / fakeDur) * 100, 100) : 0;
      const fill = document.getElementById('mp-prog-fill');
      if (fill) fill.style.width = pct + '%';
      const curEl = document.getElementById('mp-cur-time');
      if (curEl) curEl.textContent = fmtTime(cur);
      const durEl = document.getElementById('mp-dur-time');
      if (durEl) durEl.textContent = fmtTime(fakeDur);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }

  function fmtTime(s) {
    s = Math.max(0, s);
    const m = Math.floor(s / 60);
    return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  // ── UI helpers ───────────────────────────────────────────────────
  window.mpToggle = function() {
    if (isPlaying) {
      stopAll(); isPlaying = false; updateUI(); setVisualizerActive(false);
    } else {
      getAC(); isPlaying = true;
      scheduleTrack(TRACKS[curIdx]); startRAF(); updateUI(); setVisualizerActive(true);
    }
  };

  window.mpNext = function() {
    const was = isPlaying;
    stopAll(); isPlaying = false;
    curIdx = (curIdx + 1) % TRACKS.length;
    setTrackUI(); updateUI();
    if (was) { isPlaying = true; scheduleTrack(TRACKS[curIdx]); startRAF(); setVisualizerActive(true); }
  };

  window.mpPrev = function() {
    const was = isPlaying;
    stopAll(); isPlaying = false;
    curIdx = (curIdx - 1 + TRACKS.length) % TRACKS.length;
    setTrackUI(); updateUI();
    if (was) { isPlaying = true; scheduleTrack(TRACKS[curIdx]); startRAF(); setVisualizerActive(true); }
  };

  window.mpSelectTrack = function(i) {
    stopAll(); isPlaying = true;
    curIdx = i; setTrackUI(); updateUI();
    getAC(); scheduleTrack(TRACKS[curIdx]); startRAF(); setVisualizerActive(true);
  };

  window.mpToggleLoop = function() {
    looping = !looping;
    const btn = document.getElementById('mp-loop-btn');
    if (btn) btn.style.color = looping ? '#a78bfa' : '#9ca3af';
  };

  window.mpSetVolume = function(val) {
    vol = val / 100;
    if (masterGain) masterGain.gain.value = muted ? 0 : vol;
    const fill = document.getElementById('mp-vol-fill');
    if (fill) fill.style.width = val + '%';
    const icon = document.getElementById('mp-vol-icon');
    if (icon) icon.textContent = val == 0 ? '🔇' : val < 40 ? '🔈' : '🔊';
  };

  window.mpToggleMute = function() {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : vol;
    const icon = document.getElementById('mp-vol-icon');
    if (icon) icon.textContent = muted ? '🔇' : '🔊';
  };

  window.mpSeek = function(e) {
    if (!isPlaying || !AC || !fakeDur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    stopAll();
    startedAt = AC.currentTime - pct * fakeDur;
    scheduleTrack(TRACKS[curIdx]);
    startRAF();
  };

  function setVisualizerActive(active) {
    document.querySelectorAll('.mp-bar').forEach(b => b.classList.toggle('active', active));
    const cover = document.getElementById('mp-cover');
    if (cover) cover.style.animation = active ? 'coverSpin 8s linear infinite' : 'none';
  }

  function setTrackUI() {
    const t = TRACKS[curIdx];
    const s = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
    s('mp-track-name', t.name); s('mp-track-artist', t.artist); s('mp-track-mood', t.mood);
    s('mp-cover-emoji', t.emoji);
    const cover = document.getElementById('mp-cover');
    if (cover) cover.style.background = t.grad;
    const fill = document.getElementById('mp-prog-fill');
    if (fill) fill.style.width = '0%';
    const bps = t.bpm / 60, bar = 1/bps*4;
    fakeDur = 48 * bar;
    s('mp-dur-time', fmtTime(fakeDur));
    document.querySelectorAll('.mp-track-item').forEach((el,i) => el.classList.toggle('active', i===curIdx));
  }

  function updateUI() {
    setTrackUI();
    const icon = document.getElementById('mp-play-icon');
    if (icon) icon.innerHTML = isPlaying
      ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
      : '<path d="M8 5v14l11-7z"/>';
  }

  function buildPlaylist() {
    const list = document.getElementById('mp-track-list');
    if (!list) return;
    list.innerHTML = TRACKS.map((t, i) => `
      <div class="mp-track-item${i===curIdx?' active':''}" onclick="mpSelectTrack(${i})">
        <div class="mp-track-thumb" style="background:${t.grad}">${t.emoji}</div>
        <div class="mp-track-meta">
          <div class="mp-track-meta-name">${t.name}</div>
          <div class="mp-track-meta-sub">${t.artist} • ${t.bpm} BPM</div>
        </div>
        <div class="mp-eq-icon"><span></span><span></span><span></span></div>
        <div class="mp-track-dur">${fmtTime(48*4/(t.bpm/60))}</div>
      </div>`).join('');
  }

  setTimeout(() => { buildPlaylist(); setTrackUI(); updateUI(); }, 300);
})();
window.enterLogin=enterLogin;
window.toggleTheme=toggleTheme;
window.showLogin=showLogin;
window.showReg=showReg;
window.showForgot=showForgot;
window._authFadeIn=_authFadeIn;
window._authFadeOut=_authFadeOut;
window.togglePw=togglePw;
window.loginDemo=loginDemo;
window.doLogin=doLogin;
window.doRegister=doRegister;
window.doLogout=doLogout;
window.moveNext=moveNext;
window.movePrev=movePrev;
window.sendOTP=sendOTP;
window.verifyOTP=verifyOTP;
window.resetPw=resetPw;
window.enterApp=enterApp;
window.gotoSection=gotoSection;
window.buildSlotGrid=buildSlotGrid;
window.toggleBusy=toggleBusy;
window.saveSlots=saveSlots;
window.addSubject=addSubject;
window.deleteSubject=deleteSubject;
window.generateSchedule=generateSchedule;
window.toggleTask=toggleTask;
window.openProfile=openProfile;
window.closeProfile=closeProfile;
window.selectAvatar=selectAvatar;
window.toggleFab=toggleFab;
window.sendChat=sendChat;
window.handleQR=handleQR;
window.addExam=addExam;
window.deleteExam=deleteExam;
window.startTimer=startTimer;
window.pauseTimer=pauseTimer;
window.addXP=addXP;
window.updateXPBar=updateXPBar;
window.updateAIProfileBadge=updateAIProfileBadge;
window.resetTimer=resetTimer;





// ══ BRIDGE ══
function showLanding(){
  ['app','topbar','login-screen','reg-screen','forgot-screen'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.style.display='none';
  });
  var toggleBtn=document.getElementById('sidebar-toggle');
  if(toggleBtn) toggleBtn.style.display='none';
  var lay=document.getElementById('landing-layer');
  var fix=document.getElementById('landing-fixed');
  if(!lay) return;
  lay.style.display='block'; lay.style.opacity='0';
  lay.classList.remove('hidden');
  if(fix){ fix.style.display='block'; fix.classList.remove('hidden'); }
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ lay.style.opacity='1'; }); });
}

function showAppLogin(){
  var lay=document.getElementById('landing-layer');
  var fix=document.getElementById('landing-fixed');
  if(!lay) return;

  // Bắt đầu fade out landing
  lay.style.transition='opacity 0.55s cubic-bezier(.4,0,.2,1), transform 0.55s cubic-bezier(.4,0,.2,1)';
  lay.style.transform='scale(0.97)';
  lay.style.opacity='0';

  // Hiện login screen ĐỒNG THỜI (overlap 150ms) để không có khoảng đen
  setTimeout(function(){
    var ws=document.getElementById('welcome-screen');
    if(ws) ws.style.display='none';
    _authFadeIn('login-screen');
  }, 150);

  // Ẩn landing sau khi transition xong
  setTimeout(function(){
    lay.style.display='none';
    lay.style.transform='';
    if(fix){ fix.style.display='none'; fix.classList.add('hidden'); }
  }, 560);
}

window.scrollToSection = function(href){
  var layer=document.getElementById('landing-layer');
  var target=document.querySelector(href);
  if(!target||!layer) return;
  var rect=target.getBoundingClientRect();
  var layerRect=layer.getBoundingClientRect();
  layer.scrollTo({top: layer.scrollTop+rect.top-layerRect.top-80, behavior:'smooth'});
};



// ══ LANDING JS ══
(function(){

// ── CURSOR ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e=>{mx=e.clientX;my=e.clientY});
(function loop(){
  rx+=(mx-rx)*.14; ry+=(my-ry)*.14;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.style.transform='translate(-50%,-50%) scale(1.8)');
  el.addEventListener('mouseleave',()=>ring.style.transform='translate(-50%,-50%) scale(1)');
});

// ── STARS CANVAS ──
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars=[];
function resize(){
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  stars=[];
  const count=Math.floor(canvas.width*canvas.height/3500);
  for(let i=0;i<count;i++){
    const r=Math.random();
    stars.push({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      r: r<.7 ? Math.random()*.6+.2 : r<.92 ? Math.random()*1+.8 : Math.random()*1.8+1.5,
      a:Math.random(),
      speed:Math.random()*.008+.002,
      phase:Math.random()*Math.PI*2,
      color: ['#ffffff','#c4b5fd','#93c5fd','#6ee7f7','#f9a8d4'][Math.floor(Math.random()*5)]
    });
  }
}
resize(); window.addEventListener('resize',resize);

let t=0;
function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  t+=.016;
  stars.forEach(s=>{
    const alpha=.3+.5*Math.abs(Math.sin(t*s.speed*60+s.phase));
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=s.color+Math.round(alpha*255).toString(16).padStart(2,'0');
    ctx.fill();
    // sparkle cross for bigger stars
    if(s.r>1.5){
      ctx.strokeStyle=s.color+(Math.round(alpha*.4*255)).toString(16).padStart(2,'0');
      ctx.lineWidth=.5;
      ctx.beginPath();
      ctx.moveTo(s.x-s.r*2.5,s.y); ctx.lineTo(s.x+s.r*2.5,s.y);
      ctx.moveTo(s.x,s.y-s.r*2.5); ctx.lineTo(s.x,s.y+s.r*2.5);
      ctx.stroke();
    }
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// ── BUBBLES ──
function createBubbles(){
  const container=document.getElementById('bubbles');
  for(let i=0;i<18;i++){
    const b=document.createElement('div');
    b.className='bubble';
    const size=Math.random()*80+20;
    const colors=[
      'radial-gradient(circle at 35% 35%,rgba(255,255,255,.2),rgba(147,51,234,.08) 50%,transparent 70%)',
      'radial-gradient(circle at 35% 35%,rgba(255,255,255,.15),rgba(34,211,238,.08) 50%,transparent 70%)',
      'radial-gradient(circle at 35% 35%,rgba(255,255,255,.18),rgba(244,114,182,.07) 50%,transparent 70%)',
    ];
    b.style.cssText=`
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      bottom:${-size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border:1px solid rgba(255,255,255,${.05+Math.random()*.1});
      animation-duration:${8+Math.random()*18}s;
      animation-delay:${Math.random()*12}s;
    `;
    container.appendChild(b);
  }
}
createBubbles();
  // Nav scroll
  var layer=document.getElementById('landing-layer');
  var nav=document.getElementById('navbar');
  if(layer&&nav){
    layer.addEventListener('scroll',function(){
      if(layer.scrollTop>30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });
  }
  // Reveal
  var reveals=document.querySelectorAll('#landing-layer .reveal');
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}
      });
    },{threshold:0.1,root:layer});
    reveals.forEach(function(el){obs.observe(el);});
  } else {
    reveals.forEach(function(el){el.classList.add('visible');});
  }
})();


(function(){
  var cv = document.getElementById('auth-stars');
  if(!cv) return;
  var ctx = cv.getContext('2d'), stars=[], raf;
  function init(){
    cv.width=window.innerWidth; cv.height=window.innerHeight;
    stars=[];
    var n=Math.floor(cv.width*cv.height/3800);
    for(var i=0;i<n;i++){
      var r=Math.random();
      stars.push({
        x:Math.random()*cv.width, y:Math.random()*cv.height,
        r:r<.7?Math.random()*.5+.1:r<.92?Math.random()*.9+.5:Math.random()*1.4+1,
        sp:Math.random()*.007+.002, ph:Math.random()*Math.PI*2,
        col:['#fff','#c4b5fd','#93c5fd','#6ee7f7','#f9a8d4'][Math.floor(Math.random()*5)]
      });
    }
  }
  var t=0;
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    t+=.016;
    stars.forEach(function(s){
      var a=.2+.65*Math.abs(Math.sin(t*s.sp*60+s.ph));
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=s.col+Math.round(a*255).toString(16).padStart(2,'0');
      ctx.fill();
    });
    raf=requestAnimationFrame(draw);
  }
  window._authStarsOn=function(){ cv.style.display='block'; init(); if(raf) cancelAnimationFrame(raf); draw(); };
  window._authStarsOff=function(){ cv.style.display='none'; if(raf){cancelAnimationFrame(raf);raf=null;} };
  window.addEventListener('resize',function(){ if(cv.style.display!=='none') init(); });

  // Patch show/hide functions
  var oLogin=window.showLogin, oReg=window.showReg, oForgot=window.showForgot;
  var oEnter=window.enterApp, oLanding=window.showLanding, oAppLogin=window.showAppLogin;
  window.showLogin=function(){ if(oLogin) oLogin.apply(this,arguments); _authStarsOn(); };
  window.showReg=function(){ if(oReg) oReg.apply(this,arguments); _authStarsOn(); };
  window.showForgot=function(){ if(oForgot) oForgot.apply(this,arguments); _authStarsOn(); };
  window.enterApp=function(){ _authStarsOff(); if(oEnter) oEnter.apply(this,arguments); };
  window.showLanding=function(){ _authStarsOff(); if(oLanding) oLanding.apply(this,arguments); };
  window.showAppLogin=function(){ if(oAppLogin) oAppLogin.apply(this,arguments); setTimeout(_authStarsOn, 500); };
})();
