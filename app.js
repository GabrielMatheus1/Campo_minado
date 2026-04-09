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
    carregaCampo(6,6,6)
    
}


function proximoNivel() {
    
    if(pontos === 20) {
        nivelJogoDois = true
        document.querySelector('.alerta').style.display = "flex"
        document.querySelector('.alerta h4').innerText = 'Nivel Medio'
        document.querySelector('.alerta h5').innerText = 'Campo 8x8 cotém 10 BOMBA'
        
        setTimeout(function() {
            document.querySelector('.alerta').style.display = "none"
            carregaCampo(8,8,10) 
        },3000)
        
    }
            
    if(pontos === 60 && nivelJogoDois ) {
        nivelJogoDois = false
        nivelJogoTres = true
        
        document.querySelector('.alerta').style.display = "flex"
        document.querySelector('.alerta h4').innerText = 'Nivel Dificil'
        document.querySelector('.alerta h5').innerText = 'Campo 10x10 cotém 15 BOMBA'
        
        setTimeout(function() {
            document.querySelector('.alerta').style.display = "none"
            carregaCampo(10,10, 15) 
        },3000)
        
    }
            
    if(pontos === 100){
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
    document.querySelector('.alerta').style.display = "flex"
    document.querySelector('.alerta h4').innerText = 'Nivel Facil'
    document.querySelector('.alerta h5').innerText = 'Campo 6x6 cotém 6 BOMBA'
    
    carregaCampo(6,6,6)
    
}

var mapa = []

function carregaCampo(x,y, qtd) {
    
    limparCampo()
    
    let campos = document.querySelector('.campo_jogo')
    campos.style.width = (x * 40)+'px';
    campos.style.height = (y * 40) + 'px';
    
    let dimensaoCampo = [x,y]
    
        for(let l = 1; l <= dimensaoCampo[0]; l++) {
            var linha = []
            for(let c = 1; c <= dimensaoCampo[1]; c++){
                let template = `
                <div class="campo" id="l${l}_c${c}" onclick="tiro(${l}, ${c})">
                ${l}, ${c}
                </div>
                `
                campos.innerHTML += template
                linha.push(dimensaoCampo)
                //console.log(linha)
            }
        }
    
    
    plantarMultBomb(multRandom(qtd, 0, y))
}


async function tiro(x,y) {
    
    var xy = `#l${x}_c${y}`
    var campoSelecionado = document.querySelector(`${xy}`)

    if(campoSelecionado.textContent == "") {
        
        campoSelecionado.style.background = 'red'
        document.querySelector('.disabilitado').style.display = 'flex'
        
        var userName = document.querySelector('#jogador').value.trim()
  
        let objUser = {
            nome: (userName || "Não Definido"),
            pontuacao: pontos
        }
        
        await novaPontuacao(objUser)
        
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


function limparCampo() {
    var campos = document.querySelectorAll('.campo')
    campos.forEach(divs => {
        divs.remove();
    })
}


function multRandom(qtd, min, max) {
    var lista = []

    while (lista.length < qtd) {
        var l = Math.ceil(Math.random() * (max - min) + min)
        var c = Math.ceil(Math.random() * (max - min) + min)
        
        var randonBomb = `#l${l}_c${c}`
        if (!lista.includes(randonBomb)) {
            lista.push(randonBomb);
        }
    }
    return lista;
}


function plantarMultBomb(lista) {
    
    for(let bomb of lista) {
        
        var campoSelecionado = document.querySelector(`${bomb}`)
        campoSelecionado.innerText = ''
        campoSelecionado.style.fontSize = '0px'
    }
}


async function melhoresPontuacao() {
    let URL = "https://69d5b3bd1c120e733ccd10ff.mockapi.io/V1/pontuacao"
    let tabelaPontuacao = document.querySelector('#tabela_pontuacao tbody')
    let tabelaPontuacao2 = document.querySelector('#tabela_pontuacao_inicio tbody')
    
    tabelaPontuacao.innerHTML = ""
    tabelaPontuacao2.innerHTML = ""
    
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
          </tr>
        `
            
            tabelaPontuacao.innerHTML += tamplate
            tabelaPontuacao2.innerHTML += tamplate
            cont++ 
        } else {
            deletePontuacao(item.id)
        }
        
    }
    
}

async function deletePontuacao(id) {
    let URL = "https://69d5b3bd1c120e733ccd10ff.mockapi.io/V1/pontuacao/"+id
    let req = await fetch(URL, {
        method: 'DELETE'
    })
}


async function novaPontuacao(dados) {
    
    let objEnv = {
        name: dados.nome,
        score: dados.pontuacao
    }
    
    let URL = "https://69d5b3bd1c120e733ccd10ff.mockapi.io/V1/pontuacao"
    let req = await fetch(URL, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(objEnv)
    })
    
    melhoresPontuacao()
}


infomacoesCampo(1)
melhoresPontuacao()