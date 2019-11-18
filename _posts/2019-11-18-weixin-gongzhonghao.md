---
layout: post
title: 微信公众平台架设
date: 2015-09-15
categories: blog
tags: [微信,公众号]
description: 这篇文章详细介绍了微信公众号平台的架设，对微信有兴趣的朋友可以看看。

---

# 微信公众平台架设

-----------

[TOC]

## MySQL 安装
[安装文档](http://dev.mysql.com/doc/refman/5.7/en/linux-installation-yum-repo.html)

1. 下载yum源
```python
wget http://dev.mysql.com/get/mysql57-community-release-el7-8.noarch.rpm
https://dev.mysql.com/get/mysql57-community-release-el6-9.noarch.rpm
```
2. 安装yum源
```python
sudo yum localinstall mysql57-community-release-el7-8.noarch.rpm
sudo yum localinstall mysql57-community-release-el6-9.noarch.rpm
```
3. 安装MySQL数据库
```python
sudo yum install mysql-community-server
```
4. 启用innodb引擎
```python
innodb_file_per_table=1
innodb_data_home_dir = /usr/local/mysql/data
innodb_data_file_path = ibdata1:10M:autoextend
```
5. 启动关闭MySQL数据库
```python
service mysqld start
service mysqld stop
service mysqld status
```
5. 修改默认密码
```python
[root@i-6vajfr1s ~]# grep 'temporary password' /var/log/mysqld.log
2016-08-08T05:22:49.353113Z 1 [Note] A temporary password is generated for root@localhost: V>%rf.gle7ke

mysql -uroot -p

mysql> aLTER USER 'root'@'localhost' IDENTIFIED BY 'dgvtG@ng6';
```
6. 安装python 扩展
```python
yum install MySQL-python
```
7. 创建wechat数据库
```python
mysql>CREATE DATABASE wechat
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;
```
8. 创建普通账号
```python
useradd -m bsbforever
passwd bsbforever
```
## Django服务器配置
1. 安装Django服务器
```python
pip install django
```
2. 创建 project和app
```python
#mkdir  /root/wechat
cd /home/bsbforever
django-admin startproject  mysite
cd  /home/bsbforever/mysite
python manage.py startapp wechat
```

3. setting文件配置
```python
vim mysite/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'wechat',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'wechat',
        'USER': 'root',
        'PASSWORD': 'dgvtG@ng3',
        'HOST': 'localhost',
        'PORT': '',
        'OPTIONS': {
            'read_default_file': '/etc/my.cnf',
        },
    }
}

STATIC_URL = '/static/'
STATIC_ROOT='/static/static/'

TIME_ZONE = 'Asia/Shanghai'

```
4. 同步数据库文件
```python
python manage.py migrate
```
5. 创建django admin权限
```python
python manage.py createsuperuser
```
6. url文件配置
```python
vim mysites/urls.py

上
~      
```
```python
vim wechat/url.py

from django.conf.urls import  url, include
from wechat import views


urlpatterns = [
    url(r'^check$',views.check, name='check'),
]
```
7. 建立templates目录
```python
mkdir wechat/templates
```
8.收集静态文件
```python
python manage.py collectstatic
```
-------

## Djngo生产环境部署
1. 安装nginx
```python
sudo yum install epel-release
sudo yum install python-devel nginx
```
2. 安装supervisor
```python
sudo pip install supervisor
```
3. 关闭iptables和selinux
4. 安装uwsgi
```python
sudo pip install uwsgi
```
5. 使用uwsgi启动web服务
```python
uwsgi --http :80 --chdir /root/wechat/mysite --static-map /static=/static/static/ --module mysite.wsgi &
```


## Django view 设置
1. 安装必要的包
```python
yum install libxml2*
yum install libxslt*
yum install python-dev*
pip install lxml
```
2. view的内容
```python
#coding=utf-8
import hashlib
import time
from parse import *
from lxml import etree
from django.shortcuts import render
from django.utils.encoding import smart_str
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpRequest
from django import template
from django.http import HttpResponseRedirect
from django.http import HttpResponse
# Create your views here.
WEIXIN_TOKEN='bsbforever'

@csrf_exempt
def  check(request):
    if request.method == "GET":
        signature = request.GET.get("signature", None)
        timestamp = request.GET.get("timestamp", None)
        nonce = request.GET.get("nonce", None)
        echostr = request.GET.get("echostr", None)
        token = WEIXIN_TOKEN
        tmp_list = [token, timestamp, nonce]
        tmp_list.sort()
        tmp_str = "%s%s%s" % tuple(tmp_list)
        tmp_str = hashlib.sha1(tmp_str).hexdigest()
        if tmp_str == signature:
            return HttpResponse(echostr)
        else:
            return HttpResponse("Please Add weixin zhaibibei!")
    else:
        xml_str=request.body.decode('utf-8')
        xml = etree.fromstring(xml_str)
        messagetype = xml.find('MsgType').text
        if messagetype=='text':
            dic=parse_message(xml)
            if dic['Content']=='time'or dic['Content']=='?':
                dic['Content']=time.ctime()
                return render_to_response('reply_message.html',dic)
            else:
                return render_to_response('reply_message.html',dic)
        elif messagetype=='image':
            dic=parse_image(xml)
            return render_to_response('reply_image.html',dic)
        elif messagetype=='voice':
            dic=parse_voice(xml)
            return render_to_response('reply_voice.html',dic)
```

3. parse.py 内容
```python
def parse_message(xml):
    tousername = xml.find('ToUserName').text
    fromusername = xml.find('FromUserName').text
    createtime = xml.find('CreateTime').text
    msgtype = xml.find('MsgType').text
    content = xml.find('Content').text
    msgId = xml.find('MsgId').text
    ToUserName=fromusername
    FromUserName=tousername
    CreateTime=createtime
    MsgType=msgtype
    Content=content
    dic ={'ToUserName':ToUserName,'FromUserName':FromUserName,'CreateTime':CreateTime,'MsgType':MsgType,'Content':Content}
    return dic

def parse_image(xml):
    tousername = xml.find('ToUserName').text
    fromusername = xml.find('FromUserName').text
    createtime = xml.find('CreateTime').text
    msgtype = xml.find('MsgType').text
    picurl = xml.find('PicUrl').text
    mediaid = xml.find('MediaId').text
    msgid = xml.find('MsgId').text
    ToUserName=fromusername
    FromUserName=tousername
    CreateTime=createtime
    MsgType=msgtype
    PicUrl=picurl
    MediaId=mediaid
    dic ={'ToUserName':ToUserName,'FromUserName':FromUserName,'CreateTime':CreateTime,'MsgType':MsgType,'PicUrl':PicUrl,'MediaId':MediaId}
    return dic
def parse_voice(xml):
    tousername = xml.find('ToUserName').text
    fromusername = xml.find('FromUserName').text
    createtime = xml.find('CreateTime').text
    msgtype = xml.find('MsgType').text
    mediaid = xml.find('MediaId').text
    aformat = xml.find('Format').text
    msgid = xml.find('MsgId').text
    ToUserName=fromusername
    FromUserName=tousername
    CreateTime=createtime
    MsgType=msgtype
    Format=aformat
    MediaId=mediaid
    dic ={'ToUserName':ToUserName,'FromUserName':FromUserName,'CreateTime':CreateTime,'MsgType':MsgType,'Format':Format,'MediaId':MediaId}
    return dic
```
4.模板文件内容
```python
reply_image.html

<xml>
    <ToUserName><![CDATA[{{ToUserName}}]]></ToUserName>
    <FromUserName><![CDATA[{{FromUserName}}]]></FromUserName>
    <CreateTime>{{CreateTime}}</CreateTime>
    <MsgType><![CDATA[{{MsgType}}]]></MsgType>
    <Image>
        <MediaId><![CDATA[{{MediaId}}]]></MediaId>
    </Image>
</xml>
```
```python
[root@i-6vajfr1s templates]# vim reply_message.html 

<xml>
    <ToUserName><![CDATA[{{ToUserName}}]]></ToUserName>
    <FromUserName><![CDATA[{{FromUserName}}]]></FromUserName>
    <CreateTime>{{CreateTime}}</CreateTime>
    <MsgType><![CDATA[{{MsgType}}]]></MsgType>
    <Content><![CDATA[{{Content}}]]></Content>
</xml>
```
```python
[root@i-6vajfr1s templates]# vim reply_music.html 

<xml>
    <ToUserName><![CDATA[{{ToUserName}}]]></ToUserName>
    <FromUserName><![CDATA[{{FromUserName}}]]></FromUserName>
    <CreateTime>{{CreateTime}}</CreateTime>
    <MsgType><![CDATA[{{MsgType}}]]></MsgType>
    <Music>
        <Title><![CDATA[{{Title}}]]></Title>
        <Description><![CDATA[{{Description}}]]></Description>
        <MusicUrl><![CDATA[{{MusicUrl}}]]></MusicUrl>
        <HQMusicUrl><![CDATA[HQMusicUrl]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[{{ThumbMediaId}}]]></ThumbMediaId>
    </Music>
</xml>
```
```python
[root@i-6vajfr1s templates]# vim reply_news.html 

<xml>
    <ToUserName><![CDATA[{{ToUserName}}]]></ToUserName>
    <FromUserName><![CDATA[{{FromUserName}}]]></FromUserName>
    <CreateTime>{{CreateTime}}</CreateTime>
    <MsgType><![CDATA[{{MsgType}}]]></MsgType>
    <ArticleCount>2</ArticleCount>
    <Articles>
        <item>
            <Title><![CDATA[title1]]></Title>
            <Description><![CDATA[description1]]></Description>
            <PicUrl><![CDATA[picurl]]></PicUrl>
            <Url><![CDATA[url]]></Url>
        </item>
        <item>
            <Title><![CDATA[title]]></Title>
            <Description><![CDATA[description]]></Description>
            <PicUrl><![CDATA[picurl]]></PicUrl>
            <Url><![CDATA[url]]></Url>
        </item>
    </Articles>
</xml>
```
```python
[root@i-6vajfr1s templates]# vim reply_video.html 

<xml>
    <ToUserName><![CDATA[{{ToUserName}}]]></ToUserName>
    <FromUserName><![CDATA[{{FromUserName}}]]></FromUserName>
    <CreateTime>{{CreateTime}}</CreateTime>
    <MsgType><![CDATA[{{MsgType}}]]></MsgType>
    <Video>
        <MediaId><![CDATA[{{MediaId}}]]></MediaId>
        <Title><![CDATA[{{Title}}]]></Title>
        <Description><![CDATA[{{Description}}]]></Description>
</Video>
</xml>
```
```python
[root@i-6vajfr1s templates]# vim reply_voice.html 

<xml>
    <ToUserName><![CDATA[{{ToUserName}}]]></ToUserName>
    <FromUserName><![CDATA[{{FromUserName}}]]></FromUserName>
    <CreateTime>{{CreateTime}}</CreateTime>
    <MsgType><![CDATA[{{MsgType}}]]></MsgType>
    <Voice>
        <MediaId><![CDATA[{{MediaId}}]]></MediaId>
    </Voice>
</xml>
```

