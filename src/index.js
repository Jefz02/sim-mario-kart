function createCharacters(nome, velocidade, manobrabilidade, poder) {
  return { nome, velocidade, manobrabilidade, poder, pontos: 0 };
}

const characters = [
  createCharacters("Mario", 4, 3, 3),
  createCharacters("Peach", 3, 4, 2),
  createCharacters("Yoshi", 2, 3, 2),
  createCharacters("Bowser", 5, 2, 5),
  createCharacters("Luigi", 3, 4, 4),
  createCharacters("Kong", 2, 2, 5)
];

let player1 = {};
let player2 = {};

function shuffleCharacters() {
  return Math.floor(Math.random() * characters.length);
}

function selectPlayers() {
    player1 = characters[shuffleCharacters()]
    player2 = characters[shuffleCharacters()]
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock(){
    let random = Math.random();
    let result
    switch(true){
        case random < 0.33:
            result = "RETA"
            break;
        case random < 0.66:
            result = "CURVA"
            break;
        default:
            result = "CONFRONTO"
    }
    return result
}

async function logRollResult(characterName, diceResult, block, attribute){
    console.log(
        `${characterName} 🎲 rolou um dado de ${block}: ${diceResult} + ${attribute} = ${diceResult + attribute}`
    );
}

async function playRaceEngine(character1, character2){
    for(let round = 1; round <= 5; round++){
        console.log(`\n🏁 Rodada ${round}`);

        let block = await getRandomBlock();
        console.log(`Bloco: ${block}\n`);

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if(/reta/i.test(block)){
            totalTestSkill1 = diceResult1 + character1.velocidade;
            totalTestSkill2 = diceResult2 + character2.velocidade;

            await logRollResult(
                player1.nome, 
                diceResult1, 
                "Velocidade", 
                player1.velocidade
            );

            await logRollResult(
                player2.nome, 
                diceResult2, 
                "Velocidade", 
                player2.velocidade
            );
        }
        if(/curva/i.test(block)){
            totalTestSkill1 = diceResult1 + character1.manobrabilidade;
            totalTestSkill2 = diceResult2 + character2.manobrabilidade;

            await logRollResult(
                player1.nome, 
                diceResult1, 
                "Manobrabilidade", 
                player1.manobrabilidade
            );

            await logRollResult(
                player2.nome, 
                diceResult2, 
                "Manobrabilidade", 
                player2.manobrabilidade
            );
        }
        if(/confronto/i.test(block)){
            let powerResult1 = diceResult1 + character1.poder;
            let powerResult2 = diceResult2 + character2.poder;

            console.log(`${character1.nome} Confrontou ${character2.nome}🥊\n`)

            await logRollResult(
                player1.nome, 
                diceResult1, 
                "Poder", 
                player1.poder
            );

            await logRollResult(
                player2.nome, 
                diceResult2, 
                "Poder", 
                player2.poder
            );

            if(powerResult1 > powerResult2 && player2.pontos > 0){
                player2.pontos--
                console.log(`\n${character1.nome} venceu o confronto! ${character2.nome} perdeu 1 ponto`)
            } else if(powerResult1 > powerResult2 && player2.pontos === 0){
                console.log(`\n${character1.nome} venceu o confronto! ${character2.nome} continua com 0 pontos`)
            }

            if(powerResult1 < powerResult2 && player1.pontos > 0){
                player1.pontos--
                console.log(`\n${character2.nome} venceu o confronto! ${character1.nome} perdeu 1 ponto`)
            } else if(powerResult1 < powerResult2 && player1.pontos === 0){
                console.log(`\n${character2.nome} venceu o confronto! ${character1.nome} continua com 0 pontos`)
            }

            if (powerResult1 === powerResult2){
                console.log("\nEmpate! Ninguém perde pontos")
            }
        }

        if(totalTestSkill1 > totalTestSkill2){
            console.log(`\n${player1.nome} marcou um ponto`);
            player1.pontos++
        } else if(totalTestSkill1 < totalTestSkill2){
            console.log(`\n${player2.nome} marcou um ponto`);
            player2.pontos++
        }
    }
}

async function declareWinner(character1, character2){
    
    if(character1.pontos > character2.pontos){
        console.log(`\n${character1.nome} Venceu com ${character1.pontos}`)
    } else if(character1.pontos < character2.pontos){
        console.log(`\n${character2.nome} Venceu com ${character2.pontos}`)
    }else {
        console.log(`\nEmpate! Ambos ficaram com ${character1.pontos}`)
    }
}

(async function main(){
    await selectPlayers();

    console.log(`🏁🚨 Corrida entre ${player1.nome} e ${player2.nome} começando... \n`);

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);
})()
