/* DeslizeJS © 2024 - Andjeckson Tavares Guimarães*/

(function(){
  var DeslizeJS = function(elemento){
     if( !( this instanceof DeslizeJS)){
       return new DeslizeJS( elemento )
     }
      this.elemento = elemento ?? document.querySelector(elemento)
      
      var deslizeParaEsquerda = new CustomEvent('deslizeParaEsquerda')
      var deslizeParaDireita = new CustomEvent('deslizeParaDireita')
      var deslizeParaCima = new CustomEvent('deslizeParaCima')
      var deslizeParaBaixo = new CustomEvent('deslizeParaBaixo')
      
      this.elemento.addEventListener('touchstart',(evt)=>{
          let changedTouches = evt.changedTouches[0]
          
          this.elemento.x1 = changedTouches.clientX - this.elemento.offsetLeft
          
          this.elemento.y1 = changedTouches.clientY - this.elemento.offsetTop
          
      })
      
      this.elemento.addEventListener('touchmove',(evt)=>{
         this.elemento.touchmove = true
      })
      
      this.elemento.addEventListener('touchend',(evt)=>{
          if(this.elemento.touchmove){
              let { x1, y1 } = this.elemento
              let changedTouches = evt.changedTouches[0]
          
              let x2 = changedTouches.clientX - this.elemento.offsetLeft
          
              let y2 = changedTouches.clientY - this.elemento.offsetTop
              
              
              let eventoX = x2/.75 > x1 ?
                  deslizeParaDireita : deslizeParaEsquerda
              
              let eventoY = y2/.75 > y1 ?
                  deslizeParaBaixo : deslizeParaCima
              
              this.elemento.dispatchEvent(eventoX)
              this.elemento.dispatchEvent(eventoY)
              
              this.elemento.touchmove = false
              
          }
      })
      
  }
      window.DeslizeJS = DeslizeJS
  })()

