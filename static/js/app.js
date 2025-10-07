class ImageCompressor {
    constructor() {
        this.selectedFiles = [];
        this.currentSessionId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupDragAndDrop();
    }

    bindEvents() {

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });


        document.getElementById('qualitySlider').addEventListener('input', (e) => {
            document.getElementById('qualityValue').textContent = e.target.value;
        });

        document.getElementById('compressBtn').addEventListener('click', () => {
            this.compressImages();
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadFiles();
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });

        document.getElementById('retryBtn').addEventListener('click', () => {
            this.compressImages();
        });


        document.querySelector('.browse-text').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
            }, false);
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFileSelect(files);
        }, false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFileSelect(files) {

        const validFiles = Array.from(files).filter(file => {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
            return validTypes.includes(file.type);
        });

        if (validFiles.length === 0) {
            this.showError('Please select valid image files (JPG, PNG, GIF, BMP)');
            return;
        }

        if (validFiles.length !== files.length) {
            this.showError('Some files were skipped. Only image files are supported.');
        }

        this.selectedFiles = validFiles;
        this.displaySelectedFiles();
        this.showControls();
    }

    displaySelectedFiles() {
        const filesGrid = document.getElementById('filesGrid');
        const totalFiles = document.getElementById('totalFiles');
        const totalSize = document.getElementById('totalSize');
        

        filesGrid.innerHTML = '';
        
        let totalSizeBytes = 0;
        
        this.selectedFiles.forEach((file, index) => {
            totalSizeBytes += file.size;
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item fade-in';
            fileItem.innerHTML = `
                <div class="file-icon">
                    <i class="fas fa-file-image"></i>
                </div>
                <div class="file-name" title="${file.name}">${this.truncateFileName(file.name)}</div>
                <div class="file-size">${this.formatFileSize(file.size)}</div>
            `;
            
            filesGrid.appendChild(fileItem);
        });
        
        totalFiles.textContent = this.selectedFiles.length;
        totalSize.textContent = this.formatFileSize(totalSizeBytes);
        
        document.getElementById('filesPreview').style.display = 'block';
    }

    showControls() {
        document.getElementById('controlsSection').style.display = 'block';
    }

    async compressImages() {
        if (this.selectedFiles.length === 0) {
            this.showError('Please select files first');
            return;
        }

        this.hideError();
        this.hideResult();
        this.showProgress();

        const quality = document.getElementById('qualitySlider').value;
        const formData = new FormData();
        

        this.selectedFiles.forEach(file => {
            formData.append('files', file);
        });
        
        formData.append('quality', quality);

        try {

            this.updateProgress(10);
            
            const response = await fetch('/compress', {
                method: 'POST',
                body: formData
            });

            this.updateProgress(90);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Compression failed');
            }

            const result = await response.json();
            
            this.updateProgress(100);
            
            setTimeout(() => {
                this.showResult(result, quality);
            }, 500);

        } catch (error) {
            console.error('Compression error:', error);
            this.showError(error.message || 'An error occurred during compression');
        }
    }

    updateProgress(percentage) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
    }

    showProgress() {
        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'none';
        this.updateProgress(0);
    }

    hideProgress() {
        document.getElementById('progressSection').style.display = 'none';
    }

    showResult(result, quality) {
        this.hideProgress();
        
        document.getElementById('processedFiles').textContent = result.file_count;
        document.getElementById('finalQuality').textContent = `${quality}%`;
        

        this.downloadUrl = result.download_url;
        
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('resultSection').classList.add('fade-in');
    }

    hideResult() {
        document.getElementById('resultSection').style.display = 'none';
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorSection').style.display = 'block';
        document.getElementById('errorSection').classList.add('fade-in');
        this.hideProgress();
    }

    hideError() {
        document.getElementById('errorSection').style.display = 'none';
    }

    downloadFiles() {
        if (this.downloadUrl) {

            const link = document.createElement('a');
            link.href = this.downloadUrl;
            link.download = 'compressed_images.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    restart() {

        this.selectedFiles = [];
        this.currentSessionId = null;
        this.downloadUrl = null;
        

        document.getElementById('fileInput').value = '';
        document.getElementById('qualitySlider').value = 80;
        document.getElementById('qualityValue').textContent = '80';
        

        document.getElementById('filesPreview').style.display = 'none';
        document.getElementById('controlsSection').style.display = 'none';
        document.getElementById('progressSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'none';
        

        document.getElementById('uploadSection').style.display = 'block';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    truncateFileName(fileName, maxLength = 20) {
        if (fileName.length <= maxLength) return fileName;
        
        const extension = fileName.split('.').pop();
        const name = fileName.substring(0, fileName.lastIndexOf('.'));
        const truncatedName = name.substring(0, maxLength - extension.length - 4);
        
        return `${truncatedName}...${extension}`;
    }
}


function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'error' ? '#ef4444' : '#10b981',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}


document.addEventListener('DOMContentLoaded', () => {
    new ImageCompressor();
});


window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showNotification('An unexpected error occurred', 'error');
});


window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('An unexpected error occurred', 'error');
});
