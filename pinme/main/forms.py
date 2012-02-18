from django import forms
from pinme.main.models import *

import re

class SaveSeclectedImagesForm(forms.Form):
    def __init__(self, user=None, *args, **kwargs):
        super(SaveSeclectedImagesForm, self).__init__(*args, **kwargs)
        self.fields['collection'] = forms.ModelChoiceField(required=False, queryset=Collection.objects.filter(user=user))

    url = forms.URLField()
    src = forms.URLField()
    alt = forms.CharField(max_length=100, required=False)

class RegisterForm(forms.Form):
    username = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'size':'50'}))
    email = forms.EmailField()
    password = forms.CharField(max_length=20, widget=forms.PasswordInput(attrs={'size':'50'}, render_value=True))
    password_repeat = forms.CharField(max_length=20, widget=forms.PasswordInput(attrs={'size':'50'}, render_value=True))
    
    def clean_name(self):
        username=self.cleaned_data['username']
        if re.search(r'[^a-zA-Z0-9_\-]',username):
            raise forms.ValidationError("User name should contain only a-z, A-Z, 0-9, _ - symbols.")    
        try:
            user = User.objects.get(username=username)
        except:
            pass
        else:
            raise forms.ValidationError("This user name has already been taken. Please try another one.")
        return username

    def clean_password_repeat(self):
        password=self.cleaned_data['password']
        password_repeat=self.cleaned_data['password_repeat']
        if password!=password_repeat:
            raise forms.ValidationError("Passwords don't match. Please check that you enter the same password twice.")    
        return password

class ProfileEditForm(forms.Form):
    email = forms.EmailField()
    first_name = forms.CharField(max_length=100, required=False, widget=forms.TextInput(attrs={'size':'50'}))
    last_name = forms.CharField(max_length=100, required=False, widget=forms.TextInput(attrs={'size':'50'}))
    username = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'size':'50'}))
    about = forms.CharField(max_length=100, required=False, widget=forms.Textarea)
    site = forms.URLField(required=False)
    
    def clean_name(self):
        username=self.cleaned_data['username']
        if re.search(r'[^a-zA-Z0-9_\-]',username):
            raise forms.ValidationError("User name should contain only a-z, A-Z, 0-9, _ - symbols.")    
        try:
            user = User.objects.get(username=username)
        except:
            pass
        else:
            raise forms.ValidationError("This user name has already been taken. Please try another one.")
        return username

    def clean_first_name(self):
        first_name=self.cleaned_data['first_name']
        if re.search(r'[^a-zA-Z\-]',first_name):
            raise forms.ValidationError("First name should contain only a-z, A-Z, - symbols.")    
        return first_name

    def clean_last_name(self):
        last_name=self.cleaned_data['last_name']
        if re.search(r'[^a-zA-Z\-]',last_name):
            raise forms.ValidationError("Last name should contain only a-z, A-Z, - symbols.")    
        return last_name


class LoginForm(forms.Form):
    username = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'size':'50'}))
    password = forms.CharField(max_length=20, widget=forms.PasswordInput(attrs={'size':'50'}, render_value=True))

class CollectionEditForm(forms.Form):
    name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'size':'50'}))
    category = forms.ModelChoiceField(queryset=Category.objects.all())    