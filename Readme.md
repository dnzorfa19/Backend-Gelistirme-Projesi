# UniTask – Üniversite Görev ve Proje Yönetim API

UniTask, üniversite öğrencilerinin görevlerini ve projelerini yönetebilmesi için geliştirilmiş bir REST API projesidir.

## Kullanılan Teknolojiler

- Node.js
- Express.js
- JavaScript
- JSON
- Swagger / OpenAPI
- Postman

## Özellikler

- Görevleri listeleme
- ID ile görev görüntüleme
- Yeni görev oluşturma
- Görev güncelleme
- Görev silme
- Görev filtreleme
- Görev arama
- Sayfalama (Pagination)
- İstek kayıtları (Logger)
- Veri doğrulama (Validation)
- Hata yönetimi
- Swagger API dokümantasyonu

## Proje Klasör Yapısı

```text
UniTask/
│
├── app.js
├── swagger.js
├── package.json
│
├── data/
│   └── tasks.json
│
├── middleware/
│   ├── logger.js
│   ├── validation.js
│   └── errorHandler.js
│
└── routes/
    └── taskRoutes.js
    Öncelikle terminali proje klasöründe açın:

cd UniTask

Gerekli paketleri yükleyin:

npm install
Projeyi Çalıştırma

API'yi çalıştırmak için:

npm start

API aşağıdaki adreste çalışacaktır:

http://localhost:3000
API Endpoint'leri
1. Tüm Görevleri Getirme
GET /api/tasks

Tüm görevleri listeler.

2. ID ile Görev Getirme
GET /api/tasks/:id

Belirtilen ID'ye sahip görevi getirir.

Örnek:

GET /api/tasks/1
3. Yeni Görev Oluşturma
POST /api/tasks

Örnek istek:

{
    "title": "Veritabanı ödevini tamamla",
    "description": "SQL Server ödevini tamamla.",
    "course": "Backend Development",
    "priority": "high",
    "status": "pending",
    "dueDate": "2026-10-10",
    "assignee": "Deniz"
}
4. Görev Güncelleme
PUT /api/tasks/:id

Belirtilen ID'ye sahip görevin bilgilerini günceller.

Örnek:

PUT /api/tasks/1
5. Görev Silme
DELETE /api/tasks/:id

Belirtilen ID'ye sahip görevi siler.

Örnek:

DELETE /api/tasks/1
Filtreleme

Görevler durumlarına göre filtrelenebilir.

Örneğin:

GET /api/tasks?status=pending

Belirli bir önceliğe sahip görevleri getirmek için:

GET /api/tasks?priority=high
Görev Arama

Görevlerde arama yapmak için search parametresi kullanılabilir.

GET /api/tasks?search=database

Arama işlemi aşağıdaki alanlarda gerçekleştirilir:

Görev başlığı
Görev açıklaması
Ders
Atanan kişi
Sayfalama (Pagination)

Görevleri sayfalara bölmek için page ve limit parametreleri kullanılabilir.

GET /api/tasks?page=1&limit=5

İkinci sayfayı görüntülemek için:

GET /api/tasks?page=2&limit=5

API aşağıdaki bilgileri döndürür:

Sayfa numarası
Sayfa başına görev sayısı
Toplam görev sayısı
Toplam sayfa sayısı
İlgili görevler
Birden Fazla Filtre Kullanımı

Filtreleme, arama ve sayfalama parametreleri birlikte kullanılabilir.

Örneğin:

GET /api/tasks?status=pending&priority=high&page=1&limit=5
Swagger API Dokümantasyonu

API'nin interaktif Swagger dokümantasyonuna aşağıdaki adresten ulaşılabilir:

http://localhost:3000/api-docs

Swagger üzerinden API endpoint'leri görüntülenebilir ve doğrudan test edilebilir.

Middleware Yapısı
Logger Middleware

API'ye gelen HTTP isteklerinin bilgilerini terminale kaydeder.

Örneğin:

[2026-10-03T09:30:00.000Z] GET /api/tasks
Validation Middleware

Yeni görev oluşturulurken ve görev güncellenirken gönderilen verilerin geçerliliğini kontrol eder.

Öncelik değerleri:

low
medium
high
Error Handler Middleware

Sunucu tarafında beklenmeyen bir hata oluştuğunda standart bir hata mesajı döndürür.

Veri Yapısı

Görevler data/tasks.json dosyasında JSON formatında saklanmaktadır.

Örnek görev:

{
    "id": 1,
    "title": "Veritabanı ödevini tamamla",
    "description": "SQL Server ödevini tamamla.",
    "course": "Backend Development",
    "priority": "high",
    "status": "pending",
    "dueDate": "2026-10-10",
    "assignee": "Deniz"
}
Test

API aşağıdaki araçlarla test edilebilir:

Postman
Swagger UI

Postman üzerinden:

http://localhost:3000/api/tasks

Swagger üzerinden:

http://localhost:3000/api-docs

adresleri kullanılabilir.

Projeyi Başlatma Özeti
npm install
npm start

API:

http://localhost:3000

Swagger:

http://localhost:3000/api-docs
Geliştirici

Deniz Orfa