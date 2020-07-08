

<h1 align="center"> Playlist</h1>
<p align="center">
  <img width="200"  src="https://github.com/danielsidev/playlist/blob/master/src/assets/images/playlist.png">
</p>
Um player de vídeo para playlists de filmes e compartilhamento com o Chromecast.
Desenvolvido com  Electron, NodeJS, Javascript and JQuery.

### Download para Macos executable aqui:


http://danielsiqueira.net/playlist/macos/Playlist.zip


* Para rodar o aplicativo no macos, habilite a opção que permite programas oriundos de qualquer fonte.Passo a passo => <a href="http://www.techtudo.com.br/dicas-e-tutoriais/noticia/2013/10/como-instalar-aplicativos-de-fora-da-mac-app-store-no-os-x-mavericks.html">Techtudo: Rodando programas de fora da Apple Store</a>

* Requer a descoberta da rede para compartilhar com o chromecast. Lembre-se de habilitar o modo visitante do Chromecast para deixá-lo público na sua rede wifi e poder compartilhar através do PC / Mac / Laptop.

### Sobre os formatos de vídeo e as legendas
----------
Nessa primeira versão, são suportados vídeos mp4 e legendas srt.
O aplicativo converte as legendas srt em vtt enquanto faz o carregamento do vídeo.
Para carregar as legendas corretamente, lembre-se de que o arquivo de legenda deve ter o mesmo nome do arquivo de vídeo
e deve estar no mesmo diretório.

### Controles do vídeo com o mouse e o teclado
----------
> No teclado:
- ctrl + l => [LOAD] Abre a tela para selecionar os vídeos
- ctrl + p or ctrl + space-bar => Play/Pause
- ctrl + m => [MENU] Abre o menu com a lista de vídeos carregados com as opções para acrescentar mais filmes.
- ctrl + u => [UNSOUND] Alterna entre Mudo e com Áudio
- ctrl+ f =>  [FULLSCREEN] Entra e sai do modo de Tela cheia
- ctrl + q => [QUIT] Fecha o aplicativo

### Instruções
----------
* Requer o módulo nativo do mdns

Na raiz do projeto...
Primeiro execute:
> sudo npm install ( É necessário usar o sudo aqui porque o Node faz o rebuild do node-gyp e precisa de permissão de root )

*Baixa todas as dependências do projeto.*
----------

Depois, execute:
>  npm start

*Inicia a aplicação electron*
----------
### Sobre o módulo mdns( Esse módulo é necessário, porque é utilizado para fazer a comunicação com o chromecast.)
Na raiz do projeto...
> Se você não tiver o mdns pode ter alguns erros. Nesse caso, resolva-os assim:

No linux, instale o mdns com:
> sudo npm run ubuntu-mdns && sudo npm run dependecy-ubuntu

SE aparecem erros de permissão EACCES, faça isso:
> sudo npm run permission


Para gerar o executável para Macos:
>  npm run pack-osx
----------

Para as ditribuições linux (.deb), siga esses passos:
> npm run pack-linux64 ( Gera o executável e dá permissão de escrita no diretório criado.Sua senha pode ser solicitada. )
> npm run install-deb64 ( Com executável gerado, faz a criação de diretório na Home do usuário e aloca os arquivos, registrando um atalho na lista de programas instalados )
----------

Para gerar o executável para windows:
>  npm run pack-win64 ( A versão para windows ainda não foi testada. Ajudem-me a testar! )
----------

### Para contribuir com o projeto, faça um fork dele
 Siga esses passos para contribuir:
 https://imasters.com.br/desenvolvimento/como-contribuir-com-um-projeto-no-github/?trace=1519021197&source=single
