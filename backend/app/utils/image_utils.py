import os
from typing import Optional
from fastapi import HTTPException, UploadFile
import uuid
from PIL import Image
import io

class ImageManager:
    def __init__(self, base_path: str = "static/images"):
        self.base_path = base_path
        self.product_path = os.path.join(base_path, "products")
        self.allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
        self.max_file_size = 5 * 1024 * 1024  # 5MB
        
        # 确保目录存在
        os.makedirs(self.product_path, exist_ok=True)
    
    def get_image_url(self, image_filename: Optional[str], base_url: str = "http://localhost:8000") -> str:
        """获取图片的完整URL"""
        if not image_filename:
            return f"{base_url}/static/images/products/placeholder.svg"
        
        # 如果是完整URL，直接返回
        if image_filename.startswith(('http://', 'https://')):
            return image_filename
        
        # 构建完整的图片URL
        return f"{base_url}/static/images/products/{image_filename}"
    
    def validate_image(self, file: UploadFile) -> bool:
        """验证图片文件"""
        # 检查文件扩展名
        file_ext = os.path.splitext(file.filename.lower())[1] if file.filename else ''
        if file_ext not in self.allowed_extensions:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_ext}")
        
        # 检查文件大小
        if file.size and file.size > self.max_file_size:
            raise HTTPException(status_code=400, detail=f"File too large, maximum size: {self.max_file_size // 1024 // 1024}MB")
        
        return True
    
    async def save_product_image(self, file: UploadFile) -> str:
        """保存产品图片"""
        self.validate_image(file)
        
        # 生成唯一文件名
        file_ext = os.path.splitext(file.filename.lower())[1] if file.filename else '.jpg'
        filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(self.product_path, filename)
        
        try:
            # 读取并处理图片
            content = await file.read()
            
            # 使用PIL处理图片（可选：调整大小、压缩等）
            image = Image.open(io.BytesIO(content))
            
            # 转换为RGB（如果是RGBA）
            if image.mode == 'RGBA':
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[-1])
                image = background
            
            # 限制图片尺寸
            max_size = (800, 600)
            image.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # 保存图片
            image.save(file_path, format='JPEG', quality=85, optimize=True)
            
            return filename
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
    
    def delete_product_image(self, filename: str) -> bool:
        """删除产品图片"""
        if not filename or filename == 'placeholder.svg':
            return True
        
        file_path = os.path.join(self.product_path, filename)
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
            return True
        except Exception:
            return False
    
    def image_exists(self, filename: str) -> bool:
        """检查图片是否存在"""
        if not filename:
            return False
        file_path = os.path.join(self.product_path, filename)
        return os.path.exists(file_path)

# 全局图片管理器实例
image_manager = ImageManager()