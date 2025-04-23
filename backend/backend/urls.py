from django.contrib import admin
from django.urls import path, include
from two_factor import urls as two_factor_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('2fa/', include(two_factor_urls.urlpatterns)),
    path('api/accounts/', include('accounts.urls')),
    path('api/relatorios/', include('relatorios.urls')),
]