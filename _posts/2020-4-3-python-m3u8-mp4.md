---
layout: post
title: python解析下载m3u8
date: 2020-4-3
categories: python
tags: [python,m3u8]
description: 这篇文章介绍了使用m3u8库解析m3u8文件并通过迅雷进行合并和下载。
---

# python解析下载m3u8

-----------
[toc]
## 安装m3u8
使用pip安装m3u8
[主页地址https://pypi.org/project/m3u8/](https://pypi.org/project/m3u8/)
```python
pip install m3u8
```
## 解析m3u8文件
此处以《冰雪奇缘2》为示例
```python
import m3u8
url='https://meinv.jingyu-zuida.com/20200212/12629_bf2d8745/1000k/hls/'
m3u8_obj = m3u8.load(url+'index.m3u8')
f=open('d:/temp/shortname.txt','w')
g=open('d:/temp/longname.txt','w')
for i in m3u8_obj.segments:
   surl=str(i).split('\n')[-1]
   lurl=url+surl
   f.write('file \''+surl+'\'\n')
   g.write(lurl+'\n')
f.close()
g.close()
```
## 下载相关ts文件
使用迅雷或者其他工具下载longname.txt中的所有的ts文件
## 合并视频
1. 将shortname.txt文件放入文件下载目录
2. 使用ffmpeg将所有的视频文件合并
```bash
 ffmpeg -f concat -i shortname.txt -c copy output.mp4
```
