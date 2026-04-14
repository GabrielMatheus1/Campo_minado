const URL = "https://69d5b3bd1c120e733ccd10ff.mockapi.io/V1/pontuacao"

var pontos = 0
var nivelJogoUm = true
var nivelJogoDois = false
var nivelJogoTres = false

function infomacoesCampo(tela) {
    let campo = document.querySelector('.campo_jogo')
    
    if(tela === 1) {
        document.querySelector('#jogador').value = ''
        pontos = 0
        nivelJogo = 1
        
        document.querySelector('.fundo_infos').style.display = "flex"
        campo.style.display = "none"
        document.querySelector('.placar').style.display = "none"
    }
    
    if(tela === 2) {
        document.querySelector('.disabilitado').style.display = 'none'
        pontos = 0
        
        document.querySelector('.fundo_infos').style.display = "none"
        campo.style.display = "flex"
        document.querySelector('.placar').style.display = "none"
        
        document.querySelector('.alerta').style.display = "flex"
        
        setTimeout(function() {
            document.querySelector('.alerta').style.display = "none"
        },3000)
    }
    
    if(tela === 3) {
        document.querySelector('.campo_jogo').style.display = 'none'
        document.querySelector('#pontuacao_jogador').innerText = pontos
        document.querySelector('.placar').style.display = 'flex'
    }
        
}


function usuario() {
    
    var nomeUsuario = document.querySelector('#jogador').value || 'Nome não informado'
    document.querySelector('#nome_jogador').innerText = nomeUsuario
    
    infomacoesCampo(2)
    // começa no nivel 1
    carregaCampo(6,6,6)
    
}








//funcionalidades do jogo
async function tiro(x,y) {
    
    var xy = `#l${x}_c${y}`
    var campoSelecionado = document.querySelector(`${xy}`)

    if(campoSelecionado.textContent === "") {
        
        campoSelecionado.style.background = 'red'
        
        setTimeout(function() {
            exibeBombas()
        },2000)
        
        document.querySelector('.disabilitado').style.display = 'flex'
        
        var userName = document.querySelector('#jogador').value.trim()
        let objUser = {
            nome: (userName || "Não Definido"),
            pontuacao: pontos
        }
        
        await novaPontuacao(objUser)
        
        setTimeout(function() {
            infomacoesCampo(3)
        },6000)
                
    } else {
        
        if(campoSelecionado.style.background == 'green') {
            campoSelecionado.style.background = 'green'
        } else {
            campoSelecionado.style.background = 'green'
            pontos++
            proximoNivel()
        }
        
    }
    
}


async function proximoNivel() {
    let alerta = document.querySelector('.alerta')
    let alertaH4 = document.querySelector('.alerta h4')
    let alertaH5 = document.querySelector('.alerta h5')

    if(pontos === 20) {
        nivelJogoDois = true
        alerta.style.display = "flex"
        alertaH4.innerText = 'Nivel Medio'
        alertaH5.innerText = 'Campo 8x8 cotém 10 BOMBA'
        
        setTimeout(function() {
            alerta.style.display = "none"
            carregaCampo(8,8,10) 
        },3000)
    }
            
    if(pontos === 40 && nivelJogoDois ) {
        nivelJogoDois = false
        nivelJogoTres = true
        
        alerta.style.display = "flex"
        alertaH4.innerText = 'Nivel Dificil'
        alertaH5.innerText = 'Campo 10x10 cotém 15 BOMBA'
        
        setTimeout(function() {
            alerta.style.display = "none"
            carregaCampo(10,10, 15) 
        },3000)
    }
            
    if(pontos === 100){
        var userName = document.querySelector('#jogador').value.trim()
        let objUser = {
            nome: (userName || "Não Definido"),
            pontuacao: pontos
        }
        
        await novaPontuacao(objUser)
        
        infomacoesCampo(3)
        document.querySelector('.placar h4').innerText = 'Pontuação Maxima'

    }
}

function novamente() {
    
    infomacoesCampo(2)
    
    document.querySelector('.alerta').style.display = "flex"
    document.querySelector('.alerta h4').innerText = 'Nivel Facil'
    document.querySelector('.alerta h5').innerText = 'Campo 6x6 cotém 6 BOMBA'
    
    carregaCampo(6,6,6)
    
}

function sairJogo() {
    
    infomacoesCampo(1)

}



//funcionalidades do campo
function carregaCampo(x,y, qtd) {
    
    limparCampo()
    
    let campos = document.querySelector('.campo_jogo')
    campos.style.width = (x * 40) + 'px';
    campos.style.height = (y * 40) + 'px';
    
        for(let l = 1; l <= x; l++) {
            
            for(let c = 1; c <= y; c++){
                let template = `
                  <div class="campo" id="l${l}_c${c}" onclick="tiro(${l}, ${c})">
                    <p></p>
                  </div>`
                campos.innerHTML += template
            }
            
        }
    
   plantarMultBomb(multRandom(qtd, 0, y))
    
}

function multRandom(qtd, min, max) {
    
    var lista = []

    while (lista.length < qtd) {
        var l = Math.ceil(Math.random() * (max - min) + min)
        var c = Math.ceil(Math.random() * (max - min) + min)
        
        var randonBomb = `#l${l}_c${c}`
        
        if (!lista.includes(randonBomb)) {
            lista.push(randonBomb)
        }
    }
    
    return lista
    
}

function plantarMultBomb(lista) {
    
    for(let bomb of lista) {
        let campo = document.querySelector(`${bomb}`)
        campo.innerText = ''
    }
    
}

function exibeBombas(){
    
   var campos = document.querySelectorAll('.campo')
    
    for (let campo of campos) {
        
        if(campo.textContent == '') {
            campo.style.background = 'red'
        }
        
    }
    
}

function limparCampo() {
    var campos = document.querySelectorAll('.campo')
    campos.forEach(divs => {
        divs.remove()
    })
}



// pontuacao top 10
async function melhoresPontuacao() {
    
    let tabela = document.querySelector('#tabela_pontuacao tbody')
    let tabela2 = document.querySelector('#tabela_pontuacao_inicio tbody')
    
    tabela.innerHTML = ""
    tabela2.innerHTML = ""
    
    let req = await fetch(URL)
    let data = await req.json()
    let cont = 1;
    
    let dataOrdenada = data.sort((a, b) => b.score - a.score);
    
    for(let item of dataOrdenada) {
        
        if(cont <= 10) {
            
        let tamplate = `
          <tr>
            <td>${cont}</td>
            <td>${item.name}</td>
            <td>${item.score}</td>
          </tr>`
            
            tabela.innerHTML += tamplate
            tabela2.innerHTML += tamplate
            cont++ 
            
        } else {
           await deletePontuacao(item.id)
        }
        
    }
    
}


async function deletePontuacao(id) {
    
    let req = await fetch(`${URL}/${id}`, { 
        method: 'DELETE' 
    })
    
}


async function novaPontuacao(dados) {
    
    let req = await fetch(URL, {
        method:  'POST',
        headers: {"Content-Type": "application/json"},
        body:    JSON.stringify({name: dados.nome,score: dados.pontuacao})
    })
    
    melhoresPontuacao()
}

melhoresPontuacao()
infomacoesCampo(1)