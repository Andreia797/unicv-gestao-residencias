from django.contrib import admin
from .models import Edificio, Quarto, Cama, Residente, Residencia
from accounts.models import CustomUser, UserProfile  # Importe da aplicação correta

admin.site.register(Edificio)
admin.site.register(Quarto)
admin.site.register(Cama)
admin.site.register(Residente)
admin.site.register(Residencia)
admin.site.register(CustomUser)
admin.site.register(UserProfile)