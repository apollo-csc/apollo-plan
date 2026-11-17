# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Apollo (17/nov/2026): paginas de projeto pela API por chave (ApolloLink).
from django.urls import path

from plane.api.views.page import ProjectPageListCreateAPIEndpoint, ProjectPageDetailAPIEndpoint

urlpatterns = [
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/pages/",
        ProjectPageListCreateAPIEndpoint.as_view(http_method_names=["get", "post"]),
        name="project-pages",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/pages/<uuid:page_id>/",
        ProjectPageDetailAPIEndpoint.as_view(http_method_names=["get", "patch"]),
        name="project-page-detail",
    ),
]
