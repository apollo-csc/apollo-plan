# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

"""Paginas de projeto pela API por chave (Apollo, 17/nov/2026).

O CE so expoe paginas na API interna do app (sessao do navegador). O conector
ApolloLink usa a API por chave, entao estas rotas espelham as regras da tela:
- a pessoa ve as paginas publicas do projeto e as privadas DELA;
- edita as publicas e as dela; pagina travada ou arquivada nao muda;
- o conteudo chega em HTML. Ao trocar o conteudo, o binario do editor e
  apagado, e o servidor do editor (live) o refaz a partir do HTML na proxima
  abertura (apps/live/src/extensions/database.ts).
Sem apagar: arquivar e excluir ficam na tela.
"""

from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response

from plane.app.permissions import ProjectEntityPermission
from plane.bgtasks.page_transaction_task import page_transaction
from plane.db.models import Page, Project, ProjectPage

from .base import BaseAPIView

CAMPOS = ("id", "name", "access", "owned_by_id", "parent_id", "is_locked", "archived_at", "created_at", "updated_at")
LIMITE_HTML = 500_000


def _resumo(page, com_conteudo=False):
    dado = {}
    for c in CAMPOS:
        v = getattr(page, c)
        dado[c] = v if v is None or isinstance(v, (str, int, bool)) else str(v)
    if com_conteudo:
        dado["description_html"] = page.description_html
    return dado


class _Base(BaseAPIView):
    model = Page
    permission_classes = [ProjectEntityPermission]

    def _visiveis(self, slug, project_id):
        return Page.objects.filter(
            Q(owned_by=self.request.user) | Q(access=0),
            workspace__slug=slug,
            projects__id=project_id,
            project_pages__deleted_at__isnull=True,
        ).distinct()


class ProjectPageListCreateAPIEndpoint(_Base):
    def get(self, request, slug, project_id):
        qs = self._visiveis(slug, project_id)
        if request.query_params.get("archived") != "true":
            qs = qs.filter(archived_at__isnull=True)
        busca = (request.query_params.get("search") or "").strip()
        if busca:
            qs = qs.filter(name__icontains=busca)
        paginas = qs.order_by("-updated_at")[:200]
        return Response({"results": [_resumo(p) for p in paginas]}, status=status.HTTP_200_OK)

    def post(self, request, slug, project_id):
        nome = (request.data.get("name") or "").strip()
        if not nome or len(nome) > 255:
            return Response({"error": "name obrigatorio (ate 255 caracteres)"}, status=status.HTTP_400_BAD_REQUEST)
        html = request.data.get("description_html") or "<p></p>"
        if not isinstance(html, str) or len(html) > LIMITE_HTML:
            return Response({"error": "description_html invalido ou grande demais"}, status=status.HTTP_400_BAD_REQUEST)
        acesso = request.data.get("access", 0)
        if acesso not in (0, 1):
            return Response({"error": "access deve ser 0 (publica) ou 1 (privada)"}, status=status.HTTP_400_BAD_REQUEST)
        pai = request.data.get("parent_id")
        if pai and not self._visiveis(slug, project_id).filter(pk=pai).exists():
            return Response({"error": "parent_id nao e uma pagina deste projeto"}, status=status.HTTP_400_BAD_REQUEST)
        project = Project.objects.get(pk=project_id, workspace__slug=slug)
        page = Page.objects.create(
            name=nome,
            access=acesso,
            parent_id=pai or None,
            description_html=html,
            description_json={},
            description_binary=None,
            owned_by_id=request.user.id,
            workspace_id=project.workspace_id,
        )
        ProjectPage.objects.create(
            workspace_id=page.workspace_id,
            project_id=project_id,
            page_id=page.id,
            created_by_id=request.user.id,
            updated_by_id=request.user.id,
        )
        page_transaction.delay(new_description_html=html, old_description_html=None, page_id=str(page.id))
        return Response(_resumo(page, com_conteudo=True), status=status.HTTP_201_CREATED)


class ProjectPageDetailAPIEndpoint(_Base):
    def get(self, request, slug, project_id, page_id):
        page = self._visiveis(slug, project_id).filter(pk=page_id).first()
        if page is None:
            return Response({"error": "pagina nao encontrada"}, status=status.HTTP_404_NOT_FOUND)
        return Response(_resumo(page, com_conteudo=True), status=status.HTTP_200_OK)

    def patch(self, request, slug, project_id, page_id):
        page = self._visiveis(slug, project_id).filter(pk=page_id).first()
        if page is None:
            return Response({"error": "pagina nao encontrada"}, status=status.HTTP_404_NOT_FOUND)
        if page.is_locked:
            return Response({"error": "pagina travada"}, status=status.HTTP_400_BAD_REQUEST)
        if page.archived_at:
            return Response({"error": "pagina arquivada"}, status=status.HTTP_400_BAD_REQUEST)
        campos = []
        if "name" in request.data:
            nome = (request.data.get("name") or "").strip()
            if not nome or len(nome) > 255:
                return Response({"error": "name invalido"}, status=status.HTTP_400_BAD_REQUEST)
            page.name = nome
            campos.append("name")
        antigo = page.description_html
        if "description_html" in request.data:
            html = request.data.get("description_html")
            if not isinstance(html, str) or not html.strip() or len(html) > LIMITE_HTML:
                return Response({"error": "description_html invalido"}, status=status.HTTP_400_BAD_REQUEST)
            page.description_html = html
            page.description_binary = None
            page.description_json = {}
            campos += ["description_html", "description_binary", "description_json"]
        if not campos:
            return Response({"error": "nada para mudar (name, description_html)"}, status=status.HTTP_400_BAD_REQUEST)
        page.updated_by_id = request.user.id
        page.save(update_fields=campos + ["updated_by", "updated_at"])
        if "description_html" in campos:
            page_transaction.delay(new_description_html=page.description_html, old_description_html=antigo, page_id=str(page.id))
        return Response(_resumo(page, com_conteudo=True), status=status.HTTP_200_OK)
