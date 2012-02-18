from django.http import HttpResponseRedirect, HttpResponse
from django.template import RequestContext
from django.shortcuts import get_object_or_404, render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from tools.tools import *
from random import randint
from django.views.generic import DetailView, ListView
#from django.core.validators import email_re, slug_re

import os, shutil, md5, csv, re, Image, json, StringIO, time
from pinme.main.models import *
from pinme.main.forms import *

SEARCH_IMG_SRC=re.compile("images_src_(\d+)")
SEARCH_IMG_ALT=re.compile("images_alt_(\d+)")

UPLOADS_TMP_FOLDER="/home/mona/git/pinme/pinme/static/uploads_tmp/"
UPLOADS_FOLDER="/home/mona/git/pinme/pinme/static/uploads/"

SALT="SD7Kgf09FGsf$90g892TR03+Esd_f[0oLGMSBKIR"

@csrf_exempt
def requires_login(view):
    def new_view(request, *args, **kwargs):
        if request.session.get("user", None)==None:
            return HttpResponseRedirect('/login/')
        return view(request, *args, **kwargs)
    return new_view

def user_register(request):
    error_message_list=None
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            cd=form.cleaned_data
            try:
                user = User(username=cd['username'],email=cd['email'], password_md5=md5.new(cd['password']+SALT).hexdigest(),)
                user.save()
            except:
                error_message_list=["Error creating new user."]
            else:
                request.session["user_id"]=user.pk
                return HttpResponseRedirect('/login/')
        else:
                error_message_list=["Incorrect values."]
    else:
        form = RegisterForm()
    return render_to_response('register.html',
                                {'form':form, 'error_message_list':error_message_list},
                                context_instance=RequestContext(request))    

def user_login(request):
    error_message_list=None
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd=form.cleaned_data
            try:
                user = User.objects.get(username=cd['username'], password_md5=md5.new(cd['password']+SALT).hexdigest(),)
            except:
                error_message_list=["Username and password do NOT match. Your ip address and this attempt has been logged."]
            else:
                request.session["user"]=user
                return HttpResponseRedirect('/')
        else:
                error_message_list=["Login and password don't match."]
    else:
        form = LoginForm()
    return render_to_response('login.html',
                                {'form':form, 'error_message_list':error_message_list},
                                context_instance=RequestContext(request))

def user_logout(request):
    if request.session.has_key("user"):
        del request.session["user"]
    return HttpResponseRedirect('/login/')


@csrf_exempt
def upload_selected_images(request):    
    img_dict=dict()
    output=""
    from_url=""
    for key,value in request.POST.iteritems():
        if key=="from_url":
            from_url=value
        else:
            matches=SEARCH_IMG_SRC.search(key)
            if matches!=None:
                img_num=matches.group(1)
                an_img=img_dict.get(img_num,{'src':'','alt':''})
                an_img['src']=value
                img_dict[img_num]=an_img                
            else:
                matches=SEARCH_IMG_ALT.search(key)
                if matches!=None:
                    img_num=matches.group(1)
                    an_img=img_dict.get(img_num,{'src':'','alt':''})
                    an_img['alt']=value
                    img_dict[img_num]=an_img                

#        output=output+key +"---"+value+"<br />"
    form = SaveSeclectedImagesForm(request.session['user'])
    return render_to_response('upload_selected_images.html',
                                {'form':form, 'output':output, 'from_url':from_url, 'img_dict':img_dict},
                                context_instance=RequestContext(request))    

def save_selected_image(request):
    user=request.session.get("user", None)
    if request.method == 'POST':
        form = SaveSeclectedImagesForm(user, request.POST)
        if form.is_valid():
            cd=form.cleaned_data
            site=Site(url=cd['url'])
#            img=Img.objects.get(src=cd['src'])
            try:
                img=Img.objects.get(src=cd['src'])
            except:
                #No image with this src found - Need to download
                tmp_file_path=UPLOADS_TMP_FOLDER+str(user.id)+'_'+str(randint(0, 999999999999))
                #fetch image here
                download_file(src=cd['src'], output_file_path=tmp_file_path)
                try:
                    site.save()
                except IntegrityError:
                    site=get_object_or_404(Site,url=cd['url'])
                
                img=Img(uploaded_by_user=user,src=cd['src'],site=site.id)
                img.save()
                shutil.move(tmp_file_path,UPLOADS_FOLDER+str(img.id))
                    
            pin=Pin(user=user, alt=cd['alt'],img=img)
            pin.save()
#            time.sleep(3)
            return HttpResponse('ok')
    else:
        return HttpResponse('Unsupported method')
    
def btn_js(request):
    server_url=request.build_absolute_uri('/')
    return render_to_response('js/btn.js',
                                {'server_url':server_url},
                                mimetype="application/javascript",
                                context_instance=RequestContext(request))    

def show_image(request, img_id):
#    img=get_object_or_404(Img,pk=img_id)
    try:
        image_data = open(UPLOADS_FOLDER+str(img_id), "rb").read()
    except:
        return HttpResponseRedirect('/static/images/noimage.png')
    else:
        return HttpResponse(image_data, mimetype="image/png")
    
def collection_pin_list(request):
    pin_list=Pin.objects.filter(user=request.session.get("user", None)).order_by('id')
    return render_to_response('collection_pin_list.html',
                                {'pin_list':pin_list},
                                context_instance=RequestContext(request))    

def collection_list(request):
    collection_list=Collection.objects.filter(user=request.session["user"]).order_by('id')
    return render_to_response('collection_list.html',
                                {'collection_list':collection_list},
                                context_instance=RequestContext(request))

def collection_create(request):
    error_message_list=None
    if request.method == 'POST':
        form = CollectionEditForm(request.POST)
        if form.is_valid():
            cd=form.cleaned_data
            collection = Collection(user=request.session['user'],name=cd['name'], category=cd['category'],)
            collection.save()
            return HttpResponseRedirect('/collection_list/')
        else:
                error_message_list=["Incorrect values."]
    else:
        form = CollectionEditForm()
    return render_to_response('collection_edit.html',
                                {'form':form, 'error_message_list':error_message_list},
                                context_instance=RequestContext(request))

def collection_edit(request, collection_id):
    collection=get_object_or_404(Collection,pk=collection_id,user=request.session["user"])
    error_message_list=None
    if request.method == 'POST':
        form = CollectionEditForm(request.POST)
        if form.is_valid():
            cd=form.cleaned_data
            collection.name=cd['name']
            collection.category=cd['category']
            collection.save()
            return HttpResponseRedirect('/collection_list/')
        else:
                error_message_list=["Incorrect values."]
    else:
        form = CollectionEditForm(initial={
                                    'name':collection.name,
                                    'category':collection.category
                                })
    return render_to_response('collection_edit.html',
                                {'form':form, 'error_message_list':error_message_list},
                                context_instance=RequestContext(request))

def profile_edit(request):
    user=request.session["user"]
    error_message_list=None
    if request.method == 'POST':
        form = ProfileEditForm(request.POST)
        if form.is_valid():
            cd=form.cleaned_data
            user.email=cd['email']
            user.first_name=cd['first_name']
            user.last_name=cd['last_name']
            user.username=cd['username']
            user.about=cd['about']
            user.site=cd['site']
            user.save()
            request.session["user"]=user
            return HttpResponseRedirect('/collection_list/')
        else:
                error_message_list=["Incorrect values."]
    else:
        form = ProfileEditForm(initial={
                                    'email':user.email,
                                    'first_name':user.first_name,
                                    'last_name':user.last_name,
                                    'username':user.username,
                                    'about':user.about,
                                    'site':user.site
                                })
    return render_to_response('profile_edit.html',
                                {'form':form, 'error_message_list':error_message_list},
                                context_instance=RequestContext(request))
