# Image Compressor v2.0 

A modern, web-based image compression tool built with Flask and JavaScript that allows users to compress multiple images with customizable quality settings and download them as a ZIP file.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.7+-green.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-red.svg)

##  Features

- **Batch Processing**: Compress multiple images simultaneously
- **Quality Control**: Adjustable compression quality (1-95%)
- **Multiple Formats**: Supports JPG, JPEG, PNG, GIF, and BMP images
- **Modern UI**: Beautiful, responsive dark-themed interface
- **Drag & Drop**: Intuitive file upload with drag-and-drop functionality
- **Progress Tracking**: Real-time compression progress updates
- **ZIP Download**: Automatically packages compressed images into a ZIP file
- **Auto Cleanup**: Temporary files are automatically removed after 60 seconds
- **Format Conversion**: Converts all images to optimized JPEG format
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

##  Live Demo

Experience the live application: [Image Compressor v2.0](https://ayushworks.dev/projects/image-compression/)

##  Screenshots

### Main Interface
<img width="1920" height="1080" alt="main" src="https://github.com/user-attachments/assets/1252ea47-5e08-42c9-8149-55a18a791257" />


### Compression Progress
<img width="1920" height="1080" alt="compression" src="https://github.com/user-attachments/assets/b08fa164-7490-4ee1-ac83-020313d7b710" />


# Results Page
<img width="1218" height="570" alt="Screenshot From 2025-10-08 03-35-08" src="https://github.com/user-attachments/assets/ccb99db3-1971-4b0c-b0f7-4904649fd65f" />



##  Tech Stack

- **Backend**: Python 3.7+, Flask 3.0.0
- **Image Processing**: Pillow (PIL) 10.1.0
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **UI**: Font Awesome icons, Custom CSS animations
- **File Handling**: Werkzeug 3.0.1

##  Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CrimsonREwind/image_compression_v2.0.git
   cd image_compression_v2.0
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   ```
   Navigate to http://localhost:5000
   ```

##  Usage

1. **Upload Images**
   - Drag and drop images onto the upload area, or
   - Click "browse files" to select images from your computer

2. **Adjust Quality**
   - Use the quality slider to set compression level (1-95%)
   - Lower values = smaller file size, higher values = better quality

3. **Compress**
   - Click "Compress Images" to start the process
   - Monitor progress in real-time

4. **Download**
   - Once complete, click "Download ZIP" to get your compressed images
   - Files are automatically packaged in a ZIP archive

##  Configuration

### Environment Variables

```bash
# Optional: Set custom configuration
export FLASK_ENV=production
export SECRET_KEY=your-secret-key-here
export MAX_CONTENT_LENGTH=52428800 
```

### File Limits

- **Maximum file size**: 50MB per request
- **Supported formats**: JPG, JPEG, PNG, GIF, BMP
- **Output format**: JPEG (optimized)


##  API Endpoints

### `POST /upload`
Upload and validate image files
- **Parameters**: `files`, `quality`
- **Response**: Session ID and file count

### `POST /compress` 
Compress uploaded images
- **Parameters**: `files`, `quality`
- **Response**: Download URL and compression stats

### `GET /download/<filename>`
Download compressed images ZIP
- **Parameters**: `filename`
- **Response**: ZIP file download

##  Customization

### Styling
Modify `static/css/style.css` to customize the appearance:
- CSS custom properties for easy color scheme changes
- Responsive design with mobile-first approach
- Modern animations and transitions

### Compression Settings
Adjust compression parameters in `app.py`:
```python
# Default quality
quality = int(request.form.get('quality', 80))

# JPEG optimization settings
image.save(buffer, format="JPEG", quality=quality, optimize=True)
```

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- Flask community for the excellent web framework
- Pillow developers for robust image processing capabilities
- Font Awesome for beautiful icons
- Contributors and users who help improve this project

##  Support

If you encounter any issues or have questions:

- Create an [Issue](https://github.com/CrimsonREwind/image_compression_v2.0/issues)
- Check existing issues and documentation

##  Changelog

### v2.0.0 (Latest)
-  Complete UI/UX redesign with modern dark theme
-  Improved compression algorithms
-  Enhanced mobile responsiveness
-  Better error handling and user feedback
-  Performance optimizations

### v1.0.0
- Initial release
- Basic image compression functionality
- Simple web interface

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/CrimsonREwind">CrimsonREwind</a></p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
