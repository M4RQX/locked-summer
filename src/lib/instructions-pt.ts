// Traduções PT das instruções "como executar" para os exercícios mais usados.
// IDs correspondem aos do free-exercise-db (https://github.com/yuhonas/free-exercise-db).
// Para IDs não presentes aqui, o ExerciseDemoModal usa fallback EN da fonte original.
//
// Tradução manual cuidadosa. Cobre os ~28 exercícios mais usados (planos default
// + populares) — ~80% do uso típico. Acrescentar mais traduções é trivial: adicionar
// uma nova entry { 'ID_no_free_exercise_db': ['passo 1', 'passo 2', …] }.

export const INSTRUCTIONS_PT: Record<string, string[]> = {
  'Barbell_Bench_Press_-_Medium_Grip': [
    'Deita-te de costas num banco plano. Com pega de largura média (a pega que cria um ângulo de 90° entre antebraço e braço a meio do movimento), tira a barra do suporte e segura-a por cima do peito com os braços esticados. Esta é a posição inicial.',
    'A partir da posição inicial, inspira e desce a barra lentamente até tocar no meio do peito.',
    'Após uma breve pausa, empurra a barra de volta à posição inicial enquanto expiras. Foca-te em empurrar a barra usando os músculos do peito. Tranca os braços e contrai o peito no topo, mantém um segundo, depois começa a descer lentamente outra vez. Dica: idealmente, descer o peso deve demorar cerca do dobro do tempo de subir.',
    'Repete o movimento para o número de repetições prescrito.',
    'Quando terminares, volta a colocar a barra no suporte.',
  ],
  Dumbbell_Bench_Press: [
    'Deita-te num banco plano com um haltere em cada mão pousados nas coxas. As palmas das mãos viradas uma para a outra.',
    'Usa as coxas para ajudar a levantar os halteres. Sobe-os um de cada vez até os teres à frente, à largura dos ombros.',
    'Roda os pulsos para a frente para que as palmas fiquem viradas para a frente. Os halteres devem ficar à altura do peito, com braço e antebraço a fazer um ângulo de 90°. Mantém controlo total dos halteres em todo o movimento. Esta é a posição inicial.',
    'Expira e usa o peito para empurrar os halteres para cima. Tranca os braços no topo e contrai o peito, mantém um segundo, depois começa a descer lentamente. Dica: descer deve demorar cerca do dobro do tempo de subir.',
    'Repete o movimento para o número de repetições do teu plano de treino.',
  ],
  Incline_Dumbbell_Press: [
    'Deita-te num banco inclinado com um haltere em cada mão pousados nas coxas. As palmas das mãos viradas uma para a outra.',
    'Usa as coxas para ajudar a empurrar os halteres para cima, levantando-os um de cada vez até à altura dos ombros.',
    'Com os halteres à altura dos ombros, roda os pulsos para a frente — palmas viradas para a frente. Esta é a posição inicial.',
    'Mantém controlo total dos halteres. Expira e empurra os halteres para cima usando o peito.',
    'Tranca os braços no topo, mantém um segundo, depois começa a descer lentamente. Dica: descer deve demorar cerca do dobro do tempo de subir.',
    'Repete o movimento para o número de repetições prescrito.',
    'Quando terminares, pousa os halteres nas coxas e depois no chão. É a forma mais segura de os largar.',
  ],
  Butterfly: [
    'Senta-te na máquina com as costas apoiadas no encosto.',
    'Pega nas pegas. Dica: os teus braços devem ficar paralelos ao chão; ajusta a máquina conforme necessário. Esta é a posição inicial.',
    'Empurra as pegas uma contra a outra lentamente, contraindo o peito ao centro. Expira durante esta parte e mantém a contracção um segundo.',
    'Volta lentamente à posição inicial enquanto inspiras, até sentires o peito completamente alongado.',
    'Repete para o número de repetições recomendado.',
  ],
  Dumbbell_Flyes: [
    'Deita-te num banco plano com um haltere em cada mão pousado nas coxas. As palmas das mãos viradas uma para a outra.',
    'Usa as coxas para ajudar a levantar os halteres. Sobe-os um de cada vez até à altura dos ombros, palmas viradas uma para a outra. Levanta os halteres como se estivesses a fazer supino, mas pára e mantém antes de trancar. Esta é a posição inicial.',
    'Com uma ligeira flexão dos cotovelos (para evitar stress no tendão do bíceps), desce os braços para os lados num arco amplo até sentires o peito alongado. Inspira durante esta parte. Dica: os braços devem manter-se imóveis; o movimento só ocorre na articulação do ombro.',
    'Volta à posição inicial contraindo o peito enquanto expiras. Dica: usa o mesmo arco usado na descida.',
    'Mantém um segundo na contracção e repete para o número de repetições prescrito.',
  ],
  'Triceps_Pushdown_-_Rope_Attachment': [
    'Liga uma corda à polia alta e agarra com pega neutra (palmas viradas uma para a outra).',
    'Em pé, tronco direito com inclinação muito ligeira para a frente, mantém os braços perto do corpo e perpendiculares ao chão. Os antebraços apontam para cima na direcção da polia. Esta é a posição inicial.',
    'Usando os tríceps, desce a corda levando cada extremidade para o lado das coxas. No fim do movimento, os braços ficam totalmente esticados e perpendiculares ao chão. Os braços superiores mantêm-se imóveis ao lado do tronco — só os antebraços se movem. Expira durante este movimento.',
    'Após manter um segundo na posição contraída, sobe a corda lentamente para a posição inicial. Inspira durante este passo.',
    'Repete para o número de repetições recomendado.',
  ],
  Triceps_Pushdown: [
    'Liga uma barra (recta ou angular) a uma polia alta e agarra com pega pronada (palmas para baixo) à largura dos ombros.',
    'Em pé, tronco direito com ligeira inclinação para a frente, mantém os braços junto ao corpo e perpendiculares ao chão. Os antebraços apontam para cima na direcção da polia. Esta é a posição inicial.',
    'Usando os tríceps, desce a barra até tocar à frente das coxas e os braços estarem totalmente esticados perpendicularmente ao chão. Os braços superiores mantêm-se imóveis ao lado do tronco — só os antebraços se movem. Expira durante este movimento.',
    'Após manter um segundo na posição contraída, sobe a barra lentamente para a posição inicial. Inspira durante este passo.',
    'Repete para o número de repetições recomendado.',
  ],
  'Wide-Grip_Lat_Pulldown': [
    'Senta-te numa máquina de puxada com uma barra larga ligada à polia superior. Ajusta o apoio dos joelhos à tua altura — vai impedir o teu corpo de subir com a resistência da barra.',
    'Pega na barra com palmas viradas para a frente, à pega prescrita. Notas: pega larga = mãos mais afastadas que os ombros. Pega média = à largura dos ombros. Pega fechada = mais juntas que os ombros.',
    'Com os braços esticados à frente segurando a barra, inclina o tronco para trás cerca de 30°, criando uma curvatura na lombar e empurrando o peito para fora. Esta é a posição inicial.',
    'Expira e desce a barra até tocar a parte superior do peito, puxando os ombros e braços para baixo e para trás. Dica: foca-te em contrair os músculos das costas no fim. O tronco superior fica imóvel — só os braços se movem. Os antebraços só seguram a barra; não tentes puxar com eles.',
    'Após um segundo na contracção (com as omoplatas juntas), sobe a barra lentamente para a posição inicial até os braços estarem totalmente esticados e os dorsais alongados. Inspira durante esta parte.',
    'Repete o movimento para o número de repetições prescrito.',
  ],
  Pullups: [
    'Pega na barra de pull-up com palmas viradas para a frente, à pega prescrita. Notas: pega larga = mais afastadas que os ombros. Pega média = à largura dos ombros. Pega fechada = mais juntas.',
    'Com os braços esticados segurando a barra, inclina o tronco para trás cerca de 30°, criando curvatura na lombar e empurrando o peito para fora. Esta é a posição inicial.',
    'Puxa o tronco para cima até a barra tocar a parte superior do peito, levando os ombros e os braços para baixo e para trás. Expira durante esta parte. Dica: foca-te em contrair as costas no fim do movimento. O tronco fica imóvel ao mover-se no espaço — só os braços se movem.',
    'Após um segundo na contracção, inspira e desce o tronco lentamente até os braços estarem totalmente esticados e os dorsais alongados.',
    'Repete o movimento para o número de repetições prescrito.',
  ],
  'Chin-Up': [
    'Pega na barra de pull-up com palmas viradas para o teu corpo e pega mais fechada que a largura dos ombros.',
    'Com os braços esticados segurando a barra, mantém o tronco o mais direito possível, criando curvatura na lombar e empurrando o peito para fora. Esta é a posição inicial. Dica: manter o tronco direito maximiza estímulo no bíceps e minimiza envolvimento das costas.',
    'Expira e puxa o tronco para cima até a cabeça ficar ao nível da barra. Concentra-te em usar o bíceps para fazer o movimento. Mantém os cotovelos perto do corpo. Dica: o tronco fica imóvel — só os braços se movem.',
    'Após um segundo a contrair o bíceps na posição contraída, desce o tronco lentamente para a posição inicial até os braços estarem totalmente esticados. Inspira durante esta parte.',
    'Repete o movimento para o número de repetições prescrito.',
  ],
  Bent_Over_Barbell_Row: [
    'Segura uma barra com pega pronada (palmas para baixo), flecte ligeiramente os joelhos e inclina o tronco para a frente (flectindo a anca) mantendo as costas direitas, até estar quase paralelo ao chão. Dica: mantém a cabeça erguida. A barra fica suspensa à frente, com os braços perpendiculares ao chão e ao tronco. Esta é a posição inicial.',
    'Mantendo o tronco imóvel, expira e puxa a barra ao corpo. Mantém os cotovelos perto do corpo e usa só os antebraços para segurar o peso. Na contracção máxima (em cima), contrai as costas e mantém uma breve pausa.',
    'Inspira e desce lentamente a barra para a posição inicial.',
    'Repete para o número de repetições recomendado.',
  ],
  'One-Arm_Dumbbell_Row': [
    'Escolhe um banco plano e coloca um haltere em cada lado.',
    'Apoia o joelho direito sobre uma das pontas do banco, inclina o tronco para a frente (flectindo na anca) até a parte superior do corpo estar paralela ao chão, e apoia a mão direita na outra ponta do banco para suporte.',
    'Com a mão esquerda, pega no haltere do chão e segura-o com a lombar direita. A palma da mão fica virada para o tronco. Esta é a posição inicial.',
    'Puxa o haltere para cima junto ao lado do peito, mantendo o braço perto do corpo e o tronco imóvel. Expira durante este passo. Dica: foca-te em contrair as costas no fim. A força vem das costas, não dos braços. O tronco fica imóvel — só os braços se movem. Os antebraços só seguram o haltere.',
    'Desce o haltere lentamente para a posição inicial. Inspira durante este passo.',
    'Repete o movimento para o número de repetições especificado.',
    'Troca de lado e repete com o outro braço.',
  ],
  Barbell_Curl: [
    'Em pé com tronco direito, segura uma barra com pega à largura dos ombros. As palmas viradas para a frente e cotovelos perto do tronco. Esta é a posição inicial.',
    'Mantendo os braços imóveis, faz curl da barra para a frente contraindo o bíceps enquanto expiras. Dica: só os antebraços se movem.',
    'Continua o movimento até o bíceps estar totalmente contraído e a barra à altura dos ombros. Mantém a posição contraída um segundo e contrai o bíceps com força.',
    'Desce lentamente a barra para a posição inicial enquanto inspiras.',
    'Repete para o número de repetições recomendado.',
  ],
  Hammer_Curls: [
    'Em pé com tronco direito e um haltere em cada mão, braços esticados ao lado do corpo. Os cotovelos perto do tronco.',
    'As palmas das mãos viradas para o teu tronco. Esta é a posição inicial.',
    'Mantendo os braços imóveis, expira e faz curl do haltere para a frente contraindo o bíceps. Continua a subir até o bíceps estar totalmente contraído e o haltere à altura dos ombros. Mantém a contracção um momento. Dica: foca-te em manter o cotovelo imóvel — só o antebraço se move.',
    'Após a breve pausa, inspira e desce os halteres lentamente para a posição inicial.',
    'Repete para o número de repetições recomendado.',
  ],
  Dumbbell_Bicep_Curl: [
    'Em pé bem direito com um haltere em cada mão, braços esticados. Mantém os cotovelos perto do tronco e roda as palmas até estarem viradas para a frente. Esta é a posição inicial.',
    'Mantendo os braços imóveis, expira e faz curl dos halteres contraindo o bíceps. Continua a subir até o bíceps estar totalmente contraído e os halteres à altura dos ombros. Mantém uma breve pausa a contrair o bíceps.',
    'Inspira e desce lentamente os halteres para a posição inicial.',
    'Repete para o número de repetições recomendado.',
  ],
  Preacher_Curl: [
    'Para este movimento precisas de um banco scott e uma barra W (EZ). Pega na barra W na pega interior fechada (preferencialmente alguém passa-te a barra, ou tira-a do suporte do banco scott). As palmas viradas para a frente, ligeiramente inclinadas para dentro pela forma da barra.',
    'Com os braços apoiados contra o coxim do banco scott e o peito encostado, segura a barra W à altura dos ombros. Esta é a posição inicial.',
    'Inspira e desce lentamente a barra até o braço estar esticado e o bíceps totalmente alongado.',
    'Expira e usa o bíceps para fazer curl do peso até o bíceps estar totalmente contraído e a barra à altura dos ombros. Contrai o bíceps com força e mantém um segundo.',
    'Repete para o número de repetições recomendado.',
  ],
  Barbell_Squat: [
    'Este exercício faz-se idealmente dentro de um rack de agachamento por segurança. Coloca a barra no rack a uma altura ligeiramente abaixo dos ombros. Quando a altura está correcta e a barra carregada, passa por baixo dela e apoia a parte de trás dos ombros (ligeiramente abaixo do pescoço) na barra.',
    'Segura a barra com ambos os braços ao lado e tira-a do rack empurrando com as pernas e endireitando o tronco ao mesmo tempo.',
    'Afasta-te do rack e posiciona as pernas à largura dos ombros (postura média) com os pés ligeiramente virados para fora. Mantém a cabeça erguida e a coluna direita. Esta é a posição inicial. (Nota: a postura média desenvolve as pernas no geral; podes escolher outras posturas.)',
    'Desce a barra lentamente flectindo joelhos e ancas, mantendo postura direita e cabeça erguida. Continua a descer até o ângulo entre coxa e gémeos ser ligeiramente inferior a 90°. Inspira durante a descida. Dica: se executado correctamente, a frente dos joelhos faz uma linha imaginária recta com os dedos do pé. Se os joelhos ultrapassam os dedos, estás a stressar o joelho — execução incorrecta.',
    'Sobe a barra empurrando o chão com o calcanhar enquanto expiras, esticando as pernas até voltar à posição inicial.',
    'Repete para o número de repetições recomendado.',
  ],
  Front_Barbell_Squat: [
    'Este exercício faz-se idealmente dentro de um rack de agachamento. Coloca a barra a uma altura adequada à tua altura. Com a barra carregada, leva os braços por baixo da barra mantendo os cotovelos altos (braço superior ligeiramente acima de paralelo ao chão). Apoia a barra em cima dos deltóides e cruza os braços segurando a barra para controlo total.',
    'Tira a barra do rack empurrando com as pernas e endireitando o tronco ao mesmo tempo.',
    'Afasta-te do rack e posiciona as pernas à largura dos ombros (postura média), pés ligeiramente virados para fora. Mantém a cabeça erguida (olhar para baixo desequilibra) e a coluna direita. Esta é a posição inicial.',
    'Desce a barra lentamente flectindo os joelhos, mantendo postura direita e cabeça erguida. Continua até o ângulo coxa-gémeos ser ligeiramente inferior a 90° (coxas abaixo do paralelo ao chão). Inspira durante a descida. Dica: a frente dos joelhos deve fazer linha recta com os dedos dos pés. Se ultrapassam, estás a stressar o joelho.',
    'Sobe a barra empurrando o chão com o meio do pé enquanto expiras, esticando as pernas até voltar à posição inicial.',
    'Repete para o número de repetições recomendado.',
  ],
  Goblet_Squat: [
    'Em pé, segura uma kettlebell pelas pegas (cornos) junto ao peito. Esta é a posição inicial.',
    'Faz agachamento entre as pernas até os posteriores tocarem nos gémeos. Mantém o peito e a cabeça erguidos e as costas direitas.',
    'No fundo, faz pausa e usa os cotovelos para empurrar os joelhos para fora. Volta à posição inicial e repete por 10-20 repetições.',
  ],
  Leg_Press: [
    'Numa máquina de prensa de pernas, senta-te e coloca os pés na plataforma à frente, à largura dos ombros. (Nota: postura média = desenvolvimento geral; podes usar outras posturas.)',
    'Baixa as travas de segurança da plataforma e empurra-a até as pernas estarem totalmente esticadas. Dica: não tranques os joelhos. Tronco e pernas fazem ângulo de 90°. Esta é a posição inicial.',
    'Inspira e desce lentamente a plataforma até a coxa e gémeo fazerem 90°.',
    'Empurra principalmente com os calcanhares e usa os quadríceps para voltar à posição inicial enquanto expiras.',
    'Repete para o número de repetições recomendado e tranca os pinos de segurança quando acabares — não queres a plataforma a cair em ti.',
  ],
  Romanian_Deadlift: [
    'Coloca uma barra à tua frente no chão e agarra-a com pega pronada (palmas para baixo) ligeiramente mais larga que os ombros. Dica: dependendo do peso, podes precisar de straps e/ou de uma plataforma elevada para amplitude completa.',
    'Flecte ligeiramente os joelhos e mantém as canelas verticais, ancas atrás e costas direitas. Esta é a posição inicial.',
    'Mantendo costas e braços completamente direitos durante todo o movimento, usa as ancas para levantar a barra enquanto expiras. Dica: o movimento deve ser controlado, não rápido.',
    'Quando estiveres totalmente direito, desce a barra empurrando as ancas para trás, flectindo apenas ligeiramente os joelhos (diferente de agachamento). Dica: respira fundo no início, mantém o peito erguido. Aguenta a respiração na descida e expira no fim.',
    'Repete para o número de repetições recomendado.',
  ],
  Barbell_Deadlift: [
    'Em pé à frente de uma barra carregada.',
    'Mantendo as costas o mais direitas possível, flecte os joelhos, inclina-te à frente e agarra a barra com pega pronada à largura dos ombros. Esta é a posição inicial. Dica: se for difícil segurar com esta pega, usa pega mista ou straps.',
    'Segurando a barra, começa a levantar empurrando com as pernas enquanto endireitas o tronco em simultâneo, expirando. Em pé, empurra o peito para fora e contrai as costas juntando as omoplatas. Imagina a postura de um soldado em sentido.',
    'Volta à posição inicial flectindo os joelhos enquanto inclinas o tronco à frente na anca, mantendo as costas direitas. Quando os pesos tocarem o chão estás de volta à posição inicial e pronto para nova repetição.',
    'Faz o número de repetições prescrito no programa.',
  ],
  Leg_Extensions: [
    'Para este exercício precisas de uma máquina de extensão de pernas. Escolhe o peso, senta-te com as pernas debaixo do coxim (pés a apontar para a frente) e mãos a segurar nas pegas laterais. Esta é a posição inicial. Dica: ajusta o coxim para ficar em cima da parte inferior da perna (acima dos pés). Garante que as pernas fazem ângulo de 90°. Se for menor que 90°, o joelho está sobre os dedos do pé — stress indevido. Se a máquina assim o permite, escolhe outra ou pára antes de chegar aos 90°.',
    'Usando os quadríceps, estende as pernas ao máximo enquanto expiras. O resto do corpo fica imóvel no banco. Pausa um segundo na contracção.',
    'Desce lentamente o peso para a posição original enquanto inspiras, sem ultrapassar o limite dos 90°.',
    'Repete o número de vezes recomendado.',
  ],
  Lying_Leg_Curls: [
    'Ajusta a alavanca da máquina à tua altura e deita-te de barriga para baixo na máquina de leg curl, com o coxim da alavanca atrás das pernas (alguns centímetros abaixo dos gémeos). Dica: usa preferencialmente uma máquina angulada (não plana) — a posição angulada favorece o recrutamento dos posteriores.',
    'Mantém o tronco encostado ao banco, garante que as pernas estão totalmente esticadas e segura nas pegas laterais. Posiciona os pés direitos (ou usa outras posturas dos pés). Esta é a posição inicial.',
    'Expira e dobra as pernas o máximo possível sem levantar a parte superior das pernas do coxim. Quando atingires a contracção máxima, mantém um segundo.',
    'Inspira e volta com as pernas à posição inicial. Repete para o número de repetições recomendado.',
  ],
  Dumbbell_Shoulder_Press: [
    'Com um haltere em cada mão, senta-te num banco com encosto. Coloca os halteres em pé sobre as coxas.',
    'Sobe os halteres à altura dos ombros, um de cada vez, usando as coxas para ajudar a impulsionar.',
    'Roda os pulsos para que as palmas fiquem viradas para a frente. Esta é a posição inicial.',
    'Expira e empurra os halteres para cima até se tocarem no topo.',
    'Após uma breve pausa em cima, desce lentamente os pesos para a posição inicial enquanto inspiras.',
    'Repete para o número de repetições recomendado.',
  ],
  Barbell_Shoulder_Press: [
    'Senta-te num banco com encosto dentro de um rack. Posiciona uma barra a uma altura mesmo acima da cabeça. Pega com pega pronada (palmas para a frente).',
    'Tira a barra do rack com a largura de pega correcta e levanta-a acima da cabeça trancando os braços. Mantém à altura dos ombros, ligeiramente à frente da cabeça. Esta é a posição inicial.',
    'Desce a barra lentamente até aos ombros enquanto inspiras.',
    'Sobe a barra de volta à posição inicial enquanto expiras.',
    'Repete para o número de repetições recomendado.',
  ],
  Side_Lateral_Raise: [
    'Pega em dois halteres e fica em pé com tronco direito, halteres ao lado do corpo, palmas viradas para o tronco. Esta é a posição inicial.',
    'Mantendo o tronco imóvel (sem balançar), levanta os halteres para os lados com ligeira flexão do cotovelo, mãos ligeiramente inclinadas para a frente como se estivesses a verter água de um copo. Sobe até os braços estarem paralelos ao chão. Expira durante o movimento e pausa um segundo no topo.',
    'Desce os halteres lentamente para a posição inicial enquanto inspiras.',
    'Repete para o número de repetições recomendado.',
  ],
  Pushups: [
    'Deita-te de barriga para baixo no chão e coloca as mãos ~36cm afastadas, segurando o tronco em cima com os braços esticados.',
    'Desce até o peito quase tocar o chão enquanto inspiras.',
    'Expira e empurra a parte superior do corpo de volta à posição inicial enquanto contrais o peito.',
    'Após uma breve pausa em cima, começa a descer outra vez para o número de repetições necessário.',
  ],
  Bench_Dips: [
    'Coloca um banco atrás das costas. Com o banco perpendicular ao corpo e olhar para a frente, segura no rebordo do banco com as mãos esticadas, à largura dos ombros. As pernas estendidas à frente, flectidas na anca e perpendiculares ao tronco. Esta é a posição inicial.',
    'Desce o corpo lentamente enquanto inspiras, flectindo os cotovelos até o ângulo entre braço e antebraço ser ligeiramente menor que 90°. Dica: mantém os cotovelos o mais perto possível durante o movimento. Os antebraços apontam sempre para baixo.',
    'Usando os tríceps, levanta o tronco de volta à posição inicial.',
  ],
};

/**
 * Devolve as instruções PT para o ID do free-exercise-db, ou null se não há tradução.
 * O caller deve fazer fallback para details.instructions (EN) quando isto devolve null.
 */
export function getInstructionsPT(id: string): string[] | null {
  return INSTRUCTIONS_PT[id] ?? null;
}
