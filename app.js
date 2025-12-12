var pontos = 0
var nivelJogoUm = true
var nivelJogoDois = false
var nivelJogoTres = false

function infomacoesCampo(tela) {
    
    if(tela === 1) {
        document.querySelector('#jogador').value = ''
        pontos = 0
        nivelJogo = 1
        
        document.querySelector('.fundo_infos').style.display = "flex"
        document.querySelector('.campo_jogo').style.display = "none"
        document.querySelector('.placar').style.display = "none"
    }
    
    if(tela === 2) {
        document.querySelector('.disabilitado').style.display = 'none'
        pontos = 0
        
        document.querySelector('.fundo_infos').style.display = "none"
        document.querySelector('.campo_jogo').style.display = "flex"
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
    carregaCampo(6,6)
    
}


function proximoNivel() {
    
    if(pontos === 35) {
        nivelJogoDois = true
        document.querySelector('.alerta').style.display = "flex"
        document.querySelector('.alerta h4').innerText = 'Nivel Medio'
        document.querySelector('.alerta h5').innerText = 'Campo 8x8 cotém 1 BOMBA'
        
        setTimeout(function() {
            document.querySelector('.alerta').style.display = "none"
            carregaCampo(8,8) 
        },3000)
        
    }
            
    if(pontos === 98 && nivelJogoDois ) {
        nivelJogoDois = false
        nivelJogoTres = true
        
        document.querySelector('.alerta').style.display = "flex"
        document.querySelector('.alerta h4').innerText = 'Nivel Dificil'
        document.querySelector('.alerta h5').innerText = 'Campo 10x10 cotém 1 BOMBA'
        
        setTimeout(function() {
            document.querySelector('.alerta').style.display = "none"
            carregaCampo(10,10) 
        },3000)
        
    }
            
    if(pontos === 197){
        infomacoesCampo(3)
        document.querySelector('.placar h4').innerText = 'Pontuação Maxima'

    }
}


function sairJogo() {
    
    infomacoesCampo(1)
    
}


function novamente() {
    
    infomacoesCampo(2)
    // retorna para o nivel 1
    carregaCampo(6,6)
    
}



function carregaCampo(x,y) {
    
    limparCampo()
    
    let campos = document.querySelector('.campo_jogo')
    campos.style.width = (x * 40)+'px';
    campos.style.height = (y * 40) + 'px';
    
    let dimensaoCampo = [x,y]
    
        for(let l = 1; l <= dimensaoCampo[0]; l++) {
            for(let c = 1; c <= dimensaoCampo[1]; c++){
                let template = `
                <div class="campo" id="l${l}_c${c}" onclick="tiro(${l}, ${c})">
                ${l}, ${c}
                </div>
                `
                campos.innerHTML += template
            }
        }
    
    plantarBomb(random(0,x), random(0,y))
    
}


function tiro(x,y) {
    
    var xy = `#l${x}_c${y}`
    var campoSelecionado = document.querySelector(`${xy}`)

    if(campoSelecionado.textContent == "Bomba") {
        
        campoSelecionado.style.background = 'red'
        document.querySelector('.disabilitado').style.display = 'flex'
        
        setTimeout(function() {
            infomacoesCampo(3)
        },3000)
                
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


function random(min, max) {
    var randonBomb = Math.ceil(Math.random() * (max - min) + min)
    return randonBomb
}



// depois add mais bombas 
function plantarBomb(x, y) {
    var xy = `#l${x}_c${y}`
    var campoSelecionado = document.querySelector(`${xy}`)
    campoSelecionado.textContent = 'Bomba'
    campoSelecionado.style.fontSize = '0px'
}


function limparCampo() {
    var campos = document.querySelectorAll('.campo')
    campos.forEach(divs => {
        divs.remove();
    })
}



infomacoesCampo(1)