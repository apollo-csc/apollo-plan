/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import {
  ALargeSmall,
  CaseSensitive,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ImageIcon,
  List,
  ListOrdered,
  ListTodo,
  MessageSquareText,
  MinusSquare,
  Smile,
  Table,
  TextQuote,
} from "lucide-react";
// constants
import { COLORS_LIST } from "@/constants/common";
// helpers
import {
  insertTableCommand,
  toggleBlockquote,
  toggleBulletList,
  toggleOrderedList,
  toggleTaskList,
  toggleHeading,
  toggleTextColor,
  toggleBackgroundColor,
  insertImage,
  insertCallout,
  setText,
  openEmojiPicker,
} from "@/helpers/editor-commands";
// plane editor extensions
import { coreEditorAdditionalSlashCommandOptions } from "@/plane-editor/extensions";
// types
import type { CommandProps, ISlashCommandItem, TSlashCommandSectionKeys } from "@/types";
// local types
import type { TExtensionProps, TSlashCommandAdditionalOption } from "./root";

export type TSlashCommandSection = {
  key: TSlashCommandSectionKeys;
  title?: string;
  items: ISlashCommandItem[];
};

export const getSlashCommandFilteredSections =
  (args: TExtensionProps) =>
  ({ query }: { query: string }): TSlashCommandSection[] => {
    const { additionalOptions: externalAdditionalOptions, disabledExtensions, flaggedExtensions } = args;
    const SLASH_COMMAND_SECTIONS: TSlashCommandSection[] = [
      {
        key: "general",
        items: [
          {
            commandKey: "text",
            key: "text",
            title: "Texto",
            description: "Comece a digitar com texto simples.",
            searchTerms: ["p", "paragraph", "paragrafo", "parágrafo", "texto"],
            icon: <CaseSensitive className="size-3.5" />,
            command: ({ editor, range }) => setText(editor, range),
          },
          {
            commandKey: "h1",
            key: "h1",
            title: "Título 1",
            description: "Título de seção grande.",
            searchTerms: ["title", "big", "large", "titulo", "título", "cabecalho", "cabeçalho"],
            icon: <Heading1 className="size-3.5" />,
            command: ({ editor, range }) => toggleHeading(editor, 1, range),
          },
          {
            commandKey: "h2",
            key: "h2",
            title: "Título 2",
            description: "Título de seção médio.",
            searchTerms: ["subtitle", "medium", "titulo", "título", "subtitulo", "subtítulo"],
            icon: <Heading2 className="size-3.5" />,
            command: ({ editor, range }) => toggleHeading(editor, 2, range),
          },
          {
            commandKey: "h3",
            key: "h3",
            title: "Título 3",
            description: "Título de seção pequeno.",
            searchTerms: ["subtitle", "small", "titulo", "título", "subtitulo", "subtítulo"],
            icon: <Heading3 className="size-3.5" />,
            command: ({ editor, range }) => toggleHeading(editor, 3, range),
          },
          {
            commandKey: "h4",
            key: "h4",
            title: "Título 4",
            description: "Título de seção pequeno.",
            searchTerms: ["subtitle", "small", "titulo", "título", "subtitulo", "subtítulo"],
            icon: <Heading4 className="size-3.5" />,
            command: ({ editor, range }) => toggleHeading(editor, 4, range),
          },
          {
            commandKey: "h5",
            key: "h5",
            title: "Título 5",
            description: "Título de seção pequeno.",
            searchTerms: ["subtitle", "small", "titulo", "título", "subtitulo", "subtítulo"],
            icon: <Heading5 className="size-3.5" />,
            command: ({ editor, range }) => toggleHeading(editor, 5, range),
          },
          {
            commandKey: "h6",
            key: "h6",
            title: "Título 6",
            description: "Título de seção pequeno.",
            searchTerms: ["subtitle", "small", "titulo", "título", "subtitulo", "subtítulo"],
            icon: <Heading6 className="size-3.5" />,
            command: ({ editor, range }) => toggleHeading(editor, 6, range),
          },

          {
            commandKey: "numbered-list",
            key: "numbered-list",
            title: "Lista numerada",
            description: "Criar uma lista numerada.",
            searchTerms: ["ordered", "lista", "numerada", "ordenada"],
            icon: <ListOrdered className="size-3.5" />,
            command: ({ editor, range }) => toggleOrderedList(editor, range),
          },
          {
            commandKey: "bulleted-list",
            key: "bulleted-list",
            title: "Lista com marcadores",
            description: "Criar uma lista com marcadores.",
            searchTerms: ["unordered", "point", "lista", "marcadores", "topicos", "tópicos"],
            icon: <List className="size-3.5" />,
            command: ({ editor, range }) => toggleBulletList(editor, range),
          },
          {
            commandKey: "to-do-list",
            key: "to-do-list",
            title: "Lista de tarefas",
            description: "Criar uma lista de tarefas.",
            searchTerms: ["todo", "task", "list", "check", "checkbox", "tarefa", "lista", "caixa de selecao", "caixa de seleção"],
            icon: <ListTodo className="size-3.5" />,
            command: ({ editor, range }) => toggleTaskList(editor, range),
          },
          {
            commandKey: "table",
            key: "table",
            title: "Tabela",
            description: "Criar uma tabela",
            searchTerms: ["table", "cell", "db", "data", "tabular", "tabela", "celula", "célula", "dados"],
            icon: <Table className="size-3.5" />,
            command: ({ editor, range }) => insertTableCommand(editor, range),
          },
          {
            commandKey: "quote",
            key: "quote",
            title: "Citação",
            description: "Inserir uma citação.",
            searchTerms: ["blockquote", "citacao", "citação"],
            icon: <TextQuote className="size-3.5" />,
            command: ({ editor, range }) => toggleBlockquote(editor, range),
          },
          {
            commandKey: "code",
            key: "code",
            title: "Código",
            description: "Inserir um trecho de código.",
            searchTerms: ["codeblock", "codigo", "código"],
            icon: <Code2 className="size-3.5" />,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
          },
          {
            commandKey: "callout",
            key: "callout",
            title: "Destaque",
            icon: <MessageSquareText className="size-3.5" />,
            description: "Inserir destaque",
            searchTerms: ["callout", "comment", "message", "info", "alert", "destaque", "aviso", "alerta", "mensagem"],
            command: ({ editor, range }: CommandProps) => insertCallout(editor, range),
          },
          {
            commandKey: "divider",
            key: "divider",
            title: "Divisor",
            description: "Separar blocos visualmente.",
            searchTerms: ["line", "divider", "horizontal", "rule", "separate", "linha", "divisor", "separador"],
            icon: <MinusSquare className="size-3.5" />,
            command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
          },
          {
            commandKey: "emoji",
            key: "emoji",
            title: "Emoji",
            description: "Inserir um emoji",
            searchTerms: ["emoji", "icons", "reaction", "emoticon", "emotags"],
            icon: <Smile className="size-3.5" />,
            command: ({ editor, range }) => {
              openEmojiPicker(editor, range);
            },
          },
        ],
      },
      {
        key: "text-colors",
        title: "Cores",
        items: [
          {
            commandKey: "text-color",
            key: "text-color-default",
            title: "Padrão",
            description: "Alterar cor do texto",
            searchTerms: ["color", "text", "default", "cor", "texto", "padrao", "padrão"],
            icon: <ALargeSmall className="size-3.5 text-primary" />,
            command: ({ editor, range }) => toggleTextColor(undefined, editor, range),
          },
          ...COLORS_LIST.map(
            (color) =>
              ({
                commandKey: "text-color",
                key: `text-color-${color.key}`,
                title: color.label,
                description: "Alterar cor do texto",
                searchTerms: ["color", "text", "cor", "texto", color.label.toLowerCase()],

                icon: (
                  <ALargeSmall
                    className="size-3.5"
                    style={{
                      color: color.textColor,
                    }}
                  />
                ),

                command: ({ editor, range }) => toggleTextColor(color.key, editor, range),
              }) as ISlashCommandItem
          ),
        ],
      },
      {
        key: "background-colors",
        title: "Cores de fundo",
        items: [
          {
            commandKey: "background-color",
            key: "background-color-default",
            title: "Fundo padrão",
            description: "Alterar cor de fundo",
            searchTerms: ["color", "bg", "background", "default", "cor", "fundo", "padrao", "padrão"],
            icon: <ALargeSmall className="size-3.5" />,
            iconContainerStyle: {
              borderRadius: "4px",
              backgroundColor: "var(--background-color-surface-1)",
              border: "1px solid var(--border-color-strong)",
            },
            command: ({ editor, range }) => toggleTextColor(undefined, editor, range),
          },
          ...COLORS_LIST.map(
            (color) =>
              ({
                commandKey: "background-color",
                key: `background-color-${color.key}`,
                title: color.label,
                description: "Alterar cor de fundo",
                searchTerms: ["color", "bg", "background", "cor", "fundo", color.label.toLowerCase()],
                icon: <ALargeSmall className="size-3.5" />,

                iconContainerStyle: {
                  borderRadius: "4px",
                  backgroundColor: color.backgroundColor,
                },

                command: ({ editor, range }) => toggleBackgroundColor(color.key, editor, range),
              }) as ISlashCommandItem
          ),
        ],
      },
    ];

    const internalAdditionalOptions: TSlashCommandAdditionalOption[] = [];
    if (!disabledExtensions?.includes("image")) {
      internalAdditionalOptions.push({
        commandKey: "image",
        key: "image",
        title: "Imagem",
        icon: <ImageIcon className="size-3.5" />,
        description: "Inserir uma imagem",
        searchTerms: ["img", "photo", "picture", "media", "upload", "imagem", "foto", "midia", "mídia"],
        command: ({ editor, range }: CommandProps) => insertImage({ editor, event: "insert", range }),
        section: "general",
        pushAfter: "code",
      });
    }

    [
      ...internalAdditionalOptions,
      ...(externalAdditionalOptions ?? []),
      ...coreEditorAdditionalSlashCommandOptions({
        disabledExtensions,
        flaggedExtensions,
      }),
    ]?.forEach((item) => {
      const sectionToPushTo = SLASH_COMMAND_SECTIONS.find((s) => s.key === item.section) ?? SLASH_COMMAND_SECTIONS[0];
      const itemIndexToPushAfter = sectionToPushTo.items.findIndex((i) => i.commandKey === item.pushAfter);
      if (itemIndexToPushAfter !== -1) {
        sectionToPushTo.items.splice(itemIndexToPushAfter + 1, 0, item);
      } else {
        sectionToPushTo.items.push(item);
      }
    });

    const filteredSlashSections = SLASH_COMMAND_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (typeof query !== "string") return;

        const lowercaseQuery = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(lowercaseQuery) ||
          item.description.toLowerCase().includes(lowercaseQuery) ||
          item.searchTerms.some((t) => t.includes(lowercaseQuery))
        );
      }),
    }));

    return filteredSlashSections.filter((s) => s.items.length !== 0);
  };
