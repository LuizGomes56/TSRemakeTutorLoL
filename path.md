cd /etc/nginx/
ls
sudo cp tutorlol.com.conf
sudo cp tutorlol.com.conf tutorlol_api.com.conf

sudo ln -s /etc/nginx/tutorlol.com.conf

cd /etc/systemd/
cd /system

sudo cp lolapi.service (TutorLoL Backend)

sudo systemctl enable lolapi // Reiniciar o serviço ao reiniciar a máquina
sudo systemctl start lolapi.service

journalctl -xe (Mostrar erros)

sudo chmod -r 777

// sudo service lolapi restart