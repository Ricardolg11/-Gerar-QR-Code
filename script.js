    // Variáveis globais
        let qrCodeDataURL = null;
        const elements = {
            urlInput: document.getElementById('urlInput'),
            generateBtn: document.getElementById('generateBtn'),
            qrcode: document.getElementById('qrcode'),
            errorMsg: document.getElementById('errorMsg'),
            successMsg: document.getElementById('successMsg'),
            actionButtons: document.getElementById('actionButtons'),
            downloadBtn: document.getElementById('downloadBtn'),
            shareBtn: document.getElementById('shareBtn')
        };

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            // Focar no input ao carregar a página
            elements.urlInput.focus();
            
            // Adicionar event listeners
            setupEventListeners();
        });

        // Configurar event listeners
        function setupEventListeners() {
            // Gerar QR Code ao clicar no botão
            elements.generateBtn.addEventListener('click', generateQRCode);
            
            // Gerar QR Code ao pressionar Enter
            elements.urlInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    generateQRCode();
                }
            });
            
            // Download do QR Code
            elements.downloadBtn.addEventListener('click', downloadQRCode);
            
            // Compartilhar QR Code
            elements.shareBtn.addEventListener('click', shareQRCode);
        }

        // Função para validar URL
        function isValidURL(url) {
            try {
                new URL(url);
                return true;
            } catch (error) {
                return false;
            }
        }

        // Função para gerar QR Code
        function generateQRCode() {
            const url = elements.urlInput.value.trim();
            
            // Reset mensagens e ações
            hideMessage(elements.errorMsg);
            hideMessage(elements.successMsg);
            elements.actionButtons.classList.add('hidden');
            
            // Validar URL
            if (!url) {
                showError('Por favor, digite uma URL');
                return;
            }
            
            if (!isValidURL(url)) {
                showError('Por favor, digite uma URL válida (ex: https://exemplo.com)');
                return;
            }
            
            // Mostrar loader
            elements.qrcode.innerHTML = '<div class="loader"></div>';
            elements.qrcode.classList.remove('hidden');
            
            // Gerar QR Code usando a biblioteca qrcodejs
            try {
                // Limpar QR Code anterior
                elements.qrcode.innerHTML = '';
                
                // Criar instância do QRCode
                const qrcode = new QRCode(elements.qrcode, {
                    text: url,
                    width: 250,
                    height: 250,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                
                // Esperar o QR Code ser renderizado
                setTimeout(() => {
                    const img = elements.qrcode.querySelector('img');
                    if (img) {
                        qrCodeDataURL = img.src;
                        elements.actionButtons.classList.remove('hidden');
                        showSuccess('QR Code gerado com sucesso!');
                    } else {
                        showError('Erro ao gerar QR Code');
                    }
                }, 100);
                
            } catch (error) {
                showError('Erro inesperado: ' + error.message);
            }
        }

        // Função para baixar QR Code
        function downloadQRCode() {
            if (!qrCodeDataURL) {
                showError('Gere um QR Code primeiro!');
                return;
            }
            
            const link = document.createElement('a');
            const fileName = `qrcode-${Date.now()}.png`;
            
            link.href = qrCodeDataURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showSuccess('QR Code baixado com sucesso!');
        }

        // Função para compartilhar QR Code
        function shareQRCode() {
            if (!qrCodeDataURL) {
                showError('Gere um QR Code primeiro!');
                return;
            }
            
            if (navigator.share) {
                // Convert data URL to blob
                fetch(qrCodeDataURL)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], 'qrcode.png', { type: 'image/png' });
                        navigator.share({
                            title: 'QR Code Gerado',
                            text: 'Confira este QR Code que eu gerei!',
                            files: [file]
                        })
                        .then(() => showSuccess('QR Code compartilhado com sucesso!'))
                        .catch(error => {
                            if (error.name !== 'AbortError') {
                                showError('Erro ao compartilhar: ' + error.message);
                            }
                        });
                    });
            } else {
                showError('Seu navegador não suporta a funcionalidade de compartilhamento de arquivos');
            }
        }

        // Funções auxiliares para mensagens
        function showError(message) {
            elements.errorMsg.querySelector('span').textContent = message;
            elements.errorMsg.classList.remove('hidden');
            
            // Esconder após 5 segundos
            setTimeout(() => {
                hideMessage(elements.errorMsg);
            }, 5000);
        }

        function showSuccess(message) {
            elements.successMsg.querySelector('span').textContent = message;
            elements.successMsg.classList.remove('hidden');
            
            // Esconder após 3 segundos
            setTimeout(() => {
                hideMessage(elements.successMsg);
            }, 3000);
        }

        function hideMessage(element) {
            element.classList.add('hidden');
        }