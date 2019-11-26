---
layout: post
title: 一个django网站搭建步骤
date: 2019-11-26
categories: blog
tags: [网站,django,python,mariadb]
description: 简单记录了一个django网站的搭建步骤。
---

 # 网站搭建步骤
 -----------

## 安装lamp环境
1、使用yum安装apache mariadb php mod_wsgi
```
yum install httpd mariadb-server php mod_wsgi gcc libffi-devel python-devel openssl-devel mariadb-devel
```
## pip环境设置
2、安装pip
```
wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py
```
4、安装设置pip更新源
```
mkdir ~/.pip
cat > ~/.pip/pip.conf << EOF
[global]
trusted-host=mirrors.aliyun.com
index-url=https://mirrors.aliyun.com/pypi/simple/
EOF
```
## django环境设置
5、安装django、requests、bs4、MySQL-python、 lxml
```
python -m pip install "django<2"
pip install  requests beautifulsoup4 MySQL-python selenium lxml

```
## mariadb数据库设置
6、修改数据库密码
```
mysql -u root
mysql> use mysql;
mysql> UPDATE user SET Password = PASSWORD('newpass') WHERE user = 'root';
mysql> FLUSH PRIVILEGES;
```
7、创建数据库
```
CREATE DATABASE `clog` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci
```
8、初始化数据表
```
python manage.py migrate
```
9、支持phantomjs
```
yum install fontconfig
```