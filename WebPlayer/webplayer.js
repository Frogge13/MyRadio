class WebPlayer extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback(){
    let playBtn = document.createElement("button");
    let pauseBtn = document.createElement("button");
    let volumerange = document.createElement("input");
    let audio = document.createElement("audio");

    playBtn.innerText = "Play";
    pauseBtn.innerText = "Pause";
    volumerange.type = "range";
    volumerange.min = 0;
    volumerange.max = 100;

    playBtn.addEventListener("click", () => {
      if (this.audio.paused) {
        audio.play();
      }
    })
    pauseBtn.addEventListener("click", () => {
      if (!this.audio.paused) {
        audio.pause();
      }
    })

    volumerange.addEventListener("change", () => {
      this.volumeChange();
    });


    this.appendChild(playBtn);
    this.appendChild(pauseBtn);
    this.appendChild(volumerange);
    this.appendChild(audio);

    this.volumerange = volumerange;
    this.audio = audio;

  }

  disconnectedCallback(){

  }

  attributeChangedCallback(){

  }

  volumeChange(){
    this.audio.volume = this.volumerange.value/100;
    console.log(this.audio.volume);
  }
}




window.customElements.define("web-player", WebPlayer);
