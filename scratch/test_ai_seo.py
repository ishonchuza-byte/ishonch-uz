import urllib.request
import json
import urllib.parse

# 1. Login to get the cookie
login_url = 'http://localhost:5173/api/admin/login'
login_payload = {'password': 'admin2026'}

req_login = urllib.request.Request(
    login_url,
    data=json.dumps(login_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

cookie = None
print("Logging in to obtain admin session cookie...")
try:
    with urllib.request.urlopen(req_login) as response:
        headers = response.info()
        cookie_header = headers.get('Set-Cookie')
        if cookie_header:
            # Extract session ID from Set-Cookie header
            cookie = cookie_header.split(';')[0]
            print(f"Logged in successfully. Cookie obtained: {cookie}")
        else:
            print("Login succeeded, but no Set-Cookie header was returned.")
except Exception as e:
    print("Login failed:", e)
    exit(1)

if not cookie:
    print("Failed to obtain session cookie.")
    exit(1)

# 2. Make the authenticated request to the SEO AI Suggest endpoint
url = 'http://localhost:5173/api/admin/seo/ai-suggest'
payload = {
    'title': 'Marg\'ilonda yangi ipakchilik kombinati ish boshladi',
    'body': 'Marg\'ilon shahrida zamonaviy ipakchilik kombinati foydalanishga topshirildi. Ushbu kombinat 500 dan ortiq yangi ish o\'rinlarini yaratadi. Loyiha ipakchilik sanoatini rivojlantirish va eksport salohiyatini oshirishga yo\'naltirilgan. Bu yerda ipak tolalari, tayyor matolar va kiyim-kechaklar ishlab chiqariladi. Mahsulotlar asosan Yevropa va Osiyo mamlakatlariga eksport qilinishi rejalashtirilgan. Yangi texnologiyalar yordamida ipak tolasini qayta ishlash sifati va unumdorligi keskin oshadi.',
    'type': 'story'
}

req_seo = urllib.request.Request(
    url, 
    data=json.dumps(payload).encode('utf-8'),
    headers={
        'Content-Type': 'application/json',
        'Cookie': cookie
    }
)

print("\nSending request to /api/admin/seo/ai-suggest...")
try:
    with urllib.request.urlopen(req_seo) as response:
        res_data = response.read().decode('utf-8')
        result = json.loads(res_data)
        print("Success! Response:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
except Exception as e:
    print("Request failed:", e)
