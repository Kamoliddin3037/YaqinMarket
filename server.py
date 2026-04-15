#!/usr/bin/env python3
"""
SellFlowUZ - Secure Backend Server
Port: 8080  |  DB: db.json  |  Logs: logs/app.log
"""
import http.server
import json
import os
import sys
import hashlib
import hmac
import secrets
import time
import logging
import re
import shutil
import threading
from urllib.parse import urlparse, parse_qs, quote

# ── PATHS ──────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE  = os.path.join(BASE_DIR, 'db.json')
IMG_DIR  = os.path.join(BASE_DIR, 'images')
LOG_DIR  = os.path.join(BASE_DIR, 'logs')
PORT     = 8080
MAX_FILE_SIZE = 5 * 1024 * 1024   # 5 MB
TOKEN_TTL     = 24 * 3600          # 24 soat

# ── LOGGING ────────────────────────────────────────────────────
os.makedirs(LOG_DIR, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(LOG_DIR, 'app.log'), encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
log = logging.getLogger('mahalla')

# ── TOKEN STORAGE (xotira, server qayta ishlaganda tozalanadi) ──
_tokens = {}   # {token: {userId, role, name, expires}}

# ── DEFAULT DB ─────────────────────────────────────────────────
DEFAULT_DB = {
    "products": [], "orders": [], "offline": [],
    "users": [], "incomes": [], "banners": [],
    "staff": [], "session": None
}

# ══════════════════════════════════════════════════════════════
# PAROL XAVFSIZLIGI — PBKDF2-SHA256
# ══════════════════════════════════════════════════════════════
def hash_password(password, salt=None):
    """PBKDF2 bilan xavfsiz hash. Qaytaradi: 'pbkdf2:<salt>:<hex>'"""
    if not salt:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 200_000)
    return f"pbkdf2:{salt}:{dk.hex()}"

def verify_password(password, stored):
    """pbkdf2 yoki eski btoa formatini qabul qiladi (migratsiya uchun)."""
    if not stored:
        return False
    if stored.startswith('pbkdf2:'):
        parts = stored.split(':')
        if len(parts) != 3:
            return False
        salt = parts[1]
        return hmac.compare_digest(hash_password(password, salt), stored)
    # Eski btoa() format — backward compatibility
    try:
        import base64
        return base64.b64decode(stored).decode('utf-8') == password
    except Exception:
        return False

def upgrade_password(password):
    """btoa → pbkdf2 ko'chiradi."""
    return hash_password(password)

# ══════════════════════════════════════════════════════════════
# TOKEN MANAGEMENT
# ══════════════════════════════════════════════════════════════
def make_token(user_id, role, name):
    token = secrets.token_urlsafe(32)
    _tokens[token] = {
        'userId': user_id, 'role': role,
        'name': name, 'expires': time.time() + TOKEN_TTL
    }
    log.info(f'[AUTH] Token yaratildi: role={role}, name={name}')
    return token

def check_token(token):
    if not token or token not in _tokens:
        return None
    data = _tokens[token]
    if time.time() > data['expires']:
        del _tokens[token]
        return None
    return data

def get_token_from_headers(headers):
    auth = headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        return auth[7:].strip()
    return None

# ══════════════════════════════════════════════════════════════
# DB
# ══════════════════════════════════════════════════════════════
def load_db():
    if not os.path.exists(DB_FILE):
        save_db(DEFAULT_DB)
        return dict(DEFAULT_DB)
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for k, v in DEFAULT_DB.items():
            if k not in data:
                data[k] = v
        return data
    except Exception as e:
        log.error(f'[DB] Yuklash xatosi: {e}')
        return dict(DEFAULT_DB)

def save_db(data):
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        log.error(f'[DB] Saqlash xatosi: {e}')
        return False

# ══════════════════════════════════════════════════════════════
# CONFIG (GEMINI_API_KEY, ADMIN_PASS_HASH va h.k.)
# ══════════════════════════════════════════════════════════════
def load_config():
    cfg_file = os.path.join(BASE_DIR, 'config.json')
    try:
        if os.path.exists(cfg_file):
            with open(cfg_file) as f:
                return json.load(f)
    except Exception:
        pass
    return {}

def save_config(cfg):
    cfg_file = os.path.join(BASE_DIR, 'config.json')
    try:
        with open(cfg_file, 'w') as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)
    except Exception as e:
        log.error(f'[CFG] Saqlash xatosi: {e}')

# ══════════════════════════════════════════════════════════════
# HTTP HANDLER
# ══════════════════════════════════════════════════════════════
class Handler(http.server.SimpleHTTPRequestHandler):

    def log_message(self, format, *args):
        # Faqat API va auth loglarini chiqar
        try:
            if args and isinstance(args[0], str) and ('/api/' in args[0] or '/auth' in args[0]):
                log.info(f'[HTTP] {self.client_address[0]} — {args[0]}')
        except Exception:
            pass

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        self.wfile.write(body)

    def send_audio(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'audio/mpeg')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def require_auth(self):
        """Token tekshiradi. None qaytarsa — 401 yuborilgan."""
        token = get_token_from_headers(self.headers)
        user  = check_token(token)
        if not user:
            self.send_json({'error': 'Avtorizatsiya talab qilinadi. Qayta kiring.'}, 401)
            log.warning(f'[AUTH] Ruxsatsiz kirish: {self.path} — IP: {self.client_address[0]}')
        return user

    def read_body(self):
        length = int(self.headers.get('Content-Length', 0))
        body   = self.rfile.read(length).decode('utf-8')
        return json.loads(body) if body else {}

    # ── GET ──────────────────────────────────────────────────
    def do_GET(self):
        parsed = urlparse(self.path)
        path   = parsed.path

        if path == '/favicon.ico':
            self.send_response(204); self.end_headers(); return

        # TTS: GET /tts?t=matn
        if path == '/tts':
            import urllib.request as _req
            text = parse_qs(parsed.query).get('t', [''])[0][:200]
            if not text:
                self.send_response(400); self.end_headers(); return
            try:
                url = ('https://translate.google.com/translate_tts?ie=UTF-8&q='
                       + quote(text) + '&tl=uz&client=tw-ob&ttsspeed=0.9')
                req = _req.Request(url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://translate.google.com/'
                })
                with _req.urlopen(req, timeout=10) as resp:
                    self.send_audio(resp.read())
            except Exception as e:
                log.error(f'[TTS] Xato: {e}')
                self.send_response(500); self.end_headers()
            return

        # AUTH: Token tekshirish
        if path == '/auth/verify':
            token = get_token_from_headers(self.headers)
            user  = check_token(token)
            if user:
                self.send_json({'ok': True, 'role': user['role'], 'name': user['name']})
            else:
                self.send_json({'ok': False, 'error': 'Token eskirgan yoki noto\'g\'ri'}, 401)
            return

        # Mijoz buyurtmalarini tekshirish (tokensiz, faqat o'z buyurtmalari)
        if path == '/api/orders/mine':
            qs = parse_qs(parsed.query)
            phone = (qs.get('phone', [''])[0]).strip()
            uid   = (qs.get('uid',   [''])[0]).strip()
            if not phone and not uid:
                self.send_json({'ok': False, 'error': 'phone yoki uid kerak'}, 400); return
            db = load_db()
            all_orders = db.get('orders', [])
            def normalize(p):
                return re.sub(r'\D', '', p)[-9:] if p else ''
            ph9 = normalize(phone)
            mine = [o for o in all_orders if
                    (ph9 and normalize(o.get('userPhone',''))==ph9) or
                    (uid and o.get('userId')==uid)]
            self.send_json({'ok': True, 'data': mine})
            return

        # API: GET /api/{key}
        if path.startswith('/api/'):
            key = path[5:].rstrip('/')
            if not key:
                self.send_json({'error': 'Kalit ko\'rsatilmagan'}, 400); return
            # Ommaviy (public) kalitlar — token shart emas
            PUBLIC_KEYS = {'products', 'banners'}
            if key not in PUBLIC_KEYS:
                user = self.require_auth()
                if not user: return
            db = load_db()
            if key in db:
                self.send_json({'ok': True, 'data': db[key]})
            else:
                self.send_json({'ok': False, 'error': 'Topilmadi'}, 404)
            return

        super().do_GET()

    # ── POST ─────────────────────────────────────────────────
    def do_POST(self):
        parsed = urlparse(self.path)
        path   = parsed.path

        # ── AUTH: LOGIN ──────────────────────────────────────
        if path == '/auth/login':
            try:
                body = self.read_body()
                role     = body.get('role', '')
                login    = body.get('login', '').strip()
                password = body.get('password', '')

                if role == 'admin':
                    cfg = load_config()
                    admin_login    = cfg.get('ADMIN_LOGIN', 'admin')
                    admin_pass_hash= cfg.get('ADMIN_PASS_HASH', '')

                    # Agar hash yo'q bo'lsa, default parolni hash qilib saqlash
                    if not admin_pass_hash:
                        default_pass = cfg.get('ADMIN_PASS', '1234')
                        admin_pass_hash = hash_password(default_pass)
                        cfg['ADMIN_PASS_HASH'] = admin_pass_hash
                        cfg.pop('ADMIN_PASS', None)
                        save_config(cfg)
                        log.info('[AUTH] Admin paroli hash landi va saqlandi')

                    if login != admin_login or not verify_password(password, admin_pass_hash):
                        log.warning(f'[AUTH] Admin login muvaffaqiyatsiz: login={login} IP={self.client_address[0]}')
                        self.send_json({'ok': False, 'error': 'Login yoki parol xato'}, 401)
                        return

                    token = make_token('admin', 'admin', 'Admin')
                    self.send_json({'ok': True, 'token': token, 'role': 'admin', 'name': 'Admin'})

                elif role == 'seller':
                    db    = load_db()
                    staff = db.get('staff', [])
                    emp   = next((e for e in staff if e.get('active') and e.get('login') == login), None)

                    if not emp:
                        # Fallback: staff bo'sh bo'lsa default xodim
                        if not staff and login == 'seller':
                            emp = {'id': 0, 'name': 'Sotuvchi', 'login': 'seller',
                                   'pass': hash_password('1111'), 'role': 'seller',
                                   'active': True, 'permissions': ['pos']}
                        else:
                            log.warning(f'[AUTH] Xodim topilmadi: {login}')
                            self.send_json({'ok': False, 'error': 'Xodim topilmadi'}, 401)
                            return

                    if not verify_password(password, emp.get('pass', '')):
                        log.warning(f'[AUTH] Xodim parol xato: {login}')
                        self.send_json({'ok': False, 'error': 'Parol xato'}, 401)
                        return

                    # Eski btoa parolni pbkdf2 ga avtomatik ko'chirish
                    if emp.get('pass', '').startswith('pbkdf2:') is False:
                        emp['pass'] = hash_password(password)
                        save_db(db)
                        log.info(f'[AUTH] Parol hash landi: {login}')

                    token = make_token(emp['id'], 'seller', emp['name'])
                    self.send_json({
                        'ok': True, 'token': token, 'role': 'seller',
                        'name': emp['name'], 'employeeId': emp['id'],
                        'permissions': emp.get('permissions', ['pos'])
                    })
                else:
                    self.send_json({'ok': False, 'error': 'Noto\'g\'ri rol'}, 400)

            except Exception as e:
                log.error(f'[AUTH] Login xatosi: {e}')
                self.send_json({'error': str(e)}, 500)
            return

        # ── AUTH: PIN (shop preview) ──────────────────────────
        if path == '/auth/pin':
            try:
                body = self.read_body()
                pin  = str(body.get('pin', '')).strip()
                cfg  = load_config()
                correct = cfg.get('SHOP_PIN', '1234')
                if pin == correct:
                    self.send_json({'ok': True})
                else:
                    self.send_json({'ok': False, 'error': 'PIN noto\'g\'ri'}, 401)
            except Exception as e:
                self.send_json({'error': str(e)}, 500)
            return

        # ── AUTH: LOGOUT ─────────────────────────────────────
        if path == '/auth/logout':
            token = get_token_from_headers(self.headers)
            if token and token in _tokens:
                del _tokens[token]
                log.info(f'[AUTH] Logout: {token[:8]}...')
            self.send_json({'ok': True})
            return

        # ── AUTH: CHANGE PASSWORD ─────────────────────────────
        if path == '/auth/change-password':
            user = self.require_auth()
            if not user: return
            try:
                body    = self.read_body()
                old_pw  = body.get('old', '')
                new_pw  = body.get('new', '')
                if len(new_pw) < 4:
                    self.send_json({'ok': False, 'error': 'Parol kamida 4 ta belgi bo\'lsin'}, 400)
                    return
                if user['role'] == 'admin':
                    cfg  = load_config()
                    if not verify_password(old_pw, cfg.get('ADMIN_PASS_HASH', '')):
                        self.send_json({'ok': False, 'error': 'Eski parol xato'}, 401)
                        return
                    cfg['ADMIN_PASS_HASH'] = hash_password(new_pw)
                    save_config(cfg)
                else:
                    db    = load_db()
                    staff = db.get('staff', [])
                    emp   = next((e for e in staff if e['id'] == user['userId']), None)
                    if not emp or not verify_password(old_pw, emp.get('pass', '')):
                        self.send_json({'ok': False, 'error': 'Eski parol xato'}, 401)
                        return
                    emp['pass'] = hash_password(new_pw)
                    save_db(db)
                log.info(f'[AUTH] Parol o\'zgartirildi: {user["name"]}')
                self.send_json({'ok': True})
            except Exception as e:
                self.send_json({'error': str(e)}, 500)
            return

        # ── RASM YUKLASH ─────────────────────────────────────
        if path == '/upload':
            user = self.require_auth()
            if not user: return
            try:
                os.makedirs(IMG_DIR, exist_ok=True)
                ctype  = self.headers.get('Content-Type', '')
                length = int(self.headers.get('Content-Length', 0))

                # Fayl hajmi tekshiruvi
                if length > MAX_FILE_SIZE:
                    self.send_json({'ok': False, 'error': f'Fayl {MAX_FILE_SIZE//1024//1024}MB dan katta bo\'lmasin'}, 413)
                    return

                raw = self.rfile.read(length)
                boundary = None
                for part in ctype.split(';'):
                    part = part.strip()
                    if part.startswith('boundary='):
                        boundary = part[9:].strip('"').encode()
                        break

                if not boundary:
                    self.send_json({'ok': False, 'error': 'Boundary topilmadi'}, 400); return

                filename = None
                file_data = None
                for part in raw.split(b'--' + boundary):
                    if b'Content-Disposition' not in part: continue
                    header, _, body_b = part.partition(b'\r\n\r\n')
                    body_b = body_b.rstrip(b'\r\n')
                    header_str = header.decode('utf-8', errors='replace')
                    if 'name="filename"' in header_str:
                        filename = body_b.decode('utf-8', errors='replace').strip()
                    elif 'name="file"' in header_str:
                        file_data = body_b

                if not filename or not file_data:
                    self.send_json({'ok': False, 'error': 'Fayl yoki nom topilmadi'}, 400); return

                # PATH TRAVERSAL HIMOYA
                filename = os.path.basename(filename)
                filename = re.sub(r'[^\w.\-]', '_', filename)
                if not filename or filename.startswith('.'):
                    self.send_json({'ok': False, 'error': 'Noto\'g\'ri fayl nomi'}, 400); return

                ext = os.path.splitext(filename)[1].lower()
                if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
                    self.send_json({'ok': False, 'error': 'Faqat rasm fayllari (jpg, png, webp)'}, 400); return

                # Magic bytes tekshiruvi (fayl aslida rasm ekanligini tekshirish)
                magic = {b'\xff\xd8\xff': '.jpg', b'\x89PNG': '.png',
                         b'WEBP': '.webp', b'GIF8': '.gif'}
                is_img = any(file_data.startswith(m) or (b'WEBP' in file_data[:12]) for m in magic)
                if not is_img:
                    self.send_json({'ok': False, 'error': 'Fayl haqiqiy rasm emas'}, 400); return

                filepath = os.path.join(IMG_DIR, filename)
                # Path traversal final tekshiruvi
                if not os.path.abspath(filepath).startswith(os.path.abspath(IMG_DIR)):
                    self.send_json({'ok': False, 'error': 'Ruxsatsiz yo\'l'}, 403); return

                with open(filepath, 'wb') as f:
                    f.write(file_data)

                log.info(f'[IMG] Saqlandi: {filename} ({len(file_data)} bytes) — {user["name"]}')
                self.send_json({'ok': True, 'url': '/images/' + filename, 'filename': filename})

            except Exception as e:
                log.error(f'[IMG] Xato: {e}')
                self.send_json({'ok': False, 'error': str(e)}, 500)
            return

        # ── AI ────────────────────────────────────────────────
        if path == '/ai':
            user = self.require_auth()
            if not user: return
            import urllib.request as _req
            cfg    = load_config()
            AI_KEY = os.environ.get('GEMINI_API_KEY', '') or cfg.get('GEMINI_API_KEY', '')
            if not AI_KEY:
                self.send_json({'error': 'config.json ga GEMINI_API_KEY yozing'}, 500); return
            try:
                payload  = self.read_body()
                messages = payload.get('messages', [])
                system_text = ''
                contents    = []
                for m in messages:
                    if m['role'] == 'system':
                        system_text = m['content']
                    else:
                        role = 'model' if m['role'] == 'assistant' else 'user'
                        contents.append({'role': role, 'parts': [{'text': m['content']}]})

                gemini_payload = {
                    'contents': contents,
                    'generationConfig': {'maxOutputTokens': 1024}
                }
                if system_text:
                    gemini_payload['systemInstruction'] = {'parts': [{'text': system_text}]}

                url      = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={AI_KEY}'
                req_data = json.dumps(gemini_payload).encode('utf-8')
                req      = _req.Request(url, data=req_data, headers={'Content-Type': 'application/json'}, method='POST')
                with _req.urlopen(req, timeout=30) as resp:
                    result = json.loads(resp.read().decode('utf-8'))
                text = result['candidates'][0]['content']['parts'][0]['text']
                self.send_json({'choices': [{'message': {'content': text}}]})
            except _req.HTTPError as e:
                err = e.read().decode('utf-8')
                log.error(f'[AI] Gemini xato {e.code}: {err}')
                self.send_json({'error': f'Gemini {e.code}: {err}'}, 500)
            except Exception as e:
                log.error(f'[AI] Xato: {e}')
                self.send_json({'error': str(e)}, 500)
            return

        # ── Customer: POST /api/session (tokensiz) ───────────────
        if path == '/api/session':
            try:
                payload = self.read_body()
            except Exception:
                self.send_json({'ok': True}); return
            db = load_db()
            db['session'] = payload
            save_db(db)
            self.send_json({'ok': True})
            return

        # ── Customer: POST /api/order/new (bitta buyurtma qo'shish) ──
        if path == '/api/order/new':
            try:
                order = self.read_body()
            except Exception as e:
                self.send_json({'error': f'JSON xato: {e}'}, 400); return
            if not isinstance(order, dict) or not order.get('id'):
                self.send_json({'error': 'Noto\'g\'ri buyurtma'}, 400); return
            db = load_db()
            orders = db.get('orders', [])
            # Dublikat tekshiruvi
            if not any(o.get('id') == order['id'] for o in orders):
                orders.insert(0, order)
                db['orders'] = orders
                save_db(db)
                log.info(f'[ORDER] Yangi buyurtma: {order["id"]} — {order.get("userName","?")}')
            self.send_json({'ok': True})
            return

        # ── API: POST /api/{key} ──────────────────────────────
        if path.startswith('/api/'):
            user = self.require_auth()
            if not user: return
            key = path[5:].rstrip('/')
            if not key:
                self.send_json({'error': 'Kalit ko\'rsatilmagan'}, 400); return

            # Seller faqat orders, offline, session ga yoza oladi
            SELLER_ALLOWED = {'orders', 'offline', 'session', 'refresh_signals', 'shifts'}
            if user.get('role') == 'seller' and key not in SELLER_ALLOWED:
                self.send_json({'error': 'Ruxsat yo\'q'}, 403)
                log.warning(f'[AUTH] Seller ruxsatsiz yozish: {key} — {user["name"]}')
                return

            try:
                payload = self.read_body()
            except Exception as e:
                self.send_json({'error': f'JSON xato: {e}'}, 400); return

            db = load_db()

            # Stok manfiy bo'lmasligi tekshiruvi
            if key == 'products' and isinstance(payload, list):
                for p in payload:
                    if isinstance(p, dict) and 'stock' in p:
                        p['stock'] = max(0, int(p.get('stock', 0)))

            db[key] = payload
            ok = save_db(db)
            log.info(f'[DB] Yozildi: {key} — {user["name"]}')
            self.send_json({'ok': ok})
            return

        self.send_json({'error': 'Topilmadi'}, 404)


# ══════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════
def auto_backup():
    """Har kuni bir marta db.json ni backup qiladi."""
    BACKUP_DIR = os.path.join(BASE_DIR, 'logs', 'backups')
    os.makedirs(BACKUP_DIR, exist_ok=True)
    while True:
        try:
            if os.path.exists(DB_FILE):
                ts = time.strftime('%Y-%m-%d')
                dest = os.path.join(BACKUP_DIR, f'db_{ts}.json')
                if not os.path.exists(dest):
                    shutil.copy2(DB_FILE, dest)
                    log.info(f'[BACKUP] db_{ts}.json saqlandi')
                    # 30 kundan eski backuplarni o'chir
                    for f in os.listdir(BACKUP_DIR):
                        fp = os.path.join(BACKUP_DIR, f)
                        if os.path.isfile(fp) and (time.time()-os.path.getmtime(fp)) > 30*86400:
                            os.remove(fp)
                            log.info(f'[BACKUP] Eski backup o\'chirildi: {f}')
        except Exception as e:
            log.error(f'[BACKUP] Xato: {e}')
        time.sleep(3600)  # Har soatda tekshiradi

if __name__ == '__main__':
    os.chdir(BASE_DIR)   # SimpleHTTPRequestHandler shu papkadan serve qiladi (images/ uchun)
    os.makedirs(IMG_DIR, exist_ok=True)
    if not os.path.exists(DB_FILE):
        save_db(DEFAULT_DB)
        log.info(f'[DB] Yangi {DB_FILE} yaratildi')
    else:
        log.info(f'[DB] {DB_FILE} ishlatilmoqda')

    # Admin parolini config da tekshirish
    cfg = load_config()
    if not cfg.get('ADMIN_PASS_HASH'):
        admin_pass = cfg.get('ADMIN_PASS', '1234')
        cfg['ADMIN_PASS_HASH'] = hash_password(admin_pass)
        cfg.pop('ADMIN_PASS', None)
        save_config(cfg)
        log.info(f'[AUTH] Admin paroli hash landi (default: {admin_pass})')

    t = threading.Thread(target=auto_backup, daemon=True)
    t.start()

    http.server.HTTPServer.allow_reuse_address = True
    server = http.server.HTTPServer(('', PORT), Handler)
    print(f'\n  🏪 SELLFLOWUZ SERVER')
    print(f'  ─────────────────────────────────')
    print(f'  URL:    http://localhost:{PORT}/login.html')
    print(f'  DB:     {DB_FILE}')
    print(f'  Logs:   {LOG_DIR}/app.log')
    print(f'  Stop:   Ctrl+C\n')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n[Server] To\'xtatildi.')
        sys.exit(0)
