
// Consulta elementos através da função $

var $ = document.querySelector.bind(document)

HTMLElement.prototype.$ = function(sl){
  return this.querySelector(sl)
}


// Cria um método para dicionar eventos nos elementos

HTMLElement.prototype.on = function(type, listener){
 return this.addEventListener(type, listener)
}

// Carrega os dados salvou ou retorna um array

var tarefas = carregarDados('dados-do-app-tarefas', [])
var secao = '' // Navegação


// Salva os dados no nevagador
function salvarDados( chave, dados){
    let json = JSON.stringify(dados)
    return localStorage.setItem(chave, json)
}


// Carrega os dados salvos no navegador
function carregarDados( chave, valor){
    let dadosSalvos = localStorage.getItem(chave)
    let saida = JSON.parse( dadosSalvos ) || valor
    return saida
}


// Modo ativar e dastivar o modo escuro
let root = $(':root')
   
   
let btnDarkMode = $('#btn-darkmode')
    btnDarkMode.on('click', modoEscuro)

// Ativa ou desativa o modo escuro
function modoEscuro(){
     root.classList.toggle('modo-escuro')
     let chaveDeDados = 'modo-escuro-app-tarefas' 
     let estaAtivado  = root.classList.contains('modo-escuro')
     salvarDados(chaveDeDados, estaAtivado)
     carregarModo()
}

// Carrega o modo

function carregarModo() {
    let chaveDeDados    = 'modo-escuro-app-tarefas' 
    let dadosModoEscuro = carregarDados(chaveDeDados, false)
        dadosModoEscuro ? root.classList.add('modo-escuro') : null
    let estaAtivado = root.classList.contains('modo-escuro') 

    let icone = estaAtivado ? 'bx-sun' : 'bx-moon'
        btnDarkMode.className = 'bx '+ icone
}



var btnCriarTarefa = $('button.adicionar')
    btnCriarTarefa.on('click', ()=> criarNovaTarefa())


// ===== Algoritmo para pesquisa =====

let barraDePesquisa = $('.barra-de-pesquisa')
let caixaDePesquisa = barraDePesquisa.$('input')

caixaDePesquisa.on('keyup',(e)=> pesquisar(e.target.value))

function pesquisar( texto ){

  let itensDaLista   =  secao.querySelectorAll('li')
      itensDaLista.forEach((li)=>{
       
         let conteudo = String(li.innerText).trim()
 // Remove os elementos que não correspondem a pesquisa 
            String(conteudo).indexOf(texto) > -1 ?
                    li.style.setProperty('display','flex') :
                    li.style.setProperty('display','none')
             
      })
}


var listaDeTarefas = $('#todas').querySelector('ul')
var ulPendente     = $('#pendente').querySelector('ul')
var ulConcluida    = $('#concluida').querySelector('ul')
// Cria a lista

function criarLista(){
 let ul = listaDeTarefas
     ul.innerHTML = ''
     
         ulPendente.innerHTML = ''
     
         ulConcluida.innerHTML = ''
     
     let arrayTodas = criarItens()
     let arrayPendente = criarItens(false)
     let arrayConcluida = criarItens(true)
      
  function criarItens(booleano){
    let array = tarefas.map((tarefa, i)=>{
           let li = document.createElement('li')
               li.innerHTML = `
                   <label>
                      <input type="checkbox" name="" id="">
                      <p>${tarefa.nome}</p>
                  </label>
                  <div class="ferramentas">
                     <i class="bx bx-pencil" onclick="editarTarefa(${i})"></i>
                     <i class="bx bx-trash-alt" onclick="removerTarefa(${i})"></i>
                  </div>
               `
           
           let checkbox = li.$('input[type=checkbox]')
               checkbox.checked = tarefa.concluida
               checkbox.on('click', (evt)=> concluirTarefa(evt, i))
               
               return booleano === undefined ? li : (tarefa.concluida === booleano ? li : null);
         })
         return array
      }
      
      
      arrayTodas.forEach((li, i)=>{
         listaDeTarefas.appendChild(li)
         adicionarEventos(li, i)
      })
      
      arrayPendente.forEach((li, i)=>{
         li !== null ? (ulPendente.appendChild(li),  adicionarEventos(li, i)) : null
      })
      
      
      arrayConcluida.forEach((li, i)=>{
         li !== null ? (ulConcluida.appendChild(li), adicionarEventos(li, i) ) : null
      })
      
      
}


// Adiciona os eventos dos itens da lista

function adicionarEventos( li, i){

DeslizeJS(li) // Adiciona os eventos de deslize no elemento.

let ul = li.parentElement
let pai = ul.parentElement


 let ferramentas = li.$('.ferramentas')
     
  li.count = 0
  
    li.addEventListener('deslizeParaEsquerda', ()=>{
         li.classList.add('pressionado')
         navigator.vibrate([100, 200])
    })
    
     li.addEventListener('deslizeParaDireita', ()=>{
          li.classList.remove('pressionado')
          navigator.vibrate([100, 200])
     })
     
     li.on('mouseout', ()=>{
          li.classList.remove('pressionado')
          navigator.vibrate([100, 200])
     })
     
     
     li.$('input[type=checkbox]')
        .on('click',()=>{
               setTimeout(()=>{
                  criarLista()
               },300)
     })
     
}

// Salva as alterações ao concluir as tarefas

function concluirTarefa(evt, i){
  let checkbox = evt.target
  let estaMarcado = checkbox.checked
  let item = tarefas[i]
      item.concluida = estaMarcado
      salvarDados('dados-do-app-tarefas', tarefas)
}

/* ====== BARRA DE NAVEGAÇÃO ======*/

function navegacao(){
   let barraDeNevegacao = $('.barra-de-navegacao')
   let itens = barraDeNevegacao.querySelectorAll('li')
   
       itens.forEach((li, i)=>{
           li.on('click',()=>{
             itens.forEach((item, i)=>{
                item.classList.remove('ativo')
                ativarElemento(item)
                preencherIcone(item, i)
             })
             
             li.classList.add('ativo')
              preencherIcone(li, i)
              ativarElemento(li)
              caixaDePesquisa.value = ''
           })
           ativarElemento(li)
           preencherIcone(li, i)
       })
       
       
      function ativarElemento(li){
        let elemento = $(li.dataset.ative)
        
           if( !li.classList.contains('ativo')){
             elemento.style.setProperty('display','none')
          }else{
             elemento.style.setProperty('display','')
             secao = elemento
                
                if( li.dataset.ative === '#sobre'){
                   barraDePesquisa.style.setProperty('display', 'none')
                   btnCriarTarefa.style.setProperty('display','none')
                   
                }else{
                   barraDePesquisa.style.setProperty('display', '')
                   btnCriarTarefa.style.setProperty('display','')
                }
          }
       }
       
       function  preencherIcone(li, i){
          let icones = [
             'collection','hourglass','check-circle','info-circle'
           ]
           
           let elm_i = li.$('i')
           
             if(li.classList.contains('ativo')){
                  elm_i.classList.remove('bx-'+icones[i])
                  elm_i.classList.add('bxs-'+icones[i])
             }else{
              
                  elm_i.classList.add('bx-'+icones[i])
                  elm_i.classList.remove('bxs-'+icones[i])
             }
           
       }
}

navegacao()

function criarNovaTarefa(){
  
  (function criarModal(){
   const modal = document.createElement('section')
         modal.classList.add('modal')
   const dialog = document.createElement('dialog')
         dialog.show() 
         dialog.innerHTML = `
                <h1>Criar <mark>nova tarefa:</mark></h1>
                <form method="dialog" name="novaTarefa">
                    <div class="caixa-de-texto">
                        <label>
                          <input type="text" placeholder="" required>
                          <span>Nome da tarefa</span>
                        </label>
                   </div>
                   <div class="acoes">
                      <button type="button" class="cancelar">Cancelar</button>
                      <button type="submit" class="confirmar">Criar</button>
                        
               </form>      
         `
         modal.appendChild(dialog) 
         document.body.appendChild(modal)
         
         let form = dialog.querySelector('form')
             
             
         let input = form.querySelector('input')
             input.focus()
             
             input.on('blur',()=>{
                 let conteudo = String(input.value).trim()
                 input.value = conteudo
             })
             
         let btnCancelar = form.querySelector('button.cancelar')
             btnCancelar.on('click', ()=> modal.remove())
             
             form.on('submit',()=>{
                 modal.remove()
                 criarTarefa(input.value)
                 salvarTarefa()
                 criarLista()
             })
     })()
     
     function criarTarefa(nome){
        const tarefa = {
            nome : nome,
            concluida: false
        }
        tarefas.push(tarefa)
     }
}

function removerTarefa( indice ){
  
  (function criarModal(){
   const modal = document.createElement('section')
         modal.classList.add('modal')
         modal.classList.add('aviso')
   const dialog = document.createElement('dialog')
         dialog.show() 
         dialog.innerHTML = `
                <h1><mark>Remover </mark>tarefa?</h1>
                <form method="dialog" name="novaTarefa">
                   <p>Tem certeza que deseja remover essa tarefa? <mark>Essa ação não poderá ser desfeita.</mark></p>
                   <div class="acoes">
                      <button type="button" class="cancelar">Cancelar</button>
                      <button type="submit" class="confirmar">remover</button>
                        
               </form>      
         `
         modal.appendChild(dialog) 
         document.body.appendChild(modal)
         
         let form = dialog.querySelector('form')
             
              
         let btnCancelar = form.querySelector('button.cancelar')
             btnCancelar.on('click', ()=> modal.remove())
             
             form.on('submit',()=>{
              tarefas.splice(indice, 1)
                 modal.remove()
                 salvarTarefa()
                 criarLista()
             })
     })()
     
}


function editarTarefa( indice ){
 
  (function criarModal(){
   let tarefa = tarefas[indice]
   
   const modal = document.createElement('section')
         modal.classList.add('modal')
   const dialog = document.createElement('dialog')
         dialog.show() 
         dialog.innerHTML = `
                <h1><mark>Editar </mark> tarefa</h1>
                <form method="dialog" name="novaTarefa">
                    <div class="caixa-de-texto">
                        <label>
                          <input type="text" placeholder="" value="${tarefa.nome}" required>
                          <span>Nome da tarefa</span>
                        </label>
                   </div>
                   <div class="acoes">
                      <button type="button" class="cancelar">Cancelar</button>
                      <button type="submit" class="confirmar">Editar</button>
                        
               </form>      
         `
         modal.appendChild(dialog) 
         document.body.appendChild(modal)
         
         let form = dialog.querySelector('form')
             
             
         let input = form.querySelector('input')
             input.focus()
             
             input.on('blur',()=>{
                 let conteudo = String(input.value).trim()
                 input.value = conteudo
             })
             
         let btnCancelar = form.querySelector('button.cancelar')
             btnCancelar.on('click', ()=> modal.remove())
             
             form.on('submit',()=>{
                 modal.remove()
                 tarefa.nome = input.value
                 salvarTarefa()
                 criarLista()
             })
     })()
      
}



function salvarTarefa(){
   salvarDados('dados-do-app-tarefas', tarefas)
}

window.addEventListener('load',()=>{
    carregarModo()
    criarLista()
    setTimeout(()=>{
       let telaDeAbertura = document.querySelector('.abertura')
           telaDeAbertura.remove()
    }, 1950)
})

