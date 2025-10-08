# Cloudinary Setup Guide

## 1. Create a Cloudinary Account

- Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
- Sign up for a free account

## 2. Get Your Cloudinary Credentials

After signing up, go to your [Cloudinary Dashboard](https://cloudinary.com/console) and note down:

- **Cloud Name** (found in the dashboard)
- **API Key** (found in the dashboard)
- **API Secret** (found in the dashboard)

## 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload Presets**
3. Click **Add upload preset**
4. Set the following:
   - **Preset name**: `program_images` (or any name you prefer)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `programs` (optional, for organization)
5. Click **Save**

## 4. Configure Environment Variables

Create a `.env` file in your project root with:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name_here
VITE_CLOUDINARY_API_KEY=your_api_key_here
```

Replace the values with your actual Cloudinary credentials.

**Note**: In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend.

## 5. Database Schema Update

Make sure your `programs` table in Supabase has an `img_url` column:

```sql
ALTER TABLE programs ADD COLUMN img_url TEXT;
```

## 6. Test the Implementation

1. Start your development server: `npm run dev`
2. Navigate to the Program Add page
3. Try uploading an image
4. Check if the image appears in your Cloudinary dashboard
5. Verify the `img_url` is saved in your database

## Troubleshooting

- **Upload fails**: Check your Cloudinary credentials and upload preset
- **CORS errors**: Make sure your upload preset is set to "Unsigned"
- **Database errors**: Ensure the `img_url` column exists in your `programs` table
