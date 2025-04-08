# Generated by Django 5.2 on 2025-04-05 14:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
        ('estudantes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Candidatura',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('DataSubmissao', models.DateTimeField(auto_now_add=True)),
                ('CNIouPassaporteEntregue', models.CharField(blank=True, max_length=255, null=True)),
                ('DeclaracaoMatriculaEntregue', models.CharField(blank=True, max_length=255, null=True)),
                ('DeclaracaoRendimentoEntregue', models.CharField(blank=True, max_length=255, null=True)),
                ('DeclaracaoSubsistenciaEntregue', models.CharField(blank=True, max_length=255, null=True)),
                ('DeclaracaoResidenciaEntregue', models.CharField(blank=True, max_length=255, null=True)),
                ('estudante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='estudantes.estudante')),
                ('residencia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.residencia')),
            ],
        ),
    ]
