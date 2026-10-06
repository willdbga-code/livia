# LÍVIA BARBOSA NAILS — The Groovy Hip-Hop Shoot

> **Diretriz Criativa & Moodboard Oficial de Alta Costura**  
> *Pindamonhangaba, SP — 2026 Edition // Maktub*

---

## ✦ Visão Geral do Projeto

Website conceitual e **Moodboard Digital de Direção Criativa** para o ensaio fotográfico oficial da nail designer **Lívia Barbosa** (`@liviabarbosanails` / `@liviia_barbosa`). 

Projetado com padrão estético e interativo de nível **Awwwards (Site of the Day)**, unindo a atitude monumental do **Hip-Hop dos anos 90** com o balanço orgânico, curvilíneo e sensual da estética **Groovy**, preservando o luxo editorial e a precisão da alta-costura em unhas.

---

## 💎 Destaques da Experiência

1. **Zero Bounding Boxes**:
   - Eliminação completa de caixas cinzas, bordas de cards e painéis com cara de dashboard SaaS.
   - Layout aberto, contínuo e cinematográfico inspirado em editoriais de moda (*Dazed, Vibe, The Source*).

2. **Orquestração de Camadas de Profundidade (`z-index: 0` a `10`)**:
   - `z-index: 0`: Base *Vinyl Black* profunda com textura tátil de granulação de filme 35mm e névoas de luz dourada/bordô difusas.
   - `z-index: 1`: Tipografia colossal vazada em outline (`BARBOSA`, `MAKTUB`, `THE BLOCK QUEEN`) deslizando em parallax ao fundo.
   - `z-index: 2`: Canvas WebGL transparente full-bleed com assets 3D flutuando em espaço aberto.
   - `z-index: 3`: Grid editorial assimétrico com 9 fotografias reais de referência sobrepostas com rotações sutis (`rotate(-1.5deg)` e `rotate(2.5deg)`).
   - `z-index: 4`: Elementos táteis da cultura street (fitas adesivas translúcidas, carimbos dourados circulares rotativos *"ART EM CADA DETALHE"*, códigos de fita cassete).
   - `z-index: 10`: HUD minimalista (cursor magnético com trail, navegação com monograma flutuante e console de áudio com batida groovy hip-hop).

3. **3D Interactive Stage & Lighting Lab (Three.js)**:
   - **The Uzi Diamond**: O símbolo do hip-hop iced-out flutuando na capa e no palco.
   - **A Mão Editorial**: Modelo 3D anatômico para estudo de iluminação e poses.
   - **Garra Stiletto**: A silhueta afiada e imponente das unhas stiletto cromadas.
   - **Frasco Couture**: O vidro de esmalte com materiais PBR e vidro espelhado.
   - **Cenário Studio**: O espaço profissional da nail artist.
   - Controles tipográficos abertos de iluminação: `[ AMBER GOLD 3200K ]`, `[ CHROME RIM ]`, `[ NEON HAZE ]`, `[ DARK LOW-KEY ]`.

4. **Trilha Sonora do Set (Groovy Tape Deck)**:
   - Sintetizador de áudio procedural via Web Audio API tocando batida suave de hip-hop lo-fi/groovy para inspirar a equipe durante a sessão de fotos.

5. **Dossiê & Checklist de Produção**:
   - Lista interativa de itens indispensáveis para o estúdio com cálculo de prontidão em tempo real e atalho para impressão de dossiê em PDF.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**: Estrutura acessível com metatags OpenGraph e SEO.
- **CSS3 Moderno**: CSS Grid, Flexbox, Variáveis CSS, Glassmorphism, Filtros de textura analógica, Tipografia fluida com `clamp()`.
- **Three.js (r128)**: Renderização WebGL com suporte a `.fbx` (FBXLoader), `.obj` (OBJLoader) e `.dae` (ColladaLoader), PBR materials e canvas com `alpha: true`.
- **Web Audio API**: Geração de áudio analógico direto no navegador sem dependências externas.
- **JavaScript Moderno (ES6+)**: Controle de inércia, rotação 3D interativa, modal Lightbox em alta definição e cursor magnético.

---

## 🚀 Como Executar

Por ser uma aplicação web pura (HTML/CSS/JS com módulos ES6), basta servir a pasta com qualquer servidor estático local:

```bash
# Com Node.js
npx serve .

# Ou com Python
python -m http.server 8000
```

Abra `http://localhost:8000` (ou o endereço indicado) no navegador.

---

## 📸 Créditos & Referências

- **Cliente & Nail Artist**: Lívia Barbosa ([@liviabarbosanails](https://www.instagram.com/liviabarbosanails/) • [@liviia_barbosa](https://www.instagram.com/liviia_barbosa/))
- **Localização**: Pindamonhangaba - SP
- **Assinatura**: *"Art em cada detalhe! • Maktub"*
