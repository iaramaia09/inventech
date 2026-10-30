# Inventech — projeto frontend

## Como abrir
1. Extraia o ZIP.
2. No VS Code, escolha Arquivo > Abrir Pasta e selecione a pasta inventech.
3. Abra index.html no navegador (um duplo clique funciona).
4. Depois de editar e salvar os arquivos, atualize o navegador para ver as mudanças.

Não precisa instalar Node.js, npm ou dependências.

## Arquivos
- index.html: documento inicial e referências ao CSS e JavaScript.
- style.css: cores, fontes, tamanhos, espaçamentos e responsividade.
- app.js: conteúdo das telas, navegação, dados fictícios e interações.

As telas são geradas no app.js: render() cria o login e a estrutura geral;
dashboard(), stock() e reports() geram as respectivas páginas.
Os dados iniciais estão em seed e records.

## Demonstração
Clique em Entrar sem preencher credenciais. Busca, filtros, cadastro, edição,
exclusão, movimentações e exportação CSV funcionam no navegador.
Não há autenticação real nem backend. Ao recarregar, os dados são reiniciados.
Movimentação e Fornecedores no menu são espaços reservados, sem telas próprias.

## Publicação e edição local
Os arquivos deste ZIP podem ser modificados livremente.
Editar no seu computador não atualiza automaticamente a versão online.

## Leitura do código
Os arquivos estão formatados com quebras de linha e indentação.
O conteúdo das telas está no app.js, dentro de textos entre crases.
No VS Code, use Option + Z (Mac) ou Alt + Z (Windows) para ativar a quebra visual de linhas longas.
