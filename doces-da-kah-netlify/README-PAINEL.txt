DOCES DA KAH — SITE COM PAINEL ADMINISTRATIVO

O que foi acrescentado:
- Painel de edição em /admin/
- Upload de fotos pelo painel
- Edição de nome, categoria, descrição, preço, tamanhos e sabores
- Cadastro de produtos novos
- O catálogo público carrega os dados de data/catalogo.json

IMPORTANTE: para o painel salvar alterações de verdade, o site precisa estar conectado a um repositório GitHub e publicado no Netlify a partir desse repositório. O Netlify Drop (arrastar uma pasta/ZIP) sozinho publica o site, mas não cria um repositório Git para o CMS gravar as alterações.

CONFIGURAÇÃO DO PAINEL (uma vez):
1. Crie uma conta gratuita em https://github.com/ e um repositório chamado, por exemplo, doces-da-kah.
2. Envie TODOS os arquivos desta pasta para o repositório. A pasta admin, a pasta data, assets, index.html, styles.css e script.js precisam ficar na raiz.
3. No arquivo admin/config.yml, troque:
   SEU_USUARIO/SEU_REPOSITORIO
   pelo endereço do seu repositório, por exemplo: kah-doces/doces-da-kah
4. Salve essa alteração no GitHub.
5. No Netlify, importe/conecte esse repositório GitHub (Add new project > Import an existing project) e publique a branch main.
6. Configure a autenticação GitHub/OAuth para o Decap CMS conforme a documentação oficial do Decap/Netlify. O backend GitHub exige login GitHub com permissão de escrita no repositório. Não compartilhe a senha do GitHub.
7. Depois de configurado, abra https://SEU-SITE.netlify.app/admin/ e entre com a conta GitHub autorizada.

Como editar depois:
1. Acesse seu-site.netlify.app/admin/
2. Entre no painel.
3. Abra “Catálogo de produtos” > “Produtos, fotos e preços”.
4. Clique no produto para editar ou crie um item novo.
5. Para trocar uma foto, clique no campo da foto e envie a nova imagem.
6. Clique em Publish/Publicar. O Netlify vai gerar uma nova publicação e atualizar o site.

Atenção:
- O painel usa Decap CMS com backend GitHub. O repositório deve estar conectado ao Netlify.
- Git Gateway/Netlify Identity é citado em tutoriais antigos, mas o Git Gateway está marcado como deprecated pela Netlify. Por isso este pacote usa o backend GitHub.
- A conta GitHub que entrar no painel precisa ter permissão de escrita no repositório.
- O número do WhatsApp foi configurado como 55 91 98107-5813; altere em script.js se o DDD estiver incorreto.
