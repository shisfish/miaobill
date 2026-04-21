#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
from PIL import Image, ImageDraw
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM

def convert_svg_to_png(svg_file, png_file, size=81):
    """Convert SVG file to PNG file"""
    try:
        # 使用 svglib 转换 SVG
        drawing = svg2rlg(svg_file)
        
        # 渲染到内存
        img_data = renderPM.drawToString(drawing, fmt='PNG', dpi=300)
        
        # 使用 PIL 打开并调整大小
        from io import BytesIO
        img = Image.open(BytesIO(img_data))
        
        # 调整大小，保持比例 - 兼容不同版本的PIL
        try:
            resample_method = Image.Resampling.LANCZOS
        except AttributeError:
            resample_method = Image.LANCZOS
        img.thumbnail((size, size), resample_method)
        
        # 创建透明背景
        background = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # 居中放置图标
        paste_x = (size - img.width) // 2
        paste_y = (size - img.height) // 2
        background.paste(img, (paste_x, paste_y), img)
        
        # 保存 PNG
        background.save(png_file, 'PNG')
        print(f"Converted: {svg_file} -> {png_file}")
        return True
    except Exception as e:
        print(f"Error converting {svg_file}: {e}")
        
        # 如果 svglib 失败，尝试手动创建简单的 PNG
        print("Falling back to simple PNG creation...")
        create_simple_png(png_file, size)
        return False

def create_simple_png(png_file, size=81):
    """Create a simple placeholder PNG"""
    # 创建透明背景
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    
    # 简单的图标 - 使用文件名来决定颜色
    if 'list' in png_file:
        color = (153, 153, 153, 255)
    elif 'chart' in png_file:
        color = (153, 153, 153, 255)
    elif 'add' in png_file:
        color = (153, 153, 153, 255)
    elif 'user' in png_file:
        color = (153, 153, 153, 255)
    else:
        color = (153, 153, 153, 255)
    
    # 如果是选中状态，使用黄色
    if 'selected' in png_file:
        color = (255, 213, 79, 255)
    
    # 绘制一个简单的圆形
    draw = ImageDraw.Draw(img)
    draw.ellipse([size*0.15, size*0.15, size*0.85, size*0.85], outline=color, width=3)
    
    img.save(png_file, 'PNG')
    print(f"Created simple PNG: {png_file}")

def main():
    icons_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 要转换的文件
    svg_files = [
        'list.svg', 'list-selected.svg',
        'chart.svg', 'chart-selected.svg',
        'add.svg', 'add-selected.svg',
        'user.svg', 'user-selected.svg'
    ]
    
    for svg_file in svg_files:
        svg_path = os.path.join(icons_dir, svg_file)
        if os.path.exists(svg_path):
            png_file = svg_file.replace('.svg', '.png')
            png_path = os.path.join(icons_dir, png_file)
            convert_svg_to_png(svg_path, png_path, size=81)
        else:
            print(f"Warning: {svg_file} not found")

if __name__ == '__main__':
    main()
