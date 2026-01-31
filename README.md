# 🦷 Diş Kliniği - AI Randevu Sistemi

Modern bir diş kliniği web sitesi. **Sesli AI asistan** (Vapi AI) ve **manuel form** ile randevu alma özelliği içerir.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22-teal)
![Vapi AI](https://img.shields.io/badge/Vapi-AI-purple)

## ✨ Özellikler

- 🎤 **Sesli Randevu** - Vapi AI ile Türkçe sesli asistan
- 📝 **Manuel Randevu** - Web formu ile randevu oluşturma
- 👨‍💼 **Admin Paneli** - Tüm randevuları görüntüleme ve yönetme
- 🔐 **Admin Girişi** - Kullanıcı adı/şifre ile koruma
- 📱 **Responsive Tasarım** - Mobil uyumlu arayüz
- 🗄️ **SQLite Veritabanı** - Prisma ORM ile

---
[Siteyi Görmek İçin](https://salverform-maybell-unsullen.ngrok-free.dev/)
## 📸 Ekran Görüntüleri
<img width="1920" height="952" alt="image" src="https://github.com/user-attachments/assets/1876020c-0cff-44f9-96f8-7f3de58ec554" />
<img width="1919" height="956" alt="image" src="https://github.com/user-attachments/assets/a00d5302-4fb5-4698-b2c9-fb5b4d579ca0" />
<img width="1815" height="952" alt="image" src="https://github.com/user-attachments/assets/25ea15cb-3eef-42b1-a9ac-80885120d082" />



## 🚀 Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/YOUR_USERNAME/dis-klinigi.git
cd dis-klinigi
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Dosyasını Ayarlayın

`.env` dosyasını oluşturun veya düzenleyin:

```env
# Database
DATABASE_URL="file:./dev.db"

# Vapi AI Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY="your-vapi-public-key"
NEXT_PUBLIC_VAPI_ASSISTANT_ID="your-vapi-assistant-id"

# Admin Panel Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin"
```

### 4. Veritabanını Oluşturun

```bash
npx prisma db push
```

### 5. Projeyi Başlatın

```bash
npm run dev
```

Tarayıcıda açın: http://localhost:3000

---

## 🎤 Vapi AI Kurulumu

### Adım 1: Vapi Hesabı Oluşturun

1. https://vapi.ai adresine gidin
2. Hesap oluşturun veya giriş yapın

### Adım 2: Public Key Alın

1. **Dashboard** → **Organization Settings**
2. **Public Key** kopyalayın
3. `.env` dosyasına yapıştırın:
   ```
   NEXT_PUBLIC_VAPI_PUBLIC_KEY="e41e1584-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```

### Adım 3: Assistant Oluşturun

1. **Dashboard** → **Assistants** → **Create Assistant**
2. Aşağıdaki ayarları yapın:

**Model:**
- Provider: OpenAI
- Model: gpt-4o
- Temperature: 0.5
- Max Tokens: 350

**Voice:**
- Provider: Vapi
- Voice: Elliot (veya Türkçe destekleyen bir ses)

**Transcriber:**
- Provider: Deepgram
- Model: nova-3
- Language: Turkish (tr)

**First Message:**
```
Merhaba, Dentist Kliniği'ne hoş geldiniz. Ben asistanınız Selin. Size randevu veya tedavi konusunda nasıl yardımcı olabilirim?
```

---

## 📋 Mükemmel System Prompt

Aşağıdaki prompt'u Vapi Assistant ayarlarında **System Prompt** bölümüne yapıştırın:

```
# KİMLİK VE ROL
Sen "Dentist Kliniği"nin profesyonel yapay zeka sesli asistanı **Selin**'sin.
Görevin: Hastaları karşılamak, şikayetlerini dinlemek, uygun doktora yönlendirmek ve randevu oluşturmak.

# SES TONU VE İLETİŞİM
- Ses tonun: Sıcak, güler yüzlü, profesyonel ve güven verici
- Dil: Sadece Türkçe konuş, asla İngilizce kelime kullanma
- Konuşma tarzı: Kısa, net ve anlaşılır cümleler kur
- Empati: Hastanın şikayetine "geçmiş olsun" veya "anlıyorum" gibi ifadelerle empati göster
- Sabır: Hastanın sözünü asla kesme, tamamen bitirmesini bekle

# KLİNİK BİLGİLERİ

## Doktorlarımız
| Doktor | Uzmanlık Alanı | Uygun Durumlar |
|--------|---------------|----------------|
| Dr. Can Yılmaz | Pedodonti (Çocuk Diş Hekimi) | Çocuk hastaları, süt dişi tedavileri, çocuklarda kanal tedavisi |
| Dr. Elif Demir | Ortodonti | Diş teli, şeffaf plak, çapraşık dişler, çene problemleri |
| Dr. Mehmet Öz | Endodonti & Genel | Kanal tedavisi, diş ağrısı, sıcak/soğuk hassasiyeti, apse |

## Tedavi Hizmetleri
- İmplant (eksik diş için)
- Diş Beyazlatma (estetik)
- Kanal Tedavisi (ağrı, apse, hassasiyet)
- Zirkonyum Kaplama (estetik kaplama)
- Genel Kontrol (rutin muayene)
- Diş Çekimi (çekilmesi gereken dişler)
- Dolgu (çürük tedavisi)
- Diş Temizliği (tartar, plak temizliği)
- Ortodonti (tel tedavisi)

## Çalışma Saatleri
- Pazartesi - Cumartesi: 09:00 - 17:30
- Pazar: Kapalı
- Öğle arası: 12:30 - 13:30

## Randevu Saatleri (30 dakikalık slotlar)
Sabah: 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00
Öğleden Sonra: 14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00

# KONUŞMA AKIŞI

## 1. KARŞILAMA
Hasta aramayı açtığında:
- Sıcak bir şekilde karşıla
- Kendini tanıt
- Nasıl yardımcı olabileceğini sor

## 2. ŞİKAYET ANALİZİ
Hasta bir şikayet bildirirse detaylı soru sor:

**Diş ağrısı için:**
"Geçmiş olsun. Ağrınızın türünü anlamamız için birkaç soru sormam gerekiyor. Ağrınız zonklama şeklinde mi, yoksa sıcak veya soğuk içeceklerde mi hassasiyet hissediyorsunuz?"

**Estetik sorunlar için:**
"Anlıyorum. Dişlerinizin görünümüyle ilgili tam olarak nelerden rahatsızsınız? Renk mi, şekil mi yoksa dizilim mi?"

**Çocuk hastalar için:**
"Çocuğunuz kaç yaşında? Daha önce diş hekimine gitti mi?"

## 3. DOKTOR ÖNERİSİ
Şikayete göre uygun doktoru öner:

- Ağrı, zonklama, hassasiyet, apse → "Bu belirtiler için **Dr. Mehmet Öz** en uygun hekim olacaktır."
- Tel, çapraşık diş, çene → "Ortodonti uzmanımız **Dr. Elif Demir** size yardımcı olabilir."
- Çocuk hasta → "Çocuk hastalarımız için uzman **Dr. Can Yılmaz** ile randevu oluşturabilirim."

## 4. TARİH VE SAAT BELİRLEME
- Hastanın uygun olduğu günü sor
- Müsait saatleri öner
- Tarih formatı: Yarın, bu hafta, gelecek hafta gibi görece ifadeler kullan
- Saat formatı: "On dört" yerine "Öğleden sonra 2" veya "14:00" şeklinde net söyle

**Örnek:**
"Yarın için 14:00 ve 16:00 saatlerinde müsaitlik var. Hangi saat size uygun?"

## 5. BİLGİ TOPLAMA (KRİTİK)
Randevu onaylanmadan önce MUTLAKA şu bilgileri topla:

1. **Ad Soyad**: "Randevuyu kimin adına oluşturayım? Adınızı ve soyadınızı alabilir miyim?"
2. **Telefon**: "Sizi bilgilendirmemiz için telefon numaranızı alabilir miyim?"

**Telefon numarası alma örneği:**
- Hasta rakamları tek tek söyleyebilir, gruplar halinde söyleyebilir
- Doğrulama yap: "Numaranızı tekrar ediyorum: 0555 123 45 67. Doğru mu?"

## 6. RANDEVU ONAYLAMA
Tüm bilgiler toplandıktan sonra `book_appointment` fonksiyonunu çağır.

Fonksiyon çağrılmadan önce özet ver:
"Bilgilerinizi özetliyorum: [İsim] adına, [Doktor] ile [Tarih] günü saat [Saat]'de [Tedavi] randevusu oluşturuyorum. Onaylıyor musunuz?"

## 7. KAPANIŞ
Randevu oluşturulduktan sonra:
"Randevunuz başarıyla oluşturuldu. Randevu gününüzde kliniğimize 10 dakika erken gelmenizi rica ederiz. Sağlıklı günler dilerim, görüşmek üzere!"

# FİYAT POLİTİKASI
- "Fiyat ne kadar?" sorusuna: "Ön muayenelerimiz tamamen **ücretsizdir**. Tedavi ücretleri muayene sonrası hekim tarafından belirlenmektedir."
- Kesin fiyat verme, her zaman muayeneye yönlendir

# RANDEVU KURALLARI
- Aynı doktorun aynı gün aynı saatinde birden fazla randevu olamaz
- Geçmiş tarihlere randevu oluşturulamaz
- Pazar günleri randevu alınamaz
- Öğle arası (12:30-13:30) randevu verilmez

# ACİL DURUMLAR
Hasta acil durum bildirirse (şiddetli ağrı, kanama, şişlik):
"Bu acil bir durum gibi görünüyor. Sizi hemen bugün için en yakın saate randevu vermeye çalışayım. Eğer çok acilse kliniğimizi 0212 XXX XX XX numarasından arayabilirsiniz."

# YAPAMAYACAKLARIN
- Tıbbi teşhis koyma
- İlaç önerme
- Kesin fiyat verme
- Doktorların kişisel bilgilerini paylaşma
- Türkçe dışında konuşma
- Uzun ve karmaşık cümleler kurma

# ÖNEMLİ NOTLAR
- Her zaman kibar ve profesyonel ol
- Hasta bilgilerini tekrar ederek doğrula
- Anlaşılmayan durumda tekrar sor
- Fonksiyonu çağırmadan önce tüm bilgilerin tam olduğundan emin ol
- Tarih için bugünün tarihini referans al
```

---

### Adım 4: Tool (Fonksiyon) Ekleyin

1. **Tools** bölümüne gidin
2. **Add Tool** → **Function** seçin

**Function Name:** `book_appointment`

**Description:** `Diş kliniği için randevu oluşturur. Hastanın adı, telefonu, doktor, tedavi türü, tarih ve saat bilgilerini alarak veritabanına kaydeder.`

**Server URL:** 
```
https://YOUR-NGROK-URL.ngrok-free.dev/api/vapi
```

**Parameters:**
```json
{
  "type": "object",
  "required": ["name", "phone", "doctor", "service", "date", "time"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Hastanın adı ve soyadı (örn: Ahmet Yılmaz)"
    },
    "phone": {
      "type": "string",
      "description": "Hastanın telefon numarası, boşluksuz (örn: 05551234567)"
    },
    "doctor": {
      "type": "string",
      "description": "Randevu alınacak doktor. Sadece şu değerler kabul edilir: 'Dr. Can Yılmaz', 'Dr. Elif Demir', 'Dr. Mehmet Öz'"
    },
    "service": {
      "type": "string",
      "description": "Yapılacak tedavi türü. Kabul edilen değerler: 'İmplant', 'Diş Beyazlatma', 'Kanal Tedavisi', 'Zirkonyum Kaplama', 'Genel Kontrol', 'Diş Çekimi', 'Dolgu', 'Diş Temizliği', 'Ortodonti'"
    },
    "date": {
      "type": "string",
      "description": "Randevu tarihi, YYYY-MM-DD formatında (örn: 2026-01-15)"
    },
    "time": {
      "type": "string",
      "description": "Randevu saati, HH:MM formatında, 24 saat diliminde (örn: 14:00, 09:30)"
    }
  }
}
```

### Adım 5: Assistant ID'yi Kaydedin

1. Assistant'ı kaydedin
2. Assistant ID'yi kopyalayın (URL'den veya ayarlardan)
3. `.env` dosyasına ekleyin:
   ```
   NEXT_PUBLIC_VAPI_ASSISTANT_ID="8c198d28-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```

---

## 🌐 Ngrok Kurulumu (Vapi Tool için Gerekli)

Vapi'nin tool'unuzu çağırabilmesi için sunucunuzun internetten erişilebilir olması gerekir.

### Windows

#### 1. Ngrok'u İndirin
https://ngrok.com/download adresinden Windows sürümünü indirin ve zip'i çıkarın.

#### 2. PATH'e Ekleyin (Opsiyonel)
Ngrok.exe dosyasını `C:\ngrok\` klasörüne koyun ve sistem PATH'ine ekleyin.

#### 3. Ngrok'u Başlatın
```powershell
ngrok http 3000
```

---

### macOS

#### 1. Homebrew ile Kurulum (Önerilen)
```bash
brew install ngrok/ngrok/ngrok
```

#### 2. Veya Manuel İndirme
```bash
# ARM (M1/M2/M3) Mac için
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null

# veya direkt indirme
# https://ngrok.com/download adresinden macOS sürümünü indirin
```

#### 3. Ngrok'u Başlatın
```bash
ngrok http 3000
```

---

### Linux

#### 1. Snap ile Kurulum
```bash
sudo snap install ngrok
```

#### 2. Veya APT ile Kurulum (Debian/Ubuntu)
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

#### 3. Ngrok'u Başlatın
```bash
ngrok http 3000
```

---

### Ngrok Yapılandırması (Tüm Platformlar)

#### 1. Hesap Oluşturun
https://dashboard.ngrok.com/signup adresinden ücretsiz hesap oluşturun.

#### 2. Auth Token'ı Ekleyin
Dashboard'dan auth token'ınızı kopyalayın ve terminalde çalıştırın:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

#### 3. URL'yi Kopyalayın
Ngrok başlatıldığında şöyle bir çıktı göreceksiniz:
```
Forwarding    https://xxxxx.ngrok-free.dev -> http://localhost:3000
```

#### 4. Vapi'de Server URL'yi Güncelleyin
Tool ayarlarında Server URL'yi ngrok URL'si ile güncelleyin:
```
https://xxxxx.ngrok-free.dev/api/vapi
```

> ⚠️ **Önemli:** Ücretsiz ngrok planında her yeniden başlatmada yeni URL alırsınız. URL değiştiğinde Vapi Dashboard'da güncelleyin.

> 💡 **İpucu:** Sabit URL için ngrok'un ücretli planını veya projeyi Vercel/Railway gibi platformlara deploy edebilirsiniz.

---

## 📁 Proje Yapısı

```
dis-klinigi/
├── app/
│   ├── admin/
│   │   └── page.tsx           # Admin paneli (login + randevu listesi)
│   ├── api/
│   │   ├── admin/
│   │   │   └── auth/
│   │   │       └── route.ts   # Admin giriş API
│   │   ├── appointments/
│   │   │   ├── route.ts       # Randevu CRUD (GET, POST)
│   │   │   └── [id]/
│   │   │       └── route.ts   # Tek randevu (PATCH, DELETE)
│   │   └── vapi/
│   │       └── route.ts       # Vapi webhook endpoint
│   ├── components/
│   │   └── AppointmentModal.tsx  # Manuel randevu formu
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Ana sayfa + Vapi entegrasyonu
├── lib/
│   └── prisma.ts              # Prisma client
├── prisma/
│   ├── schema.prisma          # Veritabanı şeması
│   └── dev.db                 # SQLite veritabanı
├── public/
├── .env                       # Environment variables
├── package.json
└── README.md
```

---

## 🔐 Admin Paneli

### Giriş Bilgileri

- **URL:** http://localhost:3000/admin
- **Kullanıcı Adı:** `admin` (veya .env'de belirtilen)
- **Şifre:** `admin` (veya .env'de belirtilen)

### Özellikler

- ✅ Tüm randevuları görüntüleme
- ✅ Duruma göre filtreleme (Beklemede, Onaylandı, İptal)
- ✅ Randevu onaylama/iptal etme
- ✅ Randevu silme
- ✅ İstatistik kartları

---

## 🧪 API Test

### Manuel Randevu Oluşturma (Terminal)

**macOS / Linux:**
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hasta",
    "phone": "05551234567",
    "doctor": "Dr. Can Yılmaz",
    "service": "Genel Kontrol",
    "date": "2026-01-10",
    "time": "10:00"
  }'
```

**Windows (PowerShell):**
```powershell
$body = '{"name":"Test Hasta","phone":"05551234567","doctor":"Dr. Can Yılmaz","service":"Genel Kontrol","date":"2026-01-10","time":"10:00"}'
Invoke-WebRequest -Uri "http://localhost:3000/api/appointments" -Method POST -ContentType "application/json" -Body $body
```

### Vapi Tool Test

**macOS / Linux:**
```bash
curl -X POST http://localhost:3000/api/vapi \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "type": "tool-calls",
      "toolCalls": [{
        "id": "call_123",
        "function": {
          "name": "book_appointment",
          "arguments": {
            "name": "Test Hasta",
            "phone": "05551234567",
            "doctor": "Dr. Can Yılmaz",
            "service": "Genel Kontrol",
            "date": "2026-01-10",
            "time": "14:00"
          }
        }
      }]
    }
  }'
```

**Windows (PowerShell):**
```powershell
$body = '{"message":{"type":"tool-calls","toolCalls":[{"id":"call_123","function":{"name":"book_appointment","arguments":{"name":"Test Hasta","phone":"05551234567","doctor":"Dr. Can Yılmaz","service":"Genel Kontrol","date":"2026-01-10","time":"14:00"}}}]}}'
Invoke-WebRequest -Uri "http://localhost:3000/api/vapi" -Method POST -ContentType "application/json" -Body $body
```

---

## 🎯 Kullanım

### Sesli Randevu (AI Asistan)

1. Ana sayfada sağ alt köşedeki 🎤 **mikrofon butonuna** tıklayın
2. Asistan sizi karşılayacak
3. Şikayetinizi söyleyin (örn: "Dişim ağrıyor")
4. Asistanın sorularını cevaplayın
5. Randevunuz otomatik oluşturulacak

### Manuel Randevu

1. Ana sayfada **"Randevu Al"** butonuna tıklayın
2. Formu doldurun
3. **"Randevu Oluştur"** butonuna tıklayın

### Admin Paneli

1. http://localhost:3000/admin adresine gidin
2. Giriş yapın (admin/admin)
3. Randevuları görüntüleyin ve yönetin

---

## 📝 Environment Değişkenleri

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `DATABASE_URL` | SQLite veritabanı yolu | `file:./dev.db` |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | Vapi Public Key | `e41e1584-...` |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Vapi Assistant ID | `8c198d28-...` |
| `ADMIN_USERNAME` | Admin kullanıcı adı | `admin` |
| `ADMIN_PASSWORD` | Admin şifresi | `admin` |

---

## 🐛 Sorun Giderme

### Ses Çalışmıyor

1. Tarayıcı mikrofon iznini kontrol edin
2. Konsolu açın (F12) ve hataları kontrol edin
3. Vapi Public Key'in doğru olduğundan emin olun
4. HTTPS üzerinden erişim deneyin (bazı tarayıcılar HTTP'de mikrofonu engeller)

### Tool Çalışmıyor (404 Hatası)

1. Ngrok'un çalıştığından emin olun (`ngrok http 3000`)
2. Server URL'nin güncel olduğunu kontrol edin
3. Dev server'ın çalıştığından emin olun (`npm run dev`)
4. Ngrok URL'sinin sonunda `/api/vapi` olduğundan emin olun

### Veritabanı Hatası

```bash
# Veritabanını sıfırla ve yeniden oluştur
rm prisma/dev.db
npx prisma db push
npx prisma generate
```

### macOS: "ngrok" cannot be opened

```bash
# Güvenlik ayarını bypass et
xattr -d com.apple.quarantine /usr/local/bin/ngrok
# veya System Preferences > Security & Privacy'den izin ver
```

### Windows: PowerShell Execution Policy Hatası

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---
