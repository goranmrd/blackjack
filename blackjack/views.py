from django.shortcuts import render, redirect
from .models import Game, User
from django.contrib.auth.decorators import login_required
from .forms import UserCreateForm, GameUpdateForm
from django.contrib import messages
# Create your views here.


# Visitor needs to be logged in to see this page
@login_required
def index(request):
    instance = Game.objects.filter(user=request.user).first()
    if request.user.is_authenticated and request.method == 'GET':
        form = GameUpdateForm(instance=instance)
        games = Game.objects.get(id=request.user.id)
        return render(request, 'blackjack/index.html', {'games': games, 'form': form})

# Sign Up view
def SignUp(request):
    if request.method == 'POST':
        form = UserCreateForm(request.POST)
        if form.is_valid():
            # Create user
            user = form.save(commit=False)
            # Save user to database
            user.save()
            # Create game score fields
            Game.objects.create(user=user)
            # Save game score fields fosr created user to database
            user.game.save()
            msg_conf = 'Account successfully created!'
            messages.success(request, msg_conf)
            return redirect('/blackjack/login/')
    else:
        # If request method is GET just render the UserCreateForm
        form = UserCreateForm()
    return render(request, 'blackjack/signup.html', {'form': form})

# Update scores view
def update_game(request):
    instance = Game.objects.filter(user=request.user).first()
    if request.method == 'POST':
        form = GameUpdateForm(request.POST, instance=instance)
        if form.is_valid():
            # Update scores
            score = form.save(commit=False)
            # Save scores to database
            score.save()
    return redirect('/blackjack')
