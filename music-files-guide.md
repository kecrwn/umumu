# 🎵 Music Files Directory Structure

When you upload music files, they will be automatically handled by the JavaScript player. Here's how the system works:

## 📂 File Handling

### **Upload Process**
1. You select files using the "Upload Music Files" button
2. JavaScript creates object URLs for the files
3. Files are loaded into the audio player immediately
4. No files are permanently stored (unless you choose to save them)

### **Supported Formats**
- ✅ **MP3** (Recommended for best compatibility)
- ✅ **M4A/AAC** (High quality with smaller file size)
- ✅ **WAV** (Uncompressed, high quality)
- ✅ **FLAC** (Lossless audio, larger files)

## 🎵 Song Assignment

When you upload multiple files, they are automatically assigned to the song cards:

```
File 1 → "Our First Dance"
File 2 → "Adventure Awaits" 
File 3 → "Cozy Nights"
File 4 → "Every Moment"
```

**Note**: If you upload fewer than 4 files, only the first N cards will be updated with your music. The remaining cards will keep their default settings.

## 🔧 Technical Details

### **Memory Management**
- Files are loaded into memory using object URLs
- Previous file URLs are automatically cleaned up
- No permanent storage on the server

### **Audio Processing**
- Files are processed client-side for privacy
- Real-time frequency analysis for visualizations
- Cross-browser audio compatibility

## 💡 Tips for Best Experience

1. **File Size**: Keep files under 10MB for smooth performance
2. **Quality**: Use 320kbps MP3 for good quality and performance
3. **Metadata**: Include song titles and artists in file properties
4. **Order**: Upload files in the order you want them to appear

## 🎨 Visual Effects

Each song gets a unique color theme:
- **Song 1**: Golden Yellow (#FFD700)
- **Song 2**: Hot Pink (#FF69B4) 
- **Song 3**: Sky Blue (#87CEEB)
- **Song 4**: Light Green (#98FB98)

The canvas visualizations will use these colors to create beautiful, dancing animations that match each song's personality!

---

**Ready to upload your favorite songs and watch them come to life!** 🌟