from django.conf.urls.defaults import patterns, include, url
from django.views.generic import DetailView, ListView
from django.views.generic.simple import direct_to_template
from pinme.main.models import *
from pinme.main.views import *
    
urlpatterns = patterns('',
    url(r'^register/$', user_register, name='user_register'),
    url(r'^login/$', user_login, name='user_login'),
    url(r'^js/btn.js$', btn_js, name='btn_js'),
    (r'^btn_install/$', direct_to_template, {'template': 'install_pinbtn.html'}),
    url(r'^logout/$', requires_login(user_logout), name='logout'),
    url(r'^settings/$', requires_login(profile_edit), name='profile_edit'),
    
    url(r'^collection_list/$', requires_login(collection_list), name='collection_list'),

    url(r'^upload_selected_images/$', requires_login(upload_selected_images), name='upload_selected_images'),
    url(r'^save_selected_image/$', requires_login(save_selected_image), name='save_selected_image'),
                       
    (r'^$',direct_to_template, {'template': 'pin_list.html'}),
    url(r'^collection_pin_list/$', requires_login(collection_pin_list), name='collection_pin_list'),
    
    url(r'^collection_create/$', requires_login(collection_create), name='collection_create'),
    url(r'^collection_edit/(?P<collection_id>\d+)/$', requires_login(collection_edit), name='collection_edit'),

    url(r'^show_image/(?P<img_id>\d+)/$', show_image, name='show_image'),
)
