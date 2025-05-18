from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import jwt

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
    """
    Autenticação baseada em JWT extraído do header Authorization.
    """
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = User.objects.get(id=payload['user_id'])
            return (user, token)
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            raise AuthenticationFailed('Token inválido ou expirado')


class EmailBackend(ModelBackend):
    """
    Backend de autenticação que permite login com e-mail e senha.
    """
    def authenticate(self, request, email=None, password=None, **kwargs):
        User = get_user_model()

        if email is None:
            email = kwargs.get('username')  # fallback para autenticação padrão

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        if user.check_password(password):
            return user

        return None
