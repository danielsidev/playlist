#!/bin/bash
### Instalação no Ubuntu e derivados Debian ###
### Dê permissão de execução nesse arquivo => sudo chmod +x ./install-playlist.sh ###

### Cria a estrutura de pastas em home do usuário ###
echo -e "\n\nCriando diretório para alocar o aplicativo...\n\n"
PASTA="/home/$USER/Playlist-app"
mkdir $PASTA
echo -e "Copiando ícone para a raiz do projeto...\n\n"
cp ./build/Playlist-linux-x64/resources/app/build_resources/playlist-logo.png ./build/Playlist-linux-x64/playlist.png
echo -e "Copiando conteúdo para o novo local em: $PASTA \n\n"
cp -r ./build/Playlist-linux-x64/* $PASTA

### Cria o ícone desktop na lista de programas ###
echo -e "Criando o atalho no menu de programas Gnome ou Unity na categoria Application e  Video...\n\n"
echo "[Desktop Entry]
      Name=Playlist
      Comment=Aplicativo para ver playlists de  vídeos mp4 e compartilhar no chromecast
      Exec=$PASTA/Playlist
      Icon=$PASTA/playlist.png
      Terminal=false
      Version=1.0.0
      Categories=Application;Video;
      Type=Application" >  ~/.local/share/applications/playlist.desktop

### Abre o aplicativo instalado ###
echo -e "Abrindo aplicativo Playlist...\n\n"
echo -e "$PASTA/Playlist \n\n"
$PASTA/Playlist
