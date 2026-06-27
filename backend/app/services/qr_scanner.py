import cv2
import numpy as np
from PIL import Image
import io

def decode_qr_image(image_bytes: bytes) -> str:
    """
    Decodes an uploaded QR code image. Uses OpenCV QRCodeDetector by default
    and falls back to pyzbar/PIL if OpenCV fails to locate markers.
    """
    # 1. Convert buffer to OpenCV image matrix
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image format. Could not decode binary stream.")
        
    # 2. Detect & Decode using OpenCV
    detector = cv2.QRCodeDetector()
    decoded_text, _, _ = detector.detectAndDecode(img)
    
    # 3. Fallback check using pyzbar for low-contrast/rotated captures
    if not decoded_text:
        try:
            from pyzbar.pyzbar import decode
            pil_image = Image.open(io.BytesIO(image_bytes))
            decoded_objects = decode(pil_image)
            if decoded_objects:
                decoded_text = decoded_objects[0].data.decode("utf-8")
        except Exception:
            pass
            
    if not decoded_text:
        raise ValueError("No readable QR code signatures detected in this image.")
        
    return decoded_text
