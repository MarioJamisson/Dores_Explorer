# 💀 Dores Explorer: Automação Inteligente de Armazenamento

**Dores Explorer** é uma ferramenta interna de automação e análise de dados projetada para digitalizar e resolver processos manuais de organização de arquivos. Criado para quem precisa de gerir grandes volumes de dados locais, ele funciona como um dashboard funcional que traz insights visuais rápidos e executa triagens em massa.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Build](https://img.shields.io/badge/Build-Portable%20EXE-blue)
![AI_Powered](https://img.shields.io/badge/AI%20Builder-Vibe%20Coding-8A2BE2)

## 🎯 O Problema e a Solução (Case de Uso)
* **A Dor:** A triagem manual e a limpeza de diretórios desorganizados consomem dezenas de horas reais de produtividade ao longo do mês.
* **A Solução:** Um agente local (Portable EXE) que faz o scan recursivo de diretórios e, com um único clique, categoriza e move milhares de arquivos para pastas organizadas semanticamente.
* **Vibe Coding & IA:** A lógica do backend (Python/Flask) e a implementação do algoritmo de varredura recursiva foram aceleradas utilizando **Prompt Engineering avançado** e LLMs. O que levaria dias de estruturação de código foi implementado e *deployado* em poucas horas através de iterações rápidas de IA generativa.

## 🚀 Funcionalidades Principais

- **⚡ Automação de Triagem (1-Click)**: O script inteligente separa milhares de arquivos soltos em pastas por categoria (Imagens, Docs, Vídeos, etc.) instantaneamente, economizando horas de trabalho braçal.
- **📊 Dashboard Analítico Funcional**: Interface que traz visibilidade imediata dos gargalos de armazenamento utilizando gráficos de rosca interativos (Chart.js) para tomada de decisão rápida.
- **📁 Análise de Dados Profunda**: Varredura recursiva que calcula o peso real de diretórios aninhados, evitando que arquivos pesados fiquem escondidos no sistema.
- **📦 Deploy Descomplicado**: Totalmente empacotado (`PyInstaller`) num arquivo único executável, que inicializa o servidor local e o dashboard no navegador de forma autônoma (zero setup para o utilizador final).
- **🔴 UI/UX de Alto Contraste**: Estética Cyber-Goth (Vermelho/Preto) otimizada para legibilidade, com o assistente "Dores" atuando como indicador visual de estado durante processamentos pesados.

## 🛠️ Tecnologias & Arquitetura

- **Orquestração de Backend**: Python 3.13 + Flask (APIs RESTful enxutas).
- **Frontend & Visualização de Dados**: HTML5, Vanilla CSS, JavaScript, Chart.js.
- **Automação & Empacotamento**: PyInstaller para geração do executável final.

## 📂 Instalação e Uso

### Para Usuários Finais (Executável)
1. Vá até a pasta `dist/`.
2. Execute o arquivo `Dores Explorer.exe`.
3. O painel abrirá automaticamente em `http://127.0.0.1:5000/`.

### Para Desenvolvedores
1. Certifique-se de ter o Python instalado na máquina.
2. Instale as dependências da API:
   ```bash
   pip install flask flask-cors
   ```
3. Inicie o orquestrador local:
   ```bash
   python app.py
   ```

---
*Construído com foco em produtividade, automação de tarefas repetitivas e rápida prototipagem de soluções.*
