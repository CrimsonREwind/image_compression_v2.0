from flask import Flask, render_template, request, send_file, jsonify
from PIL import Image
import io
import zipfile
import os
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  
app.config['UPLOAD_FOLDER'] = 'temp_uploads'
app.secret_key = 'your-secret-key-here'


os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400
    
    files = request.files.getlist('files')
    quality = int(request.form.get('quality', 80))
    
    if not files or files[0].filename == '':
        return jsonify({'error': 'No files selected'}), 400

    for file in files:
        if not allowed_file(file.filename):
            return jsonify({'error': f'Invalid file type: {file.filename}'}), 400
    

    session_id = str(uuid.uuid4())
    
    return jsonify({
        'session_id': session_id,
        'file_count': len(files),
        'quality': quality
    })

@app.route('/compress', methods=['POST'])
def compress_images():
    files = request.files.getlist('files')
    quality = int(request.form.get('quality', 80))
    
    if not files:
        return jsonify({'error': 'No files to compress'}), 400
    
    try:
        compressed_images = []
        
        for i, file in enumerate(files):
            if file and allowed_file(file.filename):

                image = Image.open(io.BytesIO(file.read()))
                

                if image.mode in ('RGBA', 'P', 'L'):
                    image = image.convert('RGB')
                

                buffer = io.BytesIO()
                image.save(buffer, format="JPEG", quality=quality, optimize=True)
                compressed_data = buffer.getvalue()
                

                original_name = secure_filename(file.filename)
                name_without_ext = os.path.splitext(original_name)[0]
                
                compressed_images.append({
                    'data': compressed_data,
                    'filename': f"{name_without_ext}_compressed.jpg"
                })
                

                progress = int(((i + 1) / len(files)) * 100)
                

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for img in compressed_images:
                zip_file.writestr(img['filename'], img['data'])
        
        zip_buffer.seek(0)
        

        session_id = str(uuid.uuid4())
        zip_filename = f"compressed_images_{session_id}.zip"
        zip_path = os.path.join(app.config['UPLOAD_FOLDER'], zip_filename)
        
        with open(zip_path, 'wb') as f:
            f.write(zip_buffer.getvalue())
        
        return jsonify({
            'success': True,
            'download_url': f'/download/{zip_filename}',
            'file_count': len(compressed_images)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>')
def download_file(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        def remove_file():
            try:
                os.remove(file_path)
            except:
                pass
        

        import threading
        threading.Timer(60.0, remove_file).start()  
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name='compressed_images.zip',
            mimetype='application/zip'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/progress/<session_id>')
def get_progress(session_id):
    return jsonify({'progress': 0})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
