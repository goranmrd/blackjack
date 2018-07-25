from .models import User, Game
from django.contrib.auth.forms import UserCreationForm
from django import forms

# Sign Up form
class UserCreateForm(UserCreationForm):
     
    class Meta:
        model = User
        fields = ('username','email','password1','password2',)

# Game update form
class GameUpdateForm(forms.ModelForm):
    class Meta:
        fields = ('user','money','wins','losses', 'draws')
        model = Game
        # I made user field read only just for you don't mess the database while testing the form we will remove it later
        widgets = {
            'user': forms.TextInput(attrs={'readonly': 'readonly'}),
        }