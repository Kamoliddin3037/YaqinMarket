// ==================== SELLFLOWUZ - DATA MODULE ====================
// Ma'lumotlar db.json faylda saqlanadi (server orqali)
// Barcha brauzer, inkognito, telefon — bir xil ma'lumot ko'radi

// ---- Expiry date helper ----
function expiryDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

// ---- Discount calculator ----
function calcDiscount(product) {
  if (!product.expiryDate) return { discount: 0, finalPrice: product.sellPrice || 0, daysLeft: null, label: '' };
  const today = new Date(); today.setHours(0,0,0,0);
  const exp = new Date(product.expiryDate); exp.setHours(0,0,0,0);
  const daysLeft = Math.ceil((exp - today) / 86400000);
  if (daysLeft <= 0) return { discount: 0, finalPrice: product.sellPrice || 0, daysLeft: 0, label: '⚠️ Muddati tugagan' };
  if (daysLeft <= 3) {
    // 1 kun=30%, 2 kun=25%, 3 kun=20%
    const discount = 20 + (3 - daysLeft) * 5;
    const finalPrice = Math.floor((product.sellPrice || 0) * (100 - discount) / 100);
    return { discount, finalPrice, daysLeft, label: `⏳ ${daysLeft} kun qoldi` };
  }
  if (daysLeft <= 7) {
    // 4 kun=15%, 5 kun=13%, 6 kun=12%, 7 kun=10%
    const discount = Math.round(10 + (7 - daysLeft) * (5 / 3));
    const finalPrice = Math.floor((product.sellPrice || 0) * (100 - discount) / 100);
    return { discount, finalPrice, daysLeft, label: `⏳ ${daysLeft} kun qoldi` };
  }
  return { discount: 0, finalPrice: product.sellPrice || 0, daysLeft, label: '' };
}

// ---- Default mahsulotlar ----
function _defaultProducts() {
  return [
    { id:101, name:"Mol go'shti (1 kg)", barcode:"200101", costPrice:90000, sellPrice:110000, unit:"kg", stock:15, category:"Gosht", expiryDate:expiryDate(3) },
    { id:102, name:"Qo'y go'shti (1 kg)", barcode:"200102", costPrice:100000, sellPrice:127000, unit:"kg", stock:12, category:"Gosht", expiryDate:expiryDate(3) },
    { id:103, name:"Tovuq go'shti (1 kg)", barcode:"200103", costPrice:30000, sellPrice:37000, unit:"kg", stock:20, category:"Gosht", expiryDate:expiryDate(3) },
    { id:104, name:"Kurka go'shti (1 kg)", barcode:"200104", costPrice:37000, sellPrice:47000, unit:"kg", stock:10, category:"Gosht", expiryDate:expiryDate(3) },
    { id:105, name:"Doktor kolbasa (1 kg)", barcode:"200105", costPrice:42000, sellPrice:57000, unit:"kg", stock:8, category:"Gosht", expiryDate:expiryDate(10) },
    { id:106, name:"Servelat (1 kg)", barcode:"200106", costPrice:60000, sellPrice:77000, unit:"kg", stock:6, category:"Gosht", expiryDate:expiryDate(10) },
    { id:107, name:"Sosiskalar (1 kg)", barcode:"200107", costPrice:37000, sellPrice:51000, unit:"kg", stock:10, category:"Gosht", expiryDate:expiryDate(7) },
    { id:108, name:"Sut (1L, paket)", barcode:"200108", costPrice:7000, sellPrice:9000, unit:"litr", stock:40, category:"Sut", expiryDate:expiryDate(5) },
    { id:109, name:"Qatiq (1L)", barcode:"200109", costPrice:6000, sellPrice:8000, unit:"litr", stock:30, category:"Sut", expiryDate:expiryDate(5) },
    { id:110, name:"Smetana (400g)", barcode:"200110", costPrice:11000, sellPrice:14000, unit:"dona", stock:20, category:"Sut", expiryDate:expiryDate(7) },
    { id:111, name:"Tvorog (250g)", barcode:"200111", costPrice:9000, sellPrice:12000, unit:"dona", stock:15, category:"Sut", expiryDate:expiryDate(5) },
    { id:112, name:"Pishloq (200g)", barcode:"200112", costPrice:20000, sellPrice:26000, unit:"dona", stock:12, category:"Sut", expiryDate:expiryDate(14) },
    { id:113, name:"Sariyog' (200g)", barcode:"200113", costPrice:16500, sellPrice:20000, unit:"dona", stock:15, category:"Sut", expiryDate:expiryDate(14) },
    { id:114, name:"Non (oq)", barcode:"200114", costPrice:2200, sellPrice:3200, unit:"dona", stock:80, category:"Non", expiryDate:expiryDate(2) },
    { id:115, name:"Non (qo'shimcha)", barcode:"200115", costPrice:2700, sellPrice:3800, unit:"dona", stock:60, category:"Non", expiryDate:expiryDate(2) },
    { id:116, name:"Lavash", barcode:"200116", costPrice:3200, sellPrice:4700, unit:"dona", stock:50, category:"Non", expiryDate:expiryDate(2) },
    { id:117, name:"Bulochka", barcode:"200117", costPrice:1700, sellPrice:2700, unit:"dona", stock:40, category:"Non", expiryDate:expiryDate(2) },
    { id:118, name:"Shokolad (100g)", barcode:"200118", costPrice:13000, sellPrice:18000, unit:"dona", stock:25, category:"Boshqa", expiryDate:expiryDate(180) },
    { id:119, name:"Konfetlar (1 kg)", barcode:"200119", costPrice:30000, sellPrice:42000, unit:"kg", stock:15, category:"Boshqa", expiryDate:expiryDate(180) },
    { id:120, name:"Pechene (1 kg)", barcode:"200120", costPrice:17000, sellPrice:23000, unit:"kg", stock:20, category:"Boshqa", expiryDate:expiryDate(90) },
    { id:121, name:"Muzqaymoq", barcode:"200121", costPrice:6500, sellPrice:10000, unit:"dona", stock:30, category:"Boshqa", expiryDate:expiryDate(30) },
    { id:122, name:"Olma (1 kg)", barcode:"200122", costPrice:10000, sellPrice:13000, unit:"kg", stock:30, category:"Meva", expiryDate:expiryDate(14) },
    { id:123, name:"Banan (1 kg)", barcode:"200123", costPrice:16000, sellPrice:20000, unit:"kg", stock:25, category:"Meva", expiryDate:expiryDate(7) },
    { id:124, name:"Apelsin (1 kg)", barcode:"200124", costPrice:13000, sellPrice:18000, unit:"kg", stock:20, category:"Meva", expiryDate:expiryDate(14) },
    { id:125, name:"Mandarin (1 kg)", barcode:"200125", costPrice:16000, sellPrice:22000, unit:"kg", stock:20, category:"Meva", expiryDate:expiryDate(7) },
    { id:126, name:"Limon (1 kg)", barcode:"200126", costPrice:17000, sellPrice:25000, unit:"kg", stock:15, category:"Meva", expiryDate:expiryDate(14) },
    { id:127, name:"Kartoshka (1 kg)", barcode:"200127", costPrice:4500, sellPrice:6700, unit:"kg", stock:60, category:"Sabzavot", expiryDate:expiryDate(30) },
    { id:128, name:"Piyoz (1 kg)", barcode:"200128", costPrice:3500, sellPrice:5000, unit:"kg", stock:50, category:"Sabzavot", expiryDate:expiryDate(30) },
    { id:129, name:"Sabzi (1 kg)", barcode:"200129", costPrice:3500, sellPrice:5000, unit:"kg", stock:40, category:"Sabzavot", expiryDate:expiryDate(14) },
    { id:130, name:"Pomidor (1 kg)", barcode:"200130", costPrice:12000, sellPrice:17000, unit:"kg", stock:25, category:"Sabzavot", expiryDate:expiryDate(7) },
    { id:131, name:"Bodring (1 kg)", barcode:"200131", costPrice:10000, sellPrice:13000, unit:"kg", stock:20, category:"Sabzavot", expiryDate:expiryDate(7) },
    { id:132, name:"Karam (1 kg)", barcode:"200132", costPrice:4000, sellPrice:5700, unit:"kg", stock:35, category:"Sabzavot", expiryDate:expiryDate(14) },
    { id:133, name:"Coca-Cola (1L)", barcode:"200133", costPrice:7000, sellPrice:9200, unit:"dona", stock:50, category:"Ichimlik", expiryDate:expiryDate(180) },
    { id:134, name:"Fanta (1L)", barcode:"200134", costPrice:7000, sellPrice:9200, unit:"dona", stock:40, category:"Ichimlik", expiryDate:expiryDate(180) },
    { id:135, name:"Sprite (1L)", barcode:"200135", costPrice:7000, sellPrice:9200, unit:"dona", stock:40, category:"Ichimlik", expiryDate:expiryDate(180) },
    { id:136, name:"Limonad (1L)", barcode:"200136", costPrice:5000, sellPrice:7000, unit:"dona", stock:35, category:"Ichimlik", expiryDate:expiryDate(180) },
    { id:137, name:"Suv (1.5L)", barcode:"200137", costPrice:2500, sellPrice:3500, unit:"dona", stock:100, category:"Ichimlik", expiryDate:expiryDate(365) },
    { id:138, name:"Sharbat (1L)", barcode:"200138", costPrice:8000, sellPrice:11000, unit:"dona", stock:30, category:"Ichimlik", expiryDate:expiryDate(180) },
    { id:139, name:"Choy (100g)", barcode:"200139", costPrice:12000, sellPrice:17000, unit:"quti", stock:20, category:"Oziq", expiryDate:expiryDate(365) },
    { id:140, name:"Qahva (100g)", barcode:"200140", costPrice:25000, sellPrice:35000, unit:"quti", stock:15, category:"Oziq", expiryDate:expiryDate(365) },
    { id:141, name:"Tovuq sho'rva (400g)", barcode:"200141", costPrice:8000, sellPrice:12000, unit:"banka", stock:20, category:"Oziq", expiryDate:expiryDate(365) },
    { id:142, name:"Tomatli pasta (0.5L)", barcode:"200142", costPrice:9000, sellPrice:13000, unit:"banka", stock:25, category:"Oziq", expiryDate:expiryDate(365) },
    { id:143, name:"Tuzlama bodring (1L)", barcode:"200143", costPrice:11000, sellPrice:15000, unit:"banka", stock:12, category:"Oziq", expiryDate:expiryDate(365) },
    { id:144, name:"Murabbo (0.5L)", barcode:"200144", costPrice:16000, sellPrice:23000, unit:"banka", stock:10, category:"Oziq", expiryDate:expiryDate(365) },
    { id:145, name:"Kungaboqar yog'i (1L)", barcode:"200145", costPrice:15000, sellPrice:19000, unit:"litr", stock:30, category:"Oziq", expiryDate:expiryDate(365) },
    { id:146, name:"Paxta yog'i (1L)", barcode:"200146", costPrice:14000, sellPrice:17000, unit:"litr", stock:25, category:"Oziq", expiryDate:expiryDate(365) },
    { id:147, name:"Zaytun moyi (0.5L)", barcode:"200147", costPrice:27000, sellPrice:36000, unit:"dona", stock:12, category:"Oziq", expiryDate:expiryDate(365) },
    { id:148, name:"Margarin (200g)", barcode:"200148", costPrice:5500, sellPrice:7500, unit:"dona", stock:20, category:"Oziq", expiryDate:expiryDate(180) },
    { id:149, name:"Guruch (1 kg)", barcode:"200149", costPrice:11000, sellPrice:14000, unit:"kg", stock:40, category:"Oziq", expiryDate:expiryDate(365) },
    { id:150, name:"Grechka (1 kg)", barcode:"200150", costPrice:13000, sellPrice:17000, unit:"kg", stock:25, category:"Oziq", expiryDate:expiryDate(365) },
    { id:151, name:"Mosh (1 kg)", barcode:"200151", costPrice:9000, sellPrice:12000, unit:"kg", stock:20, category:"Oziq", expiryDate:expiryDate(365) },
    { id:152, name:"No'xat (1 kg)", barcode:"200152", costPrice:7000, sellPrice:9700, unit:"kg", stock:20, category:"Oziq", expiryDate:expiryDate(365) },
    { id:153, name:"Un (oliy nav, 1 kg)", barcode:"200153", costPrice:4500, sellPrice:6000, unit:"kg", stock:50, category:"Oziq", expiryDate:expiryDate(180) },
    { id:154, name:"Makaron (500g)", barcode:"200154", costPrice:5000, sellPrice:6700, unit:"dona", stock:35, category:"Oziq", expiryDate:expiryDate(365) },
    { id:155, name:"Vermishel (400g)", barcode:"200155", costPrice:4500, sellPrice:6000, unit:"dona", stock:30, category:"Oziq", expiryDate:expiryDate(365) },
    { id:156, name:"Tuz (1 kg)", barcode:"200156", costPrice:2200, sellPrice:3500, unit:"kg", stock:40, category:"Oziq", expiryDate:expiryDate(9999) },
    { id:157, name:"Murch (20g)", barcode:"200157", costPrice:3500, sellPrice:5500, unit:"dona", stock:30, category:"Oziq", expiryDate:expiryDate(365) },
    { id:158, name:"Zira (50g)", barcode:"200158", costPrice:4500, sellPrice:6700, unit:"dona", stock:25, category:"Oziq", expiryDate:expiryDate(365) },
    { id:159, name:"Qizil qalampir (20g)", barcode:"200159", costPrice:3500, sellPrice:5500, unit:"dona", stock:25, category:"Oziq", expiryDate:expiryDate(365) },
    { id:160, name:"Shakar (1 kg)", barcode:"200160", costPrice:9500, sellPrice:12500, unit:"kg", stock:40, category:"Oziq", expiryDate:expiryDate(9999) },
    { id:161, name:"Asal (0.5L)", barcode:"200161", costPrice:30000, sellPrice:42000, unit:"dona", stock:10, category:"Oziq", expiryDate:expiryDate(365) },
    { id:162, name:"Tovuq tuxumi (10 dona)", barcode:"200162", costPrice:13000, sellPrice:17000, unit:"paket", stock:50, category:"Sut", expiryDate:expiryDate(14) },
    { id:163, name:"Bedana tuxumi (20 dona)", barcode:"200163", costPrice:11000, sellPrice:15000, unit:"paket", stock:20, category:"Sut", expiryDate:expiryDate(14) },
    { id:164, name:"Pelmen (400g)", barcode:"200164", costPrice:16000, sellPrice:22000, unit:"dona", stock:15, category:"Gosht", expiryDate:expiryDate(30) },
    { id:165, name:"Manti (6 dona)", barcode:"200165", costPrice:20000, sellPrice:27000, unit:"dona", stock:10, category:"Gosht", expiryDate:expiryDate(30) },
    { id:166, name:"Somsa (dona)", barcode:"200166", costPrice:5500, sellPrice:7700, unit:"dona", stock:20, category:"Gosht", expiryDate:expiryDate(2) },
    { id:167, name:"Sutcha (400g)", barcode:"200167", costPrice:27000, sellPrice:36000, unit:"dona", stock:10, category:"Bolalar", expiryDate:expiryDate(365) },
    { id:168, name:"Meva pyuresi (100g)", barcode:"200168", costPrice:5500, sellPrice:7500, unit:"dona", stock:15, category:"Bolalar", expiryDate:expiryDate(180) },
    { id:169, name:"Sovun", barcode:"200169", costPrice:6000, sellPrice:8500, unit:"dona", stock:30, category:"Gigiena", expiryDate:expiryDate(730) },
    { id:170, name:"Shampun (200ml)", barcode:"200170", costPrice:17000, sellPrice:23000, unit:"dona", stock:20, category:"Gigiena", expiryDate:expiryDate(730) },
    { id:171, name:"Tish pastasi", barcode:"200171", costPrice:12000, sellPrice:17000, unit:"dona", stock:25, category:"Gigiena", expiryDate:expiryDate(365) },
    { id:172, name:"Pampers (10 dona)", barcode:"200172", costPrice:35000, sellPrice:44000, unit:"paket", stock:15, category:"Bolalar", expiryDate:expiryDate(730) },
    { id:173, name:"Kir yuvish kukuni (1kg)", barcode:"200173", costPrice:16000, sellPrice:22000, unit:"quti", stock:20, category:"Kimyo", expiryDate:expiryDate(730) },
    { id:174, name:"Idish yuvish (0.5L)", barcode:"200174", costPrice:9000, sellPrice:12000, unit:"dona", stock:25, category:"Kimyo", expiryDate:expiryDate(730) },
    { id:175, name:"Gugurt (10 quti)", barcode:"200175", costPrice:2500, sellPrice:4000, unit:"quti", stock:40, category:"Boshqa", expiryDate:expiryDate(9999) },
    { id:176, name:"Bir marta idish (10ta)", barcode:"200176", costPrice:6000, sellPrice:8500, unit:"paket", stock:20, category:"Boshqa", expiryDate:expiryDate(365) },
    { id:177, name:"Mushuk yemi (400g)", barcode:"200177", costPrice:13000, sellPrice:18000, unit:"dona", stock:12, category:"Boshqa", expiryDate:expiryDate(365) },
    { id:178, name:"It yemi (1 kg)", barcode:"200178", costPrice:11000, sellPrice:15000, unit:"kg", stock:10, category:"Boshqa", expiryDate:expiryDate(365) },
    { id:179, name:"Tandir non", barcode:"200179", costPrice:3500, sellPrice:5500, unit:"dona", stock:30, category:"Non", expiryDate:expiryDate(1) },
    { id:180, name:"Qazi (1 kg)", barcode:"200180", costPrice:80000, sellPrice:105000, unit:"kg", stock:5, category:"Gosht", expiryDate:expiryDate(7) },
    { id:181, name:"Qurut (1 kg)", barcode:"200181", costPrice:30000, sellPrice:42000, unit:"kg", stock:8, category:"Boshqa", expiryDate:expiryDate(180) },
    { id:201, name:"1+1 Tovuq lavash L", barcode:"300201", costPrice:28000, sellPrice:37000, unit:"dona", stock:30, category:"Aksiya", expiryDate:expiryDate(5) },
    { id:202, name:"Combo 3 kishilik -30%", barcode:"300202", costPrice:80000, sellPrice:117000, unit:"dona", stock:20, category:"Aksiya", expiryDate:expiryDate(3) },
    { id:203, name:"1+1 Kapuchino", barcode:"300203", costPrice:10000, sellPrice:17000, unit:"dona", stock:25, category:"Aksiya", expiryDate:expiryDate(7) },
    { id:204, name:"Iftor Kofte Box", barcode:"300204", costPrice:38000, sellPrice:56000, unit:"dona", stock:15, category:"Aksiya", expiryDate:expiryDate(30) },
    { id:205, name:"Iftor Strips Box", barcode:"300205", costPrice:35000, sellPrice:51000, unit:"dona", stock:15, category:"Aksiya", expiryDate:expiryDate(30) },
  ];
}

// ══════════════════════════════════════════════════════════════
// DB — server + localStorage fallback (offline uchun)
// ══════════════════════════════════════════════════════════════
// Eski demo data ni localStorage dan bir marta tozalash
(function(){
  try {
    var ordersRaw = localStorage.getItem('sfu_v1_orders');
    if(ordersRaw){
      var arr = JSON.parse(ordersRaw);
      if(Array.isArray(arr) && arr.some(function(o){ return o.id==='#001'||o.id==='OFF#001'; })){
        localStorage.removeItem('sfu_v1_orders');
        localStorage.removeItem('sfu_v1_offline');
        localStorage.removeItem('sfu_v1_users');
      }
    }
  } catch(e){}
})();

const DB = {
  VERSION: 'sfu_v1',
  _BASE: '',

  // ── Sync GET: serverdan o'qish ──────────────────────────────
  _cache: {},

  // Server dan doim yangi o'qiladigan kalitlar (localStorage keshi o'tkazib yuboriladi)
  _SERVER_FIRST: ['products', 'staff', 'users', 'offline'],

  _get(key, fallback) {
    // 1. Keshda bormi (server-first kalitlarda kesh ishlatilmaydi)
    if (this._cache.hasOwnProperty(key) && !this._SERVER_FIRST.includes(key)) {
      return this._cache[key];
    }
    // 2. Session uchun localStorage BIRINCHI
    if (key === 'session') {
      try {
        const v = localStorage.getItem(this.VERSION + '_' + key);
        if (v !== null && v !== 'null' && v !== 'undefined') {
          const parsed = JSON.parse(v);
          if (parsed !== null && parsed !== undefined) {
            this._cache[key] = parsed;
            return parsed;
          }
        }
      } catch(e) {}
      return fallback;
    }
    // 3. Server-first kalitlar: serverdan o'qi, keyin localStorage fallback
    if (this._SERVER_FIRST.includes(key)) {
      try {
        const req = new XMLHttpRequest();
        req.open('GET', this._BASE + '/api/' + key, false);
        req.setRequestHeader('Authorization', 'Bearer ' + (localStorage.getItem(this.VERSION + '_token') || ''));
        req.send();
        if (req.status === 200) {
          const res = JSON.parse(req.responseText);
          if (res.ok && res.data !== null && res.data !== undefined) {
            this._cache[key] = res.data;
            try { localStorage.setItem(this.VERSION + '_' + key, JSON.stringify(res.data)); } catch(e) {}
            return res.data;
          }
        }
      } catch(e) {}
      // Server ishlamasa localStorage fallback
      try {
        const v = localStorage.getItem(this.VERSION + '_' + key);
        if (v !== null && v !== 'null') {
          const parsed = JSON.parse(v);
          if (parsed !== null) { this._cache[key] = parsed; return parsed; }
        }
      } catch(e) {}
      return fallback;
    }
    // 4. Boshqa kalitlar: localStorage birinchi
    try {
      const v = localStorage.getItem(this.VERSION + '_' + key);
      if (v !== null && v !== 'null') {
        const parsed = JSON.parse(v);
        if (parsed !== null) { this._cache[key] = parsed; return parsed; }
      }
    } catch(e) {}
    // 5. Server fallback
    try {
      const req = new XMLHttpRequest();
      req.open('GET', this._BASE + '/api/' + key, false);
      req.setRequestHeader('Authorization', 'Bearer ' + (localStorage.getItem(this.VERSION + '_token') || ''));
      req.send();
      if (req.status === 200) {
        const res = JSON.parse(req.responseText);
        if (res.ok && res.data !== null && res.data !== undefined) {
          this._cache[key] = res.data;
          try { localStorage.setItem(this.VERSION + '_' + key, JSON.stringify(res.data)); } catch(e) {}
          return res.data;
        }
      }
    } catch(e) {}
    return fallback;
  },

  // ── Auth token ───────────────────────────────────────────────
  getToken() {
    return localStorage.getItem(this.VERSION + '_token') || '';
  },

  // ── Data yozish ──────────────────────────────────────────────
  _set(key, value) {
    this._cache[key] = value;
    // localStorage ga yoz (birinchi, tez)
    try { localStorage.setItem(this.VERSION + '_' + key, JSON.stringify(value)); } catch(e) {}
    // Serverga yoz (async - bloklamasdan, token bilan)
    try {
      const req = new XMLHttpRequest();
      req.open('POST', this._BASE + '/api/' + key, true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.setRequestHeader('Authorization', 'Bearer ' + this.getToken());
      req.onload = () => {
        // Background save — 401 bo'lsa redirect qilma, ma'lumot localStorage da saqlanib qoldi
        if (req.status === 401) {
          const tok = localStorage.getItem(this.VERSION + '_token');
          if (!tok) return; // Customer — hech narsa qilma
          // Faqat server tokenini tozala (session saqlanib qoladi — foydalanuvchi tizimda qoladi)
          localStorage.removeItem(this.VERSION + '_token');
        }
      };
      req.send(JSON.stringify(value));
    } catch(e) {}
    return true;
  },

  // ── Products ────────────────────────────────────────────────
  getProducts()      { return this._get('products', _defaultProducts()); },
  saveProducts(p)    { this._set('products', p); },

  // ── Orders ──────────────────────────────────────────────────
  getOrders()        { return this._get('orders',  []); },
  saveOrders(o)      { this._set('orders', o); },

  // ── Offline Sales ────────────────────────────────────────────
  getOffline()       { return this._get('offline', []); },
  saveOffline(o)     { this._set('offline', o); },

  // ── Users ────────────────────────────────────────────────────
  getUsers()         { return this._get('users', []); },
  saveUsers(u)       { this._set('users', u); },

  // ── Incomes ──────────────────────────────────────────────────
  getIncomes()       { return this._get('incomes', []); },
  saveIncomes(i)     { this._set('incomes', i); },

  // ── Session ──────────────────────────────────────────────────
  getSession()       { return this._get('session', null); },
  setSession(s)      { this._set('session', s); },
  clearSession()     {
    this._cache['session'] = null;
    try { localStorage.removeItem(this.VERSION + '_session'); } catch(e) {}
    // Server async
    try {
      const req = new XMLHttpRequest();
      req.open('POST', this._BASE + '/api/session', true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send('null');
    } catch(e) {}
  },
};

DB.getStaff  = function(){ return DB._get('staff', []); };
DB.saveStaff = function(s){ DB._set('staff', s); };
DB.getShifts  = function(){ return DB._get('shifts', []); };
DB.saveShifts = function(s){ DB._set('shifts', s); };

DB.getStockLogs  = function(){ return DB._get('stock_logs', []); };
DB.saveStockLogs = function(l){ DB._set('stock_logs', l); };

// ── Refresh signals ───────────────────────────────────────────
DB.getRefreshSignals  = function(){ return DB._get('refresh_signals', {}); };
DB.saveRefreshSignals = function(s){ DB._set('refresh_signals', s); };

// ════════════════════════════════════════════════════════════════
// UNIVERSAL PERMISSION ENFORCER
// Barcha sahifada data.js yuklanadi — shu yerda ruxsatlarni tekshirish
// ════════════════════════════════════════════════════════════════

var PAGE_PERMS = {
  'dashboard':    'calendar',
  'pos':          'pos',
  'buyurtmalar':  'orders',
  'mahsulotlar':  'products',
  'ombor':        'products',
  'daromad':      'income',
  'mijozlar':     'users',
  'xodimlar':     'staff',
};

// Sidebar nav linklarini ruxsatga qarab ko'rsatish/yashirish
function applyPermissionsToSidebar() {
  var s = DB.getSession();
  if (!s) return;
  if (s.role === 'admin') return; // Admin — hamma narsa ochiq
  if (s.role !== 'seller') return;

  var now = Date.now();
  var perms = [];
  var allStaff = DB.getStaff();
  var emp = s.employeeId ? allStaff.find(function(e){ return e.id === s.employeeId; }) : null;
  if (emp) {
    if (emp.tempPermissions && emp.tempPermissions.until > now) {
      perms = emp.tempPermissions.list || [];
    } else {
      perms = emp.permissions || ['pos'];
    }
  } else {
    perms = s.permissions || ['pos'];
  }

  var currentPage = window.location.pathname.split('/').pop() || 'pos';
  if (!currentPage) currentPage = 'pos';

  var requiredPerm = PAGE_PERMS[currentPage];

  // Ruxsat tekshirish — pos dan HECH QACHON chiqarma
  if (currentPage === 'pos') return; // pos har doim ochiq seller uchun
  if (requiredPerm && perms.indexOf(requiredPerm) < 0) {
    var pageMap = {
      'calendar':'/dashboard','pos':'/pos','orders':'/buyurtmalar',
      'products':'/mahsulotlar','income':'/daromad',
      'users':'/mijozlar','staff':'/xodimlar'
    };
    // Birinchi ruxsatli sahifa — joriy sahifadan farqli
    var firstAllowed = '/pos'; // default — pos har doim seller uchun
    for (var i = 0; i < perms.length; i++) {
      if (pageMap[perms[i]] && pageMap[perms[i]] !== '/'+currentPage) {
        firstAllowed = pageMap[perms[i]]; break;
      }
    }
    if (firstAllowed !== '/'+currentPage) {
      window.location.href = firstAllowed;
    }
    return;
  }

  // Sidebar linklarini yashirish
  setTimeout(function() {
    document.querySelectorAll('.nav-item, .sidebar-nav a').forEach(function(item) {
      var href = item.getAttribute('href') || item.getAttribute('onclick') || '';
      Object.keys(PAGE_PERMS).forEach(function(page) {
        if (href.indexOf(page) >= 0 && perms.indexOf(PAGE_PERMS[page]) < 0) {
          item.style.display = 'none';
        }
      });
    });
  }, 100);
}

// ════════════════════════════════════════════════════════════════
// FULLSCREEN LOCK SYSTEM
// Login → Enter bosildimi? Fullscreen. Chiqmasin. Hech qachon.
// Faqat Ctrl+Alt+Z bilan chiqish mumkin
// ════════════════════════════════════════════════════════════════

var _fsLocked = false;  // true = fullscreen qulf yoqilgan

function _enterFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(function(){});
  }
}

function _isAdminOrSeller() {
  var s = DB.getSession();
  return s && (s.role === 'seller' || s.role === 'admin');
}

// Fullscreen qulfini yoqish (login dan keyin chaqiriladi)
function lockFullscreen() {
  _fsLocked = true;
  localStorage.setItem('sfu_fs_locked', '1');
  _enterFullscreen();
}

// Fullscreen qulfini o'chirish (faqat Ctrl+Alt+Z)
function unlockFullscreen() {
  _fsLocked = false;
  window._logoutInProgress = true;
  localStorage.removeItem('sfu_fs_locked');
  localStorage.removeItem('sfu_v1_session');
  localStorage.removeItem('sfu_v1_token');
  DB._cache = {};
  // Serverga logout xabari
  var token = localStorage.getItem('sfu_v1_token');
  if (token) {
    fetch('/auth/logout', {method:'POST', headers:{'Authorization':'Bearer '+token}}).catch(function(){});
  }
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(function(){});
  }
  setTimeout(function(){ window._logoutInProgress = false; }, 2000);
}

// Sahifa yuklanganda: agar qulf yoqiq bo'lsa — fullscreenda bo'l
function autoFullscreen() {
  var locked = localStorage.getItem('sfu_fs_locked') === '1';
  if (locked) _fsLocked = true;
}

// fullscreenchange: qaytadan fullscreen qilinmaydi

// Ctrl+Alt+Z — FAQAT shu bilan chiqish mumkin
document.addEventListener('keydown', function(e) {
  // Ctrl+Alt+Z (yoki Я kirill)
  if (e.ctrlKey && e.altKey && (e.key === 'z' || e.key === 'Z' || e.key === 'я' || e.key === 'Я')) {
    e.preventDefault();
    unlockFullscreen();
    return;
  }
  // F11 — manual toggle faqat qulf yo'q bo'lsa
  if (e.key === 'F11') {
    e.preventDefault();
    if (_fsLocked) {
      // Qulf yoqiq — F11 ta'sir qilmaydi, fullscreenda qoladi
      _enterFullscreen();
    } else {
      if (document.fullscreenElement) document.exitFullscreen();
      else _enterFullscreen();
    }
  }
  // ESC — fullscreendan chiqmaydi, Ctrl+Alt+Z bilan chiqish
  // (ESC bloki o'chirilgan)
});

// ════════════════════════════════════════════════════════════════
// PIN LOCK — Sotuvchi ekrani uchun
// ════════════════════════════════════════════════════════════════
(function(){
  var page = window.location.pathname.split('/').pop() || 'pos';
  // Faqat pos va dashboard da ishlaydi
  if (!['pos','dashboard','ombor','buyurtmalar','daromad','mijozlar'].includes(page)) return;

  var PIN_KEY     = 'sfu_v1_pin';
  var PIN_TIMEOUT = 5 * 60 * 1000; // 5 daqiqa
  var _pinTimer   = null;
  var _pinActive  = false;
  var _pinBuffer  = '';

  // PIN o'rnatilganmi?
  function getPin(){ return localStorage.getItem(PIN_KEY)||''; }

  // PIN lock ekrani HTML
  function injectPinUI(){
    if(document.getElementById('pin-lock-overlay')) return;
    var el = document.createElement('div');
    el.id = 'pin-lock-overlay';
    el.innerHTML = `
      <style>
        #pin-lock-overlay{position:fixed;inset:0;z-index:99999;background:#0d1b2a;display:none;flex-direction:column;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;}
        #pin-lock-overlay.active{display:flex;}
        .pin-logo{font-size:48px;margin-bottom:8px;}
        .pin-title{font-family:'Orbitron',monospace;font-size:14px;color:#00ffe7;letter-spacing:3px;margin-bottom:4px;}
        .pin-sub{font-size:13px;color:#7ab3cc;margin-bottom:28px;}
        .pin-dots{display:flex;gap:14px;margin-bottom:28px;}
        .pin-dot{width:14px;height:14px;border-radius:50%;border:2px solid #00ffe7;background:transparent;transition:background .15s;}
        .pin-dot.filled{background:#00ffe7;}
        .pin-error{color:#ff2d55;font-size:13px;min-height:18px;margin-bottom:10px;font-weight:700;}
        .pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:210px;}
        .pin-btn{height:60px;background:rgba(0,255,231,.07);border:1.5px solid rgba(0,255,231,.2);border-radius:12px;color:#e0f2fe;font-size:22px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'Rajdhani',sans-serif;}
        .pin-btn:hover{background:rgba(0,255,231,.15);border-color:#00ffe7;}
        .pin-btn:active{transform:scale(.95);}
        .pin-setup{margin-top:20px;font-size:12px;color:#7ab3cc;cursor:pointer;text-decoration:underline;}
      </style>
      <div class="pin-logo">🔒</div>
      <div class="pin-title">SELLFLOWUZ</div>
      <div class="pin-sub" id="pinSubText">PIN kodni kiriting</div>
      <div class="pin-dots" id="pinDots">
        <div class="pin-dot" id="pd0"></div><div class="pin-dot" id="pd1"></div>
        <div class="pin-dot" id="pd2"></div><div class="pin-dot" id="pd3"></div>
      </div>
      <div class="pin-error" id="pinError"></div>
      <div class="pin-grid">
        ${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(function(n){
          return '<button class="pin-btn" onclick="pinPress(\''+n+'\')">'+(n===''?'':n)+'</button>';
        }).join('')}
      </div>
      <div class="pin-setup" onclick="pinSetup()">PIN o'zgartirish</div>
    `;
    document.body.appendChild(el);
  }

  function updateDots(){
    for(var i=0;i<4;i++){
      var d=document.getElementById('pd'+i);
      if(d) d.className='pin-dot'+(i<_pinBuffer.length?' filled':'');
    }
  }

  window.pinPress = function(val){
    var err = document.getElementById('pinError');
    if(err) err.textContent='';
    if(val==='⌫'){ _pinBuffer=_pinBuffer.slice(0,-1); updateDots(); return; }
    if(val===''||_pinBuffer.length>=4) return;
    _pinBuffer += val;
    updateDots();
    if(_pinBuffer.length===4){
      setTimeout(function(){
        var stored = getPin();
        if(!stored){
          // PIN o'rnatilmagan — PIN ni yangi qilib saqlash
          localStorage.setItem(PIN_KEY, _pinBuffer);
          pinUnlock();
          return;
        }
        if(_pinBuffer === stored){
          pinUnlock();
        } else {
          _pinBuffer='';
          updateDots();
          var e=document.getElementById('pinError');
          if(e) e.textContent='❌ PIN xato! Qayta urinib ko\'ring.';
          // Titroq effekt
          var overlay=document.getElementById('pin-lock-overlay');
          if(overlay){ overlay.style.animation='pinShake .3s ease'; setTimeout(function(){overlay.style.animation='';},300); }
        }
      }, 100);
    }
  };

  function pinUnlock(){
    _pinActive=false;
    _pinBuffer='';
    var overlay=document.getElementById('pin-lock-overlay');
    if(overlay) overlay.classList.remove('active');
    resetTimer();
  }

  window.pinSetup = function(){
    var newPin=prompt('Yangi 4 xonali PIN kiriting:');
    if(newPin&&/^\d{4}$/.test(newPin)){
      localStorage.setItem(PIN_KEY, newPin);
      showToast&&showToast('✅ PIN o\'zgartirildi','success');
    } else if(newPin){
      alert('PIN faqat 4 ta raqamdan iborat bo\'lishi kerak!');
    }
  };

  function showPinLock(){
    var s = DB.getSession();
    if(!s) return; // Kirmaganda bloklama
    injectPinUI();
    // PIN yo'q bo'lsa — 0000 default
    if(!getPin()) localStorage.setItem(PIN_KEY,'0000');
    _pinActive=true;
    _pinBuffer='';
    updateDots();
    var sub=document.getElementById('pinSubText');
    if(sub) sub.textContent = (s.name||'Xodim') + ', PIN kodni kiriting';
    var err=document.getElementById('pinError');
    if(err) err.textContent='';
    var overlay=document.getElementById('pin-lock-overlay');
    if(overlay) overlay.classList.add('active');
  }

  function resetTimer(){
    clearTimeout(_pinTimer);
    if(_pinActive) return;
    _pinTimer=setTimeout(showPinLock, PIN_TIMEOUT);
  }

  // Foydalanuvchi harakati — taymerni qayta boshlaydi
  ['mousemove','keydown','click','touchstart','scroll'].forEach(function(evt){
    document.addEventListener(evt, function(){ if(!_pinActive) resetTimer(); }, {passive:true});
  });

  // Sahifa yuklanganda taymer boshlaydi
  document.addEventListener('DOMContentLoaded', function(){
    var s = DB.getSession();
    if(s) resetTimer();
  });

  // Klaviatura bilan PIN
  document.addEventListener('keydown', function(e){
    if(!_pinActive) return;
    if(e.key>='0'&&e.key<='9') pinPress(e.key);
    if(e.key==='Backspace') pinPress('⌫');
    if(e.key==='Escape') {} // ESC PIN ni o'chirmaydi
  });
})();

// ════════════════════════════════════════════════════════════════
// UNIVERSAL AI YORDAMCHI — Barcha sahifada floating tugma
// Dashboard dagi AI ni ham shu bilan almashtiradi
// ════════════════════════════════════════════════════════════════

(function() {
  // login va shop sahifalarida chiqmasin
  var page = window.location.pathname.split('/').pop();
  if (page === 'login' || page === 'shop' || page === '') return;

  // CSS inject
  var style = document.createElement('style');
  style.textContent = `
    #ai-fab {
      position: fixed; bottom: 24px; right: 24px;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #00fff0, #00d4ff);
      border: none; cursor: pointer; z-index: 8000;
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; box-shadow: 0 4px 24px rgba(0,255,240,.5);
      transition: all .25s; animation: aiPulse 3s ease-in-out infinite;
    }
    #ai-fab:hover { transform: scale(1.12); box-shadow: 0 6px 32px rgba(0,255,240,.7); }
    @keyframes aiPulse {
      0%,100% { box-shadow: 0 4px 24px rgba(0,255,240,.5); }
      50% { box-shadow: 0 4px 40px rgba(0,255,240,.85); }
    }
    #ai-fab .ai-badge {
      position: absolute; top: -3px; right: -3px;
      background: #ff3366; color: white; border-radius: 50%;
      width: 18px; height: 18px; font-size: 10px; font-weight: 800;
      display: none; align-items: center; justify-content: center;
      font-family: sans-serif;
    }
    #ai-fab .ai-badge.on { display: flex; }

    #ai-panel {
      position: fixed; bottom: 90px; right: 24px;
      width: 420px; max-height: 600px;
      background: linear-gradient(180deg, #091828, #040d18);
      border: 1.5px solid rgba(0,255,240,.3);
      border-radius: 18px; z-index: 8000;
      display: none; flex-direction: column;
      box-shadow: 0 8px 48px rgba(0,0,0,.7), 0 0 0 1px rgba(0,255,240,.08);
      overflow: hidden; font-family: 'Rajdhani', sans-serif;
    }
    #ai-panel.open { display: flex; animation: aiSlideUp .25s ease; }
    @keyframes aiSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

    #ai-panel-head {
      padding: 14px 16px;
      background: rgba(0,255,240,.07);
      border-bottom: 1px solid rgba(0,255,240,.15);
      display: flex; align-items: center; gap:10px; flex-shrink: 0;
    }
    .ai-head-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg,#00fff0,#00d4ff);
      display:flex; align-items:center; justify-content:center;
      font-size: 18px; flex-shrink:0;
      box-shadow: 0 0 12px rgba(0,255,240,.4);
    }
    .ai-head-info { flex:1; }
    .ai-head-name { font-family:'Orbitron',monospace; font-size:11px; color:#00fff0; letter-spacing:1.5px; font-weight:700; }
    .ai-head-status { font-size:10px; color:#80b8d8; margin-top:1px; }
    .ai-head-btns { display:flex; gap:6px; }
    .ai-head-btn { background:none; border:none; cursor:pointer; font-size:16px; color:#80b8d8; padding:4px; transition:color .15s; }
    .ai-head-btn:hover { color:#00fff0; }

    #ai-messages {
      flex:1; overflow-y:auto; padding:14px;
      display:flex; flex-direction:column; gap:8px;
      scrollbar-width:thin; scrollbar-color:rgba(0,255,240,.2) transparent;
    }
    #ai-messages::-webkit-scrollbar { width:4px; }
    #ai-messages::-webkit-scrollbar-track { background:transparent; }
    #ai-messages::-webkit-scrollbar-thumb { background:rgba(0,255,240,.2); border-radius:4px; }

    .ai-msg { display:flex; gap:8px; animation: msgIn .2s ease; }
    .ai-msg.user { flex-direction:row-reverse; }
    @keyframes msgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .ai-bubble {
      max-width: 85%; padding: 9px 13px; border-radius: 12px;
      font-size: 13px; line-height: 1.55; word-break: break-word;
    }
    .ai-msg.bot .ai-bubble {
      background: rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09);
      color: #e0f2ff; border-radius: 4px 12px 12px 12px;
    }
    .ai-msg.user .ai-bubble {
      background: linear-gradient(135deg,rgba(0,255,240,.18),rgba(0,212,255,.1));
      border: 1px solid rgba(0,255,240,.25); color: white;
      border-radius: 12px 4px 12px 12px;
    }
    .ai-typing { display:flex; gap:4px; padding:10px 13px; }
    .ai-dot { width:7px; height:7px; border-radius:50%; background:#00fff0; opacity:.4;
      animation: aiDot 1.2s ease-in-out infinite; }
    .ai-dot:nth-child(2){animation-delay:.2s;}
    .ai-dot:nth-child(3){animation-delay:.4s;}
    @keyframes aiDot { 0%,80%,100%{opacity:.4;transform:scale(1)} 40%{opacity:1;transform:scale(1.2)} }

    .ai-quick-btns {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 8px 14px; border-top:1px solid rgba(0,255,240,.08);
      flex-shrink: 0;
    }
    .ai-quick-btn {
      padding: 5px 11px; background: rgba(0,255,240,.07);
      border: 1px solid rgba(0,255,240,.18); border-radius: 20px;
      color: #80b8d8; font-size: 11px; font-weight: 700;
      cursor: pointer; transition: all .15s;
      font-family: 'Rajdhani', sans-serif;
    }
    .ai-quick-btn:hover { border-color:#00fff0; color:#00fff0; background:rgba(0,255,240,.13); }

    #ai-input-row {
      display: flex; gap: 8px; padding: 12px 14px;
      border-top: 1px solid rgba(0,255,240,.12); flex-shrink:0;
      background: rgba(0,0,0,.2);
    }
    #ai-input {
      flex:1; padding: 9px 13px;
      background: rgba(0,255,240,.06); border:1.5px solid rgba(0,255,240,.2);
      border-radius: 10px; color: white;
      font-family: 'Rajdhani', sans-serif; font-size: 13px; outline:none;
      transition: border .15s;
    }
    #ai-input:focus { border-color: #00fff0; box-shadow:0 0 10px rgba(0,255,240,.2); }
    #ai-input::placeholder { color: #2a5070; }
    #ai-mic-btn {
      width:38px; height:38px; border-radius:10px;
      background: rgba(0,255,240,.08); border:1.5px solid rgba(0,255,240,.25);
      cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center;
      transition: all .2s; flex-shrink:0;
    }
    #ai-mic-btn:hover { background:rgba(0,255,240,.18); }
    #ai-mic-btn.listening { background:rgba(255,45,85,.25); border-color:#ff2d55; animation: micPulse .8s ease-in-out infinite; }
    @keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,45,85,.4)} 50%{box-shadow:0 0 0 8px rgba(255,45,85,0)} }
    #ai-send-btn {
      width:38px; height:38px; border-radius:10px;
      background: linear-gradient(135deg,#00fff0,#00d4ff);
      border:none; cursor:pointer; font-size:18px;
      display:flex; align-items:center; justify-content:center;
      transition: all .2s; flex-shrink:0; color:#000; font-weight:900;
    }
    #ai-send-btn:hover { transform:scale(1.08); box-shadow:0 0 14px rgba(0,255,240,.4); }
  `;
  document.head.appendChild(style);

  // HTML inject
  var html = `
    <button id="ai-fab" onclick="aiToggle()" title="AI Yordamchi">
      🤖
      <span class="ai-badge" id="ai-badge"></span>
    </button>
    <div id="ai-panel">
      <div id="ai-panel-head">
        <div class="ai-head-avatar">🤖</div>
        <div class="ai-head-info">
          <div class="ai-head-name">AI MASLAHATCHI</div>
          <div class="ai-head-status" id="ai-status">● Tayyor</div>
        </div>
        <div class="ai-head-btns">
          <button class="ai-head-btn" id="ai-tts-btn" onclick="aiTtsToggle()" title="Ovozli javob">🔇</button>
          <button class="ai-head-btn" onclick="aiClear()" title="Tozalash">🗑</button>
          <button class="ai-head-btn" onclick="aiToggle()" title="Yopish">✕</button>
        </div>
      </div>
      <div id="ai-messages"></div>
      <div class="ai-quick-btns" id="ai-quickbtns">
        <button class="ai-quick-btn" onclick="aiAsk('Bugun qancha savdo bo\\'ldi, tushum va foyda qancha?')">📊 Bugun</button>
        <button class="ai-quick-btn" onclick="aiAsk('Bu oy savdo va foyda hisobotini ber')">📅 Bu oy</button>
        <button class="ai-quick-btn" onclick="aiAsk('Qaysi mahsulotlar eng ko\\'p sotilgan, ro\\'yxat ber')">🔥 Top sotilgan</button>
        <button class="ai-quick-btn" onclick="aiAsk('Omborda qaysi mahsulotlar tugagan yoki kam qolgan?')">📦 Ombor</button>
        <button class="ai-quick-btn" onclick="aiAsk('Qarzlari bor mijozlar ro\\'yxatini va umumiy qarz summasini ber')">💳 Qarzkorlar</button>
        <button class="ai-quick-btn" onclick="aiAsk('Xodimlar bu oy necha savdo qildi va maoshi qancha?')">👔 Xodimlar</button>
        <button class="ai-quick-btn" onclick="aiAsk('Muddati tugayotgan mahsulotlar bor, nima qilish kerak?')">⏳ Muddatlar</button>
        <button class="ai-quick-btn" onclick="aiAsk('Do\\'kon foydasini oshirish uchun qanday maslahat berasan?')">💡 Maslahat</button>
      </div>
      <div id="ai-input-row">
        <input id="ai-input" placeholder="Savol bering yoki gapiring..." onkeydown="if(event.key==='Enter')aiSend()">
        <button id="ai-mic-btn" onclick="aiMic()" title="Ovozli savol">🎤</button>
        <button id="ai-send-btn" onclick="aiSend()">➤</button>
      </div>
    </div>
  `;
  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  // ── STATE ──
  window._aiHistory = window._aiHistory || [];
  var _aiOpen = false;
  var _aiLoading = false;

  // ── FUNCTIONS ──
  window.aiToggle = function() {
    _aiOpen = !_aiOpen;
    var panel = document.getElementById('ai-panel');
    if (_aiOpen) {
      panel.classList.add('open');
      document.getElementById('ai-input').focus();
      document.getElementById('ai-badge').classList.remove('on');
      if (!window._aiHistory.length) {
        _aiAddMsg('bot', 'Salom! 👋 Men SellFlowUZ AI maslahatchiiman. Do\'kon statistikasi, savdo tahlili, mahsulot tavsiyalari haqida savol bering!');
      }
    } else {
      panel.classList.remove('open');
    }
  };

  window.aiClear = function() {
    window._aiHistory = [];
    document.getElementById('ai-messages').innerHTML = '';
  };

  window.aiAsk = function(q) {
    document.getElementById('ai-input').value = q;
    aiSend();
  };

  function _aiFormatText(text) {
    return text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/^### (.+)$/gm,'<div style="font-size:12px;color:#00fff0;font-weight:700;margin:6px 0 2px;letter-spacing:1px;">$1</div>')
      .replace(/^## (.+)$/gm,'<div style="font-size:13px;color:#00fff0;font-weight:800;margin:6px 0 2px;">$1</div>')
      .replace(/^- (.+)$/gm,'<div style="padding-left:8px;">• $1</div>')
      .replace(/\n/g,'<br>');
  }

  function _aiAddMsg(role, text) {
    window._aiHistory.push({role: role, text: text});
    var msgs = document.getElementById('ai-messages');
    var div = document.createElement('div');
    div.className = 'ai-msg ' + role;
    div.innerHTML = '<div class="ai-bubble">' + (role==='bot' ? _aiFormatText(text) : text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')) + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    // Badge if closed
    if (!_aiOpen) {
      document.getElementById('ai-badge').classList.add('on');
      document.getElementById('ai-badge').textContent = window._aiHistory.filter(function(m){return m.role==='bot';}).length;
    }
  }

  function _aiSetStatus(txt) {
    var el = document.getElementById('ai-status');
    if (el) el.textContent = txt;
  }

  function _buildContext() {
    try {
      var prods  = DB.getProducts()  || [];
      var ords   = DB.getOrders()    || [];
      var offs   = DB.getOffline()   || [];
      var usrs   = DB.getUsers()     || [];
      var stf    = DB.getStaff()     || [];
      var incs   = DB.getIncomes()   || [];

      var now = new Date();
      var todayStr = now.toDateString();
      var allSales = ords.concat(offs);

      // Bugun
      var todayS      = allSales.filter(function(o){ return new Date(o.time).toDateString()===todayStr; });
      var todayRev    = todayS.reduce(function(a,o){ return a+(o.total||0); }, 0);
      var todayProfit = todayS.reduce(function(a,o){ return a+(o.profit||0); }, 0);

      // Bu hafta
      var weekStart = new Date(now); weekStart.setDate(now.getDate()-now.getDay()); weekStart.setHours(0,0,0,0);
      var weekSales = allSales.filter(function(o){ return new Date(o.time)>=weekStart; });
      var weekRev   = weekSales.reduce(function(a,o){ return a+(o.total||0); }, 0);

      // Bu oy
      var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      var monthSales  = allSales.filter(function(o){ return new Date(o.time)>=monthStart; });
      var monthRev    = monthSales.reduce(function(a,o){ return a+(o.total||0); }, 0);
      var monthProfit = monthSales.reduce(function(a,o){ return a+(o.profit||0); }, 0);

      // Jami
      var totalRev    = allSales.reduce(function(a,o){ return a+(o.total||0); }, 0);
      var totalProfit = allSales.reduce(function(a,o){ return a+(o.profit||0); }, 0);

      // Mahsulotlar
      var outProds = prods.filter(function(p){ return p.stock===0; });
      var lowProds = prods.filter(function(p){ return p.stock>0 && p.stock<=5; });
      var expProds = prods.filter(function(p){
        if(!p.expiryDate) return false;
        var d = Math.ceil((new Date(p.expiryDate)-now)/86400000);
        return d>=0 && d<=7 && p.stock>0;
      });

      // Top sotilgan — savdo yozuvlari bo'yicha hisoblash
      var salesCount = {};
      allSales.forEach(function(o){
        (o.items||[]).forEach(function(i){ salesCount[i.name]=(salesCount[i.name]||0)+i.qty; });
      });
      var top8 = Object.keys(salesCount).sort(function(a,b){ return salesCount[b]-salesCount[a]; }).slice(0,8)
        .map(function(n){ return n+' ('+salesCount[n]+' ta)'; });

      // Yangi buyurtmalar
      var newOrds = ords.filter(function(o){ return o.status==='new'; });

      // Mijozlar va qarzlar
      var debtors   = usrs.filter(function(u){ return u.debt && u.debt>0; });
      var totalDebt = debtors.reduce(function(a,u){ return a+(u.debt||0); }, 0);
      var debtList  = debtors.slice(0,5).map(function(u){ return u.name+': '+u.debt.toLocaleString()+" so'm"; });

      // Xodimlar — bu oy savdo va maosh
      var staffInfo = stf.map(function(e){
        var mS = allSales.filter(function(o){ return o.employeeId===e.id && new Date(o.time)>=monthStart; });
        var mT = mS.reduce(function(a,o){ return a+(o.total||0); },0);
        var sal = (e.baseSalary||0)+Math.round(mT*(e.pct||0)/100);
        return e.name+' | '+(e.role==='seller'?'Sotuvchi':e.role==='cashier'?'Kassir':'Menejer')+
          ' | bu oy '+mS.length+' savdo, '+mT.toLocaleString()+" so'm | maosh: "+sal.toLocaleString()+" so'm";
      });

      // Kirim xarajat
      var incTotal = incs.reduce(function(a,i){ return a+(i.total||(i.qty*i.price)||0); },0);

      // So'nggi 5 savdo
      var last5 = allSales.slice().sort(function(a,b){ return new Date(b.time)-new Date(a.time); }).slice(0,5)
        .map(function(o){
          var d = new Date(o.time);
          return d.toLocaleDateString('uz-UZ')+' '+d.toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit'})+
            ' — '+(o.userName||'Mijoz')+': '+o.total.toLocaleString()+" so'm";
        });

      return '=== SELLFLOWUZ — REAL MA\'LUMOTLAR ('+now.toLocaleDateString('uz-UZ')+') ===\n\n'+
        '📊 BUGUN ('+now.toLocaleDateString('uz-UZ')+'):\n'+
        '  Savdolar: '+todayS.length+' ta\n'+
        '  Tushum: '+todayRev.toLocaleString()+" so'm\n"+
        '  Sof foyda: '+todayProfit.toLocaleString()+" so'm\n\n"+
        '📅 BU HAFTA:\n'+
        '  Savdolar: '+weekSales.length+' ta | Tushum: '+weekRev.toLocaleString()+" so'm\n\n"+
        '🗓 BU OY:\n'+
        '  Savdolar: '+monthSales.length+' ta\n'+
        '  Tushum: '+monthRev.toLocaleString()+" so'm\n"+
        '  Sof foyda: '+monthProfit.toLocaleString()+" so'm\n\n"+
        '💰 JAMI (barcha vaqt):\n'+
        '  Savdolar: '+allSales.length+' ta\n'+
        '  Tushum: '+totalRev.toLocaleString()+" so'm\n"+
        '  Foyda: '+totalProfit.toLocaleString()+" so'm\n\n"+
        '📦 OMBOR HOLATI:\n'+
        '  Jami tovar: '+prods.length+' tur\n'+
        '  Tugagan (stock=0): '+outProds.length+' ta — '+(outProds.slice(0,5).map(function(p){return p.name;}).join(', ')||(outProds.length?'..':'yo\'q'))+'\n'+
        '  Kam qolgan (≤5): '+lowProds.length+' ta — '+lowProds.slice(0,5).map(function(p){return p.name+' ('+p.stock+' '+p.unit+')';}).join(', ')+'\n'+
        '  Muddati tugayapti (≤7 kun): '+expProds.length+' ta — '+expProds.slice(0,5).map(function(p){
          var d=Math.ceil((new Date(p.expiryDate)-now)/86400000);return p.name+' ('+d+' kun)';
        }).join(', ')+'\n\n'+
        '🔥 KO\'P SOTILGAN:\n  '+(top8.length?top8.join('\n  '):'Hali savdo yo\'q')+'\n\n'+
        '📋 YANGI ONLINE BUYURTMALAR: '+newOrds.length+' ta\n\n'+
        '👥 MIJOZLAR:\n'+
        '  Jami: '+usrs.length+' ta\n'+
        '  Qarzdorlar: '+debtors.length+' ta | Umumiy qarz: '+totalDebt.toLocaleString()+" so'm\n"+
        (debtList.length ? '  Qarzkorlar: '+debtList.join('; ')+'\n' : '')+'\n'+
        '👔 XODIMLAR ('+stf.length+' ta):\n'+
        (staffInfo.length ? '  '+staffInfo.join('\n  ') : '  Xodim yo\'q')+'\n\n'+
        '📥 OMBOR KIRIM JAMI XARAJAT: '+incTotal.toLocaleString()+" so'm\n\n"+
        '🕐 SO\'NGGI 5 SAVDO:\n  '+(last5.length?last5.join('\n  '):'Yo\'q')+'\n\n'+
        'Joriy sahifa: '+window.location.pathname.split('/').pop();
    } catch(e) {
      return 'SellFlowUZ do\'kon tizimi. Ma\'lumotlarni yuklab bo\'lmadi.';
    }
  }

  function _localAnswer(q) {
    var ql = q.toLowerCase();
    var fmt = function(n){ return Math.round(n).toLocaleString('uz-UZ'); };
    var now = new Date();
    var todayStr = now.toDateString();
    var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    try {
      var products = DB._get('products', []);
      var orders   = DB._get('orders', []);
      var offline  = DB._get('offline', []);
      var users    = DB._get('users', []);
      var incomes  = DB._get('incomes', []);
      var allSales = orders.concat(offline);
      var todaySales  = allSales.filter(function(s){ return new Date(s.time).toDateString()===todayStr; });
      var monthSales  = allSales.filter(function(s){ return new Date(s.time)>=monthStart; });

      // BUGUN
      if (/bugun|today/.test(ql)) {
        var tTotal  = todaySales.reduce(function(a,s){return a+s.total;},0);
        var tProfit = todaySales.reduce(function(a,s){return a+(s.profit||0);},0);
        var tOnline = todaySales.filter(function(s){return s.type==='online';}).length;
        var tOffline= todaySales.filter(function(s){return s.type!=='online';}).length;
        return '📊 **Bugungi hisobot:**\n\n' +
          '🛒 Jami savdo: **' + todaySales.length + ' ta**\n' +
          '💰 Jami summa: **' + fmt(tTotal) + " so'm**\n" +
          '📈 Foyda: **' + fmt(tProfit) + " so'm**\n" +
          '📱 Online: ' + tOnline + ' ta  |  🏪 Do\'kon: ' + tOffline + ' ta';
      }

      // BU OY
      if (/oy|месяц|month/.test(ql)) {
        var mTotal  = monthSales.reduce(function(a,s){return a+s.total;},0);
        var mProfit = monthSales.reduce(function(a,s){return a+(s.profit||0);},0);
        var mOnline = monthSales.filter(function(s){return s.type==='online';}).length;
        var mOffline= monthSales.filter(function(s){return s.type!=='online';}).length;
        var months  = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
        return '📅 **' + months[now.getMonth()] + ' oyi hisoboti:**\n\n' +
          '🛒 Jami savdo: **' + monthSales.length + ' ta**\n' +
          '💰 Jami summa: **' + fmt(mTotal) + " so'm**\n" +
          '📈 Foyda: **' + fmt(mProfit) + " so'm**\n" +
          '📱 Online: ' + mOnline + ' ta  |  🏪 Do\'kon: ' + mOffline + ' ta\n' +
          '📆 Kunlik o\'rtacha: **' + fmt(mTotal/now.getDate()) + " so'm**";
      }

      // QARZKORLAR
      if (/qarz|debt/.test(ql)) {
        var debtors = users.filter(function(u){return u.debt>0;}).sort(function(a,b){return b.debt-a.debt;});
        if (!debtors.length) return '✅ Hozircha qarzdor mijoz yo\'q.';
        var totalDebt = debtors.reduce(function(a,u){return a+u.debt;},0);
        var list = debtors.slice(0,10).map(function(u,i){
          return (i+1)+'. **'+u.name+'** — '+fmt(u.debt)+" so'm" + (u.phone?' ('+u.phone+')':'');
        });
        return '💳 **Qarzdorlar ro\'yxati ('+debtors.length+' ta):**\n\n' +
          list.join('\n') +
          (debtors.length>10?'\n...va yana '+(debtors.length-10)+' ta':'')+
          '\n\n💰 **Umumiy qarz: ' + fmt(totalDebt) + " so'm**";
      }

      // TOP SOTILGAN
      if (/top|ko'p sotil|eng ko'p|bestsell/.test(ql)) {
        var sold = {};
        allSales.forEach(function(s){
          (s.items||[]).forEach(function(it){ sold[it.name]=(sold[it.name]||0)+it.qty; });
        });
        var top = Object.entries(sold).sort(function(a,b){return b[1]-a[1];}).slice(0,10);
        if (!top.length) return '📭 Hozircha savdo ma\'lumoti yo\'q.';
        var list = top.map(function(e,i){ return (i+1)+'. **'+e[0]+'** — '+e[1]+' ta'; });
        return '🏆 **Eng ko\'p sotilgan tovarlar:**\n\n' + list.join('\n');
      }

      // OMBOR / STOCK
      if (/ombor|stock|tugay|kam|tovar/.test(ql)) {
        var out  = products.filter(function(p){return p.stock<=0;});
        var low  = products.filter(function(p){return p.stock>0&&p.stock<=5;});
        var total= products.reduce(function(a,p){return a+p.stock*(p.costPrice||0);},0);
        var res  = '📦 **Ombor holati:**\n\n';
        res += '📊 Jami mahsulot: **'+products.length+' tur**\n';
        res += '💰 Ombor qiymati: **'+fmt(total)+" so'm**\n\n";
        if (out.length) {
          res += '🔴 **Tugagan ('+out.length+' ta):**\n';
          res += out.slice(0,8).map(function(p){return '  - '+p.name;}).join('\n')+'\n\n';
        }
        if (low.length) {
          res += '🟡 **Kam qolgan ('+low.length+' ta):**\n';
          res += low.slice(0,8).map(function(p){return '  - '+p.name+' ('+p.stock+' ta)';}).join('\n');
        }
        if (!out.length && !low.length) res += '✅ Ombor yaxshi holda!';
        return res;
      }

      // XODIMLAR
      if (/xodim|staff|ishchi|hodim/.test(ql)) {
        var staff = DB._get('staff', []);
        if (!staff.length) return '👔 Xodimlar ro\'yxati bo\'sh.';
        var list = staff.map(function(s,i){
          return (i+1)+'. **'+s.name+'** — '+s.role+(s.salary?' | '+fmt(s.salary)+" so'm":'');
        });
        return '👔 **Xodimlar ('+staff.length+' ta):**\n\n' + list.join('\n');
      }

      // MUDDATI O'TAYOTGAN
      if (/muddat|exp|yaroq|tugay/.test(ql)) {
        var soon = products.filter(function(p){
          if (!p.expiryDate) return false;
          var d = (new Date(p.expiryDate)-now)/86400000;
          return d>=0 && d<=7;
        }).sort(function(a,b){return new Date(a.expiryDate)-new Date(b.expiryDate);});
        if (!soon.length) return '✅ Yaqin 7 kunda muddati tugaydigan tovar yo\'q.';
        var list = soon.map(function(p){
          var d = Math.ceil((new Date(p.expiryDate)-now)/86400000);
          return '  - **'+p.name+'** — '+d+' kun qoldi';
        });
        return '⏰ **Muddati yaqinlashgan tovarlar:**\n\n' + list.join('\n');
      }

      // MIJOZLAR
      if (/mijoz|customer|xaridor/.test(ql)) {
        var custs = users.filter(function(u){return u.role==='customer';});
        var withDebt = custs.filter(function(u){return u.debt>0;}).length;
        var topCust = {};
        allSales.forEach(function(s){
          if(s.userId||s.userPhone){
            var k=s.userId||s.userPhone;
            topCust[k]=(topCust[k]||0)+s.total;
          }
        });
        return '👥 **Mijozlar:**\n\n' +
          '📋 Jami ro\'yxatda: **'+custs.length+' ta**\n' +
          '💳 Qarzdorlar: **'+withDebt+' ta**\n' +
          '🛒 Hozir xarid qilgan: **'+new Set(todaySales.map(function(s){return s.userId||s.userPhone;})).size+' ta**';
      }

      // KIRIM / XARAJAT
      if (/kirim|xarajat|income|harajat/.test(ql)) {
        var monthInc = incomes.filter(function(i){return new Date(i.date||i.created)>=monthStart;});
        var total2   = monthInc.reduce(function(a,i){return a+(i.total||(i.qty*i.price)||0);},0);
        return '📥 **Bu oy kirim (xarajat):**\n\n' +
          '📦 Kirimlar soni: **'+monthInc.length+' ta**\n' +
          '💸 Jami xarajat: **'+fmt(total2)+" so'm**";
      }

      // UMUMIY HISOBOT
      if (/hisobot|umumiy|hammasi|barchasi|report/.test(ql)) {
        var allTotal  = allSales.reduce(function(a,s){return a+s.total;},0);
        var allProfit = allSales.reduce(function(a,s){return a+(s.profit||0);},0);
        var stockVal  = products.reduce(function(a,p){return a+p.stock*(p.costPrice||0);},0);
        return '📊 **Umumiy hisobot:**\n\n' +
          '🛒 Jami savdolar: **'+allSales.length+' ta**\n' +
          '💰 Jami daromad: **'+fmt(allTotal)+" so'm**\n" +
          '📈 Jami foyda: **'+fmt(allProfit)+" so'm**\n" +
          '📦 Ombor qiymati: **'+fmt(stockVal)+" so'm**\n" +
          '👥 Mijozlar: **'+users.filter(function(u){return u.role==='customer';}).length+' ta**\n' +
          '🏷️ Mahsulotlar: **'+products.length+' tur**';
      }

      // ZAKAZ / CHEK QIDIRISH — ID, telefon, ism bo'yicha
      var phoneMatch = q.match(/[+]?[0-9]{9,13}/);
      var idMatch2   = q.match(/[A-Z0-9]{5,}/i);
      var isSearch   = /zakaz|order|buyurtma|chek|receipt|topib|qidir|kim|nomer|raqam/.test(ql) || phoneMatch || (idMatch2 && !/bugun|oy|yil/.test(ql));
      if (isSearch) {
        var found = [];
        // Telefon raqam bo'yicha
        if (phoneMatch) {
          var ph = phoneMatch[0].replace(/\D/g,'').slice(-9);
          allSales.forEach(function(s){
            var sph = (s.userPhone||s.phone||'').replace(/\D/g,'').slice(-9);
            if (sph && sph.includes(ph)) { if(!found.includes(s)) found.push(s); }
          });
          users.forEach(function(u){
            var uph = (u.phone||'').replace(/\D/g,'').slice(-9);
            if (uph && uph.includes(ph)) {
              allSales.filter(function(s){
                return String(s.userId)===String(u.id)||s.userPhone===u.phone;
              }).forEach(function(o){ if(!found.includes(o)) found.push(o); });
            }
          });
        }
        // ID bo'yicha
        if (!found.length && idMatch2) {
          var sid = idMatch2[0].toUpperCase();
          allSales.forEach(function(s){
            if ((s.id||'').toString().toUpperCase().includes(sid)) {
              if(!found.includes(s)) found.push(s);
            }
          });
        }
        // Ism bo'yicha
        if (!found.length) {
          var words = ql.split(/\s+/).filter(function(w){return w.length>2 && !/zakaz|chek|topib|qidir|order/.test(w);});
          words.forEach(function(w){
            allSales.forEach(function(s){
              if ((s.userName||s.name||'').toLowerCase().includes(w)) {
                if(!found.includes(s)) found.push(s);
              }
            });
            users.forEach(function(u){
              if ((u.name||'').toLowerCase().includes(w)) {
                allSales.filter(function(s){
                  return String(s.userId)===String(u.id)||s.userPhone===u.phone;
                }).forEach(function(o){ if(!found.includes(o)) found.push(o); });
              }
            });
          });
        }
        if (!found.length) return '🔍 Zakaz topilmadi.\n\nQuyidagilarni kiriting:\n- Telefon raqam: **+998901234567**\n- Zakaz ID: **ON3X2K**\n- Mijoz ismi: **Ali buyurtmasi**';
        found.sort(function(a,b){return new Date(b.time)-new Date(a.time);});
        var list = found.slice(0,5).map(function(o){
          var d  = new Date(o.time);
          var ds = d.toLocaleDateString('uz-UZ')+' '+d.toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit'});
          var items = (o.items||[]).map(function(i){return i.name+' ×'+i.qty;}).join(', ');
          return '🧾 **'+(o.id||'—')+'**\n' +
            '👤 '+(o.userName||o.name||'Noma\'lum')+'  📱'+(o.userPhone||o.phone||'—')+'\n' +
            '💰 '+fmt(o.total)+" so'm  📅 "+ds+'\n' +
            '🛍 '+(items||'—');
        });
        return '🔍 **Topildi ('+Math.min(found.length,5)+'/'+found.length+' ta):**\n\n'+list.join('\n\n');
      }

      // YORDAM
      return '🤖 **Nima so\'rashingiz mumkin:**\n\n' +
        '📊 Bugun — bugungi savdo va foyda\n' +
        '📅 Bu oy — oylik hisobot\n' +
        '💳 Qarzkorlar — qarzdorlar ro\'yxati\n' +
        '🏆 Top sotilgan — eng ko\'p sotilgan tovarlar\n' +
        '📦 Ombor — ombor holati\n' +
        '⏰ Muddat — muddati tugayotganlar\n' +
        '👥 Mijozlar — mijozlar ma\'lumoti\n' +
        '📥 Kirim — bu oy xarajatlar\n' +
        '📊 Umumiy hisobot — barcha statistika\n' +
        '🔍 Zakaz ID yoki ism — zakaz/chek topish';
    } catch(e) {
      return '⚠️ Ma\'lumotlarni o\'qishda xato: ' + e.message;
    }
  }

  window.aiSend = async function() {
    if (_aiLoading) return;
    var input = document.getElementById('ai-input');
    var q = input.value.trim();
    if (!q) return;
    input.value = '';

    _aiAddMsg('user', q);
    _aiLoading = true;
    _aiSetStatus('⏳ Hisoblanmoqda...');

    var msgs = document.getElementById('ai-messages');
    var typing = document.createElement('div');
    typing.className = 'ai-msg bot';
    typing.innerHTML = '<div class="ai-bubble ai-typing"><div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div></div>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    await new Promise(function(r){setTimeout(r,400);});
    typing.remove();

    var answer = _localAnswer(q);
    _aiAddMsg('bot', answer);
    _aiSetStatus('● Tayyor');
    _aiLoading = false;
    if (window._aiTtsOn) _aiSpeak(answer);
  };

  // ── TEXT TO SPEECH ────────────────────────────────────────────
  window._aiTtsOn = false;
  window.aiTtsToggle = function() {
    window._aiTtsOn = !window._aiTtsOn;
    var btn = document.getElementById('ai-tts-btn');
    btn.textContent = window._aiTtsOn ? '🔊' : '🔇';
    btn.style.color = window._aiTtsOn ? '#00fff0' : '';
    if (!window._aiTtsOn) window.speechSynthesis.cancel();
  };

  var _ttsAudios = [];
  function _aiSpeak(text) {
    // Avvalgi ovozni to'xtatish
    _ttsAudios.forEach(function(a){ a.pause(); a.src=''; });
    _ttsAudios = [];

    var clean = text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/#{1,3}\s*/g, '')
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
      .replace(/[|×]/g, ' ')
      .replace(/\n+/g, '. ')
      .replace(/\.{2,}/g, '.')
      .replace(/so'm/g, "so'm")
      .trim();

    // 180 belgidan kichik bo'laklarga bo'lish (Google TTS cheklov)
    var chunks = [];
    var sentences = clean.split(/(?<=[.!?])\s+/);
    var cur = '';
    sentences.forEach(function(s) {
      if ((cur + s).length > 180) {
        if (cur) chunks.push(cur.trim());
        cur = s;
      } else {
        cur += (cur ? ' ' : '') + s;
      }
    });
    if (cur.trim()) chunks.push(cur.trim());

    // Ketma-ket o'ynash
    var idx = 0;
    function playNext() {
      if (idx >= chunks.length || !window._aiTtsOn) return;
      var chunk = chunks[idx++];
      if (!chunk) { playNext(); return; }
      var audio = new Audio('/tts?t=' + encodeURIComponent(chunk));
      _ttsAudios.push(audio);
      audio.onended = playNext;
      audio.onerror = playNext;
      audio.play().catch(playNext);
    }
    playNext();
  }

  // ── MIKROFON ──────────────────────────────────────────────────
  var _micRecog = null;
  var _micActive = false;

  window.aiMic = function() {
    var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      _aiAddMsg('bot', '⚠️ Brauzeringiz mikrafonni qo\'llab-quvvatlamaydi. Chrome ishlatib ko\'ring.');
      return;
    }
    var micBtn = document.getElementById('ai-mic-btn');
    if (_micActive) {
      _micRecog && _micRecog.stop();
      return;
    }
    _micRecog = new SpeechRec();
    _micRecog.lang = 'uz-UZ';
    _micRecog.interimResults = false;
    _micRecog.maxAlternatives = 1;

    _micRecog.onstart = function() {
      _micActive = true;
      micBtn.classList.add('listening');
      micBtn.textContent = '🔴';
      _aiSetStatus('🎤 Eshitmoqda...');
    };
    _micRecog.onresult = function(e) {
      var text = e.results[0][0].transcript;
      var input = document.getElementById('ai-input');
      input.value = text;
      aiSend();
    };
    _micRecog.onerror = function(e) {
      if (e.error === 'no-speech') {
        _aiSetStatus('● Tayyor');
      } else {
        _aiAddMsg('bot', '🎤 Mikrofon xato: ' + e.error + '. Ruxsat berilganligini tekshiring.');
      }
    };
    _micRecog.onend = function() {
      _micActive = false;
      micBtn.classList.remove('listening');
      micBtn.textContent = '🎤';
      _aiSetStatus('● Tayyor');
    };
    _micRecog.start();
  };

})();
