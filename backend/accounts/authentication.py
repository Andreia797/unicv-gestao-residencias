from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

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
