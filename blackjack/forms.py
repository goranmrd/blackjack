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
        # Hiding the form fields 
        widgets = {
            'user': forms.HiddenInput(),
            'money': forms.HiddenInput(),
            'wins': forms.HiddenInput(),
            'losses': forms.HiddenInput(),
            'draws': forms.HiddenInput(),
        }
