#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw

def create_list_icon(selected=False, size=81):
    """创建列表图标"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    color = (255, 213, 79, 255) if selected else (153, 153, 153, 255)
    
    # 绘制列表线条
    line_height = size // 10
    padding = size // 6
    start_y = padding
    for i in range(3):
        y = start_y + i * (line_height + size // 8)
        draw.rectangle([padding, y, size - padding, y + line_height], fill=color)
        
        # 小圆点
        dot_x = padding // 2
        dot_y = y + line_height // 2
        draw.ellipse([dot_x - 4, dot_y - 4, dot_x + 4, dot_y + 4], fill=color)
    
    return img

def create_chart_icon(selected=False, size=81):
    """创建图表图标"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    color = (255, 213, 79, 255) if selected else (153, 153, 153, 255)
    
    padding = size // 6
    bar_width = (size - 2 * padding) // 4 - 4
    start_x = padding
    
    heights = [0.3, 0.6, 0.8, 0.5]
    for i, h in enumerate(heights):
        bar_x = start_x + i * (bar_width + 8)
        bar_height = int(h * (size - 2 * padding))
        bar_y = size - padding - bar_height
        draw.rectangle([bar_x, bar_y, bar_x + bar_width, size - padding], fill=color)
    
    return img

def create_add_icon(selected=False, size=81):
    """创建添加图标"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    color = (255, 213, 79, 255) if selected else (153, 153, 153, 255)
    
    center = size // 2
    line_width = size // 10
    line_length = size // 3
    
    # 垂直线
    draw.rectangle([center - line_width // 2, center - line_length, 
                   center + line_width // 2, center + line_length], fill=color)
    
    # 水平线
    draw.rectangle([center - line_length, center - line_width // 2, 
                   center + line_length, center + line_width // 2], fill=color)
    
    return img

def create_user_icon(selected=False, size=81):
    """创建用户图标"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    color = (255, 213, 79, 255) if selected else (153, 153, 153, 255)
    
    center = size // 2
    head_radius = size // 5
    body_width = size // 2
    body_height = size // 3
    
    # 头部
    draw.ellipse([center - head_radius, size // 4, 
                 center + head_radius, size // 4 + 2 * head_radius], fill=color)
    
    # 身体
    draw.ellipse([center - body_width // 2, size // 2, 
                 center + body_width // 2, size // 2 + body_height], fill=color)
    
    return img

def main():
    icons_dir = '/Users/shisfish/Documents/trae-workspace/miaobill/miaobill/icons'
    
    # 创建图标
    icons = [
        ('list', create_list_icon),
        ('chart', create_chart_icon),
        ('add', create_add_icon),
        ('user', create_user_icon)
    ]
    
    for name, create_func in icons:
        # 普通状态
        img = create_func(selected=False)
        img.save(f'{icons_dir}/{name}.png', 'PNG')
        print(f'Created {name}.png')
        
        # 选中状态
        img_selected = create_func(selected=True)
        img_selected.save(f'{icons_dir}/{name}-selected.png', 'PNG')
        print(f'Created {name}-selected.png')
    
    print('All icons created successfully!')

if __name__ == '__main__':
    main()
