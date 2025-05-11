from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
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
    def authenticate(self, request, email=None, password=None, **kwargs):
        print(f"Autenticando usuário com email: {email}")  # Adicionando log
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            print(f"Usuário com o email {email} não encontrado.")
            return None
        if user.check_password(password):
            return user
        print("Senha inválida.")
        return None
