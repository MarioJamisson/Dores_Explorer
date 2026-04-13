# 💀 Dores Explorer

**Dores Explorer** é um explorador de arquivos de alto desempenho com uma estética **Cyber-Goth/Hacker**, projetado para quem busca velocidade, organização automática e análise visual de dados.

![Aesthetic](https://img.shields.io/badge/Aesthetic-Red%20%26%20Black-red)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Build](https://img.shields.io/badge/Build-Portable%20EXE-blue)

## 🚀 Funcionalidades

- **🔴 Tema de Alto Contraste**: Interface otimizada em Vermelho e Preto para máxima legibilidade e estilo.
- **📊 Análise com Gráficos**: Visualize o consumo de disco com gráficos de rosca (Doughnut) interativos usando Chart.js.
- **📁 Organização Inteligente**: Botão de organização que separa arquivos em pastas por categoria (Imagens, Docs, Vídeos, etc.) com apenas um clique.
- **⚡ Análise Profunda**: Opção de calcular o tamanho real de cada pasta recursivamente.
- **💀 Mascote Dores**: O assistente crânio que pulsa durante o processamento do sistema.
- **📦 Totalmente Portátil**: Gerado em um único arquivo `.exe` que inicia o servidor e abre o navegador automaticamente.

## 🛠️ Tecnologias

- **Backend**: Python 3.13 + Flask
- **Frontend**: HTML5, Vanilla CSS, JavaScript
- **Gráficos**: Chart.js
- **Bundling**: PyInstaller

## 📂 Instalação e Uso

### Para Usuários (Executável)
1. Vá até a pasta `dist/`.
2. Execute o arquivo `Dores Explorer.exe`.
3. O navegador abrirá automaticamente em `http://127.0.0.1:5000/`.

### Para Desenvolvedores (Código Fonte)
1. Certifique-se de ter o Python instalado.
2. Instale as dependências:
   ```bash
   pip install flask flask-cors
   ```
3. Execute o servidor:
   ```bash
   python app.py
   ```

## 🧠 O Mascote: Dores
O **Dores** é mais que um ícone; ele é o indicador de estado do sistema. 
- **Flutuando**: Sistema em standby.
- **Pulsando Vermelho**: O sistema está realizando scans pesados ou organizando arquivos.

---
*Desenvolvido com foco em performance e estética hacker.*
