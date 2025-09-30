// Importa React e hooks useState e useEffect
import React, { useState, useEffect } from 'react';

// Importa o CSS do App
import './App.css';

// Importa todas as imagens e gifs usados no app
import playImg from "./assets/play.png";          // Ícone do botão "play"
import resetImg from "./assets/reset.png";        // Ícone do botão "reset"
import studyBtnClicked from "./assets/study-clicked.png"; // Botão de "study" clicado
import studyBtn from "./assets/study.png";          // Botão de "study" normal
import breakBtnClicked from "./assets/break-clicked.png"; // Botão de "pause" clicado
import breakBtn from "./assets/break.png";        // Botão de "pause" normal
import idleGif from "./assets/idle.gif";          // GIF quando estiver parado
import studyGif from "./assets/study.gif";          // GIF quando em estudando
import breakGif from "./assets/break.gif";        // GIF quando em pausa
import closeBtn from "./assets/close.png";        // Ícone de fechar

// Função principal do App
function App() {

  // ------------------------
  // Estados principais
  // ------------------------

  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  // tempo restante em segundos, inicial = 25 minutos

  const [isRunning, setIsRunning] = useState(false); 
  // indica se o timer está rodando

  const [breakButtonImage, setBreakButtonImage] = useState(breakBtn); 
  // controla a imagem atual do botão de pausa

  const [studyButtonImage, setStudyButtonImage] = useState(studyBtn); 
  // controla a imagem atual do botão de trabalho

  const [gifImage, setGifImage] = useState(idleGif); 
  // controla o GIF mostrado (idle, work, break)

  const [isBreak, setIsBreak] = useState(false); 
  // indica se o modo atual é pausa (true) ou trabalho (false)

  const [encouragement, setEncouragement] = useState(""); 
  // mensagem de incentivo exibida acima do timer

  const [image, setImage] = useState(playImg); 
  // imagem do botão principal (play ou reset)

  // ------------------------
  // Mensagens de incentivo
  // ------------------------

  const cheerMessages = [
    "Tatakae!(戦え)", 
    "Incendeie seu coração! - Rengoku",
    "Tudo o que posso fazer é trabalhar duro! - Tanjiro Kamado",
    "Torne-se a lâmina mais resistente de todas. - Jigoro Kuwajima",
    "Seja orgulhoso, você é forte. - Ryomen Sukuna"
  ]; 
  // mensagens exibidas durante o modo trabalho

  const breakMessages = [
    "Beba água!",
    "Que tal um lanche?",
    "Tiktok time!",
    "Descanse um pouco!"
  ]; 
  // mensagens exibidas durante o modo pausa

  // ------------------------
  // Atualiza a mensagem de incentivo a cada 4 segundos
  // ------------------------
  useEffect(() => {
    let messageInterval; 
    // variável para armazenar o setInterval

    if (isRunning) {
      const messages = isBreak ? breakMessages : cheerMessages; 
      // escolhe o conjunto de mensagens dependendo do modo

      setEncouragement(messages[0]); 
      // mostra a primeira mensagem imediatamente

      let index = 1; 
      // índice da próxima mensagem a ser exibida

      messageInterval = setInterval(() => {
        setEncouragement(messages[index]); 
        // atualiza a mensagem exibida
        index = (index + 1) % messages.length; 
        // aumenta o índice e volta ao início quando chega ao fim
      }, 4000); 
      // a cada 4 segundos
    } else {
      setEncouragement(""); 
      // se o timer não está rodando, limpa a mensagem
    }

    return () => clearInterval(messageInterval); 
    // limpa o intervalo quando o componente desmonta ou isRunning muda
  }, [isRunning, isBreak]); 
  // dispara sempre que isRunning ou isBreak mudam

  // ------------------------
  // Timer regressivo
  // ------------------------
  useEffect(() => {
    let timer; 
    // variável para armazenar o setInterval do timer

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1); 
        // decrementa o tempo a cada segundo
      }, 1000);
    }

    return () => clearInterval(timer); 
    // limpa o intervalo quando o componente desmonta ou isRunning/timeLeft mudam
  }, [isRunning, timeLeft]); 
  // dispara sempre que isRunning ou timeLeft mudam

  // ------------------------
  // Define o modo inicial como trabalho
  // ------------------------
  useEffect(() => {
    switchMode(false); 
    // chama a função para configurar o estado inicial (work mode)
  }, []); 
  // disparado apenas na montagem do componente

  // ------------------------
  // Formata o tempo em MM:SS
  // ------------------------
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0'); 
    // calcula os minutos e garante 2 dígitos

    const s = (seconds % 60).toString().padStart(2, '0'); 
    // calcula os segundos e garante 2 dígitos

    return `${m}:${s}`; 
    // retorna a string formatada
  };

  // ------------------------
  // Alterna entre modos trabalho e pausa
  // ------------------------
  const switchMode = (breakMode) => {
    setIsBreak(breakMode); 
    // atualiza o estado do modo

    setIsRunning(false); 
    // pausa o timer

    setBreakButtonImage(breakMode ? breakBtnClicked : breakBtn); 
    // muda a imagem do botão de pausa

    setStudyButtonImage(breakMode ? studyBtn : studyBtnClicked); 
    // muda a imagem do botão de trabalho

    setTimeLeft(breakMode ? 5 * 60 : 25 * 60); 
    // define o tempo inicial dependendo do modo

    setGifImage(idleGif); 
    // mostra GIF de idle
  };

  // ------------------------
  // Lógica do botão principal (play/reset)
  // ------------------------
  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true); 
      // inicia o timer

      setGifImage(isBreak ? breakGif : studyGif); 
      // muda o GIF dependendo do modo

      setImage(resetImg); 
      // muda o botão para reset
    } else {
      setIsRunning(false); 
      // pausa o timer

      setTimeLeft(isBreak ? 5 * 60 : 25 * 60); 
      // reseta o tempo dependendo do modo

      setGifImage(idleGif); 
      // muda GIF para idle

      setImage(playImg); 
      // muda o botão para play
    }
  };

  // ------------------------
  // Fecha o app via Electron
  // ------------------------
  const handleCloseClick = () => {
    if (window.electronAPI?.closeApp) {
      window.electronAPI.closeApp(); 
      // chama a função do preload do Electron
    } else {
      console.warn("Electron API não disponível"); 
      // mostra aviso no console
    }
  };

  // ------------------------
  // Classe do container principal
  // ------------------------
  const containerClass = `home-container ${isRunning ? "background" : ""}`;
  // adiciona classe "background" quando o timer está rodando

  return (
    <div className={containerClass} style={{ position: 'relative' }}>
      {/* Botão de fechar */}
      <div>
        <button className="close-button" onClick={handleCloseClick}>
          <img src={closeBtn} alt="Close" />
        </button>
      </div>

      <div className="home-content">
        {/* Botões de Study / Pause */}
        <div className="home-controls">
          <button className="image-button" onClick={() => switchMode(false)}>
            <img src={studyButtonImage} alt="Study" />
          </button>
          <button className="image-button" onClick={() => switchMode(true)}>
            <img src={breakButtonImage} alt="Break" />
          </button>
        </div>

        {/* Mensagem de incentivo */}
        <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}>
          {encouragement}
        </p>

        {/* Timer */}
        <h1 className="home-timer">{formatTime(timeLeft)}</h1>

        {/* GIF animado */}
        <img src={gifImage} alt="Timer Status" className="gif-image" />

        {/* Botão Play / Reset */}
        <button className="home-button" onClick={handleClick}>
          <img src={image} alt="Button Icon" />
        </button>
      </div>
    </div>
  );
}

// Exporta o App como padrão
export default App;
