from django.db import models
import datetime

class User(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField(default="")
    password_md5 = models.CharField(max_length=32)

    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    about =  models.CharField(max_length=200, null=True)
    site = models.URLField(null=True)

    def __unicode__(self):
        return self.username

class Site(models.Model):
    url=models.URLField(unique=True)

    def __unicode__(self):
        return self.url

class Img(models.Model):
    uploaded_by_user=models.ForeignKey(User)
    src=models.URLField(unique=True)
    site=models.IntegerField(default=0)
    
    def __unicode__(self):
        return self.alt
    
class Category(models.Model):
    name=models.CharField(max_length=100)
    enabled=models.BooleanField(default=True)

    def __unicode__(self):
        return self.name

class Collection(models.Model):
    user=models.ForeignKey(User)
    name=models.CharField(max_length=100)
    category=models.ForeignKey(Category)

    def __unicode__(self):
        return self.name
    
class Pin(models.Model):
    user=models.ForeignKey(User)
    img=models.ForeignKey(Img)
    alt=models.CharField(max_length=100,default='')
    collection=models.IntegerField(default=0)