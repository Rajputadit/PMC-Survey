# AdZone — PMC Hoarding Survey (Full-Stack with MongoDB)

Ye project aapke pehle wale static HTML form ko ek **full-stack app** me convert karta hai:
- User form fill karta hai + documents upload karta hai
- Data **MongoDB** me save hota hai (text fields + uploaded file ki info)
- Files server ke `uploads/` folder me disk par store hoti hain

## 📁 Project Structure

```
pmc-survey/
├── public/
│   ├── index.html           # Homepage (Welcome page) — transparent, links to /survey
│   └── survey.html          # Aapka poora survey form (MongoDB se connected)
└── backend/
    ├── .env                 # Config (PORT, MongoDB URI) — ye kabhi git par push mat karna
    ├── .env.example         # Template for .env
    ├── package.json
    ├── server.js            # Main entry point (/ → homepage, /survey → form)
    ├── config/
    │   └── db.js            # MongoDB connection
    ├── models/
    │   └── Survey.js        # Mongoose schema (saare form fields + documents)
    ├── middleware/
    │   └── upload.js        # Multer file-upload config (file_1 ... file_11)
    ├── controllers/
    │   └── surveyController.js
    ├── routes/
    │   └── surveyRoutes.js
    └── uploads/             # Uploaded documents yaha save hongi
```

## 🏠 Homepage & Survey Navigation

- `http://localhost:8080/` → Welcome/homepage khulega (nav bar, hero section, "Why Choose AdZone" cards, survey CTA banner, footer)
- Homepage par kaii jagah **"Submit Survey / Start Survey"** buttons hain — sab `/survey` par le jaate hain, jaha poora form hai
- Homepage ka background image `event.jpg` hai — is file ko `public/` folder me daalna zaroori hai (jaise `Budha.jpeg`/`Budha2.png` survey form ke liye zaroori hain), warna background sirf dark overlay color dikhega

## 🚀 Setup Steps

### 1. MongoDB install/setup karein
Do options hain:

**Option A — Local MongoDB** (apne computer par):
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) install karein
- Ise start karein (`mongod`)
- `.env` me default `MONGO_URI` already local ke liye set hai

**Option B — MongoDB Atlas** (free cloud database, recommended for beginners):
1. https://www.mongodb.com/cloud/atlas/register par free account banayein
2. Ek free (M0) cluster banayein
3. "Connect" → "Drivers" se connection string copy karein
4. `backend/.env` file me `MONGO_URI` ko us string se replace karein:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pmc_hoarding_survey
   ```
   (`<username>` aur `<password>` apne Atlas credentials se replace karein)

### 2. Dependencies install karein
```bash
cd backend
npm install
```

### 3. Server start karein
```bash
npm start
```
Aapko ye dikhna chahiye:
```
✅ MongoDB Connected: ...
🚀 PMC Hoarding Survey server running at http://localhost:8080
```

### 4. Form kholein
Browser me jayein: **http://localhost:8080**

Form fill karke submit karte hi:
- Saara text data MongoDB ke `surveys` collection me save hoga
- Upload ki gayi files `backend/uploads/` folder me save hongi, aur unka path/details bhi database me store honge

## 🔍 Data check karne ke liye (API endpoints)

- `GET http://localhost:8080/api/surveys` → saari submissions ki list (JSON)
- `GET http://localhost:8080/api/surveys/:id` → ek specific submission

Aap ye MongoDB Compass (GUI tool) se bhi directly dekh sakte hain — bas apna `MONGO_URI` Compass me daalke connect kar lein.

## ⚙️ Customization Notes

- **File size limit**: `.env` me `MAX_FILE_SIZE_MB` change karein (default 10MB per file).
- **Allowed file types**: `backend/middleware/upload.js` me `allowedMimeTypes` array edit karein.
- **New form field add karna ho** to teen jagah update karein:
  1. `public/index.html` — input me `name="yourFieldName"` add karein
  2. `backend/models/Survey.js` — schema me naya field add karein
  3. `backend/controllers/surveyController.js` — `createSurvey` me `body.yourFieldName` map karein

## ☁️ Render par Deploy karna (ya koi bhi hosting)

`.env` file **kabhi bhi GitHub/Render par upload nahi hoti** (ye jaan-bujhkar `.gitignore` me hai, security ke liye). Isliye hosting par deploy karte waqt, environment variables **manually dashboard me add karne padte hain**:

1. Render.com par apni service (Web Service) ke dashboard me jayein
2. **Environment** tab kholein
3. **"Add Environment Variable"** se ye add karein:
   - `MONGO_URI` → aapka MongoDB Atlas connection string
   - `PORT` → aam taur par zaroorat nahi (Render khud assign karta hai), lekin agar chahein to daal sakte hain
4. **Save** karein → Render automatically service ko restart/redeploy kar dega

**Build/Start commands (Render settings me):**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Agar `MONGO_URI` set nahi hai to server ab ek clear error message dega batate hue exactly kya missing hai, "undefined" wali confusing error ki jagah.

## 📝 Important

- `.env` file me apna real MongoDB URI daalna na bhoolein, warna server connect nahi hoga.
- Production me deploy karte waqt `.env` file ko kabhi bhi public/GitHub par mat daalein (`.gitignore` me already excluded hai).
- Agar aap chahte hain ki files disk ki jagah MongoDB (GridFS) me hi store hon, wo bhi possible hai — bataiye to wo version bana deta hoon.
