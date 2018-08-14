from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'blackjack'

urlpatterns = [
    path('', views.index, name='index'),
    path('login/',auth_views.LoginView.as_view(template_name='blackjack/login.html'), name='login'),
    path('logout/',auth_views.LogoutView.as_view(),name='logout'),
    path('signup/',views.SignUp, name='signup'),
    path('update_game/', views.update_game, name='update_game'),
]