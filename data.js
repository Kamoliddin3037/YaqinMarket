// ==================== MAHALLA DUKONI - DATA MODULE ====================
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
  if (!product.expiryDate) return { discount: 0, finalPrice: product.sellPrice, daysLeft: null, label: '' };
  const today = new Date(); today.setHours(0,0,0,0);
  const exp = new Date(product.expiryDate); exp.setHours(0,0,0,0);
  const daysLeft = Math.ceil((exp - today) / 86400000);
  if (daysLeft <= 0) return { discount: 100, finalPrice: 0, daysLeft: 0, label: '🚫 Muddati tugagan' };
  if (daysLeft <= 7) {
    const discount = Math.min(15, Math.ceil(15 / daysLeft));
    const finalPrice = Math.floor(product.sellPrice * (100 - discount) / 100);
    return { discount, finalPrice, daysLeft, label: `⏳ ${daysLeft} kun qoldi` };
  }
  return { discount: 0, finalPrice: product.sellPrice, daysLeft, label: '' };
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
const DB = {
  VERSION: 'mahalla_v1',
  _BASE: 'http://localhost:8080',

  // ── Sync GET: serverdan o'qish ──────────────────────────────
  _cache: {},

  _get(key, fallback) {
    // Keshda bormi — serverga bormasdan qaytaradi
    if (this._cache.hasOwnProperty(key)) {
      return this._cache[key];
    }
    const req = new XMLHttpRequest();
    req.open('GET', this._BASE + '/api/' + key, false); // sync
    try {
      req.send();
      if (req.status === 200) {
        const res = JSON.parse(req.responseText);
        if (res.ok && res.data !== null && res.data !== undefined) {
          this._cache[key] = res.data; // keshga yozish
          return res.data;
        }
      }
    } catch(e) {}
    // Fallback: localStorage
    try {
      const v = localStorage.getItem(this.VERSION + '_' + key);
      if (v) {
        const parsed = JSON.parse(v);
        this._cache[key] = parsed;
        return parsed;
      }
    } catch(e) {}
    return fallback;
  },

  // ── Sync POST: serverga yozish ──────────────────────────────
  _set(key, value) {
    this._cache[key] = value; // keshni yangilash
    // localStorage ga ham yoz (backup)
    try { localStorage.setItem(this.VERSION + '_' + key, JSON.stringify(value)); } catch(e) {}
    // Serverga yoz
    const req = new XMLHttpRequest();
    req.open('POST', this._BASE + '/api/' + key, false); // sync
    req.setRequestHeader('Content-Type', 'application/json');
    try {
      req.send(JSON.stringify(value));
      return req.status === 200;
    } catch(e) {
      return false;
    }
  },

  // ── Products ────────────────────────────────────────────────
  getProducts()      { return this._get('products', _defaultProducts()); },
  saveProducts(p)    { this._set('products', p); },

  // ── Orders ──────────────────────────────────────────────────
  getOrders()        { return this._get('orders', [
    { id:'#001', userId:1, userName:'Kamola', userPhone:'998901234567',
      items:[{name:'Non (oq)',qty:2,price:2500,costPrice:1500},{name:'Tuxum (10 ta)',qty:1,price:12000,costPrice:9000}],
      productsTotal:17000, deliveryPrice:0, total:17000, payment:'cash',
      note:'', status:'done', time: new Date(Date.now()-3600000).toISOString(), profit:5000, type:'online' }
  ]); },
  saveOrders(o)      { this._set('orders', o); },

  // ── Offline Sales ────────────────────────────────────────────
  getOffline()       { return this._get('offline', [
    { id:'OFF#001', userName:'Sarvar', userPhone:'998907654321',
      items:[{name:'Sut (1L)',qty:2,price:7500,costPrice:5500},{name:'Non (oq)',qty:3,price:2500,costPrice:1500}],
      productsTotal:22500, total:22500, payment:'cash',
      status:'done', time: new Date(Date.now()-7200000).toISOString(), profit:7000, type:'offline' }
  ]); },
  saveOffline(o)     { this._set('offline', o); },

  // ── Users ────────────────────────────────────────────────────
  getUsers()         { return this._get('users', [
    { id:1, name:'Kamola', phone:'998901234567', registeredAt: new Date(Date.now()-86400000).toISOString() }
  ]); },
  saveUsers(u)       { this._set('users', u); },

  // ── Incomes ──────────────────────────────────────────────────
  getIncomes()       { return this._get('incomes', []); },
  saveIncomes(i)     { this._set('incomes', i); },

  // ── Session ──────────────────────────────────────────────────
  getSession()       { return this._get('session', null); },
  setSession(s)      { this._set('session', s); },
  clearSession()     {
    this._set('session', null);
    try { localStorage.removeItem(this.VERSION + '_session'); } catch(e) {}
  },
};

DB.getStaff  = function(){ return DB._get('staff', []); };
DB.saveStaff = function(s){ DB._set('staff', s); };
DB.getShifts  = function(){ return DB._get('shifts', []); };
DB.saveShifts = function(s){ DB._set('shifts', s); };

// ── Refresh signals ───────────────────────────────────────────
DB.getRefreshSignals  = function(){ return DB._get('refresh_signals', {}); };
DB.saveRefreshSignals = function(s){ DB._set('refresh_signals', s); };