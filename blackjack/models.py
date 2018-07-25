from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Create auth user model
class User(User):

    def __str__(self):
        return self.username

# Extending user model with OneToOneField relation
class Game(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    money = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    
    # Method to show users game info in admin panel
    def __str__(self):
        return "{}'s Game Info".format(self.user)