# Decisões e premissas

# Primeiro contato
- A primeiro momento foquei mais em analisar o PDF da tarefa do que de fato fazer algo com ele.
- Tiveram alguns pontos que chamaram minha atenção e me deixaram um pouco confuso no PDF, como:
  - ESPORTE_AVENTURA soma a BAGAGEM ou não, a ordem que deveria ser feito o calculo no caso
  - Se o minimo de 5 dias iria obrigar a viajar a durar 5 dias, ou se cobraria os 5 dias apenas
  - O arredondamento, onde exatamente eu precisaria aplicar ele
  - Se fazia sentido manter o Adicional e as Destino dentro do service principal da aplicação, já que parece ter uma logica unica, mais como se o service usasse eles, e não o contrario

- Apesar de ser só o conceito mais basico do uso, já vou iniciar o projeto configurando o docker
- Vou fazer os diferencias na sequencia a medida que forem ser necessários
- Vou dar inicio pelo service principal, como ele é único e basicamente é uns 60 ou 70% do projeto, vou focar em finalizar ele e deixar redondo com os calculos e testes unitarios já prontos, inicialmente vou criar uma rota web pra realizar os testes manualmente, quando estiver retornado como deveria, irei para os teste unitarios

# Como decidi seguir nesse primeiro momento sobre os pontos que não entendi
- Apesar de ter ficado confuso com algumas coisas do PDF, lendo com mais calma percebi que está claro nele a forma como devo seguir
- O ESPORTE_AVENTURA deve ser cobrado antes da bagagem, a bagagem deve ser considerada um serviço a parte e não entrar na soma inicialmente
- O arredondamento é apenas no front end, pro backend vou sempre salvar o valor que retornar
- E vou separar o Adicional e Destino, não vou manter nos services, estou pensando em criar um ENUM dentro do app e deixar o preço deles e a logica isolada, o motivo de criar um ENUM ao invés de um arquivo .php qualquer é só pela praticidade e como fica facil de identificar oq está sendo feito na chamada do ENUM.

# Desenvolvendo o service principal
- Analisando melhor o PDF entendi que não é um problema arredondar, apenas não posso usar valores arredondados pro valor da soma total, então alterei isso
- Mantive a estrutura separada dentro do Service, tendo: 
  - uma função principal chamada calculate, que é responsável por retornar o valor final.
  - uma função auxiliar pra realizar os calculos de cada viajante individualmente.
  - uma função auxiliar que devolve o mulplicador do viajante em questão baseado na idade.
- A ordem do calculo eu acabei seguindo apenas oq estava no PDF. A primeira conta que faço, antes mesmo de rodar a função para calcular os viajantes é a da tarifa_zona * (data_final - data_inicial) + 1. Como o valor dela é fixo para todos os viajantes independente da idade, desconto ou qualquer outra coisa. Eu faço ela na função principal, pra não repetir ela dentro da função auxiliar infinitas vezes sem necessidade. Após isso a segunda conta que faço é o multiplicador, onde pego a idade do viajante e jogo para a função auxiliar responsável por devolver o valor do multiplicador. Dai então eu faço a multiplicação da base(que seria a tarifa * dias) * multiplicador(que vai de 0.5 até 2.0). Na sequencia eu verifico se o viajante tem algum adicional, caso tenha eu sigo o adicionando os valores, com um adendo, o ESPORTE_AVENTURA especificamente é aplicado ANTES da BAGAGEM, então a conta final ficaria assim:
base = Tarifa * (data final - data de inicio) + 1
subtotal = base * multiplicador 
subtotal * PORCENTUAL_ESPORTES_AVENTURA
subtotal + BAGAGEM * ((data final - data de inicio) + 1)

- Criei uma rota web pra testar o valor, vou subir ela junto apenas para manter registrado, mas irei remover no proximo commit

# Testes unitarios
- Vou desenvolver os testes propostos no PDF, sendo 5 no total:
  - 1  Testar casos onde o período da viajem é menor que 5 dias. O intuito desse teste é validar se mesmo em casos onde a viajem vai durar apenas 1 dia, a cobrança está sendo feita por 5 dias
  - 2  Validar se em casos onde o viajante faz aniversario depois da data de inicio, consta a idade correta, que seria idade atual + 1, pois teoricamente na data de inicio da viajem ele ja teria feito aniversario
  - 3  Testar casos onde o cliente não tem a idade minima, ou passou da idade maxima para participar do ESPORTE_AVENTURA, nesse cenario o foco é validar o aviso comunicando
  - 4  Testar se quando tem 5 ou mais viajantes o desconto de grupo é aplicado corretamente
  - 5  Todos os casos acima em um só

- Tentei manter o uso do assertSame na maioria só por ser algo mais direto, com exceção de quando o retorno era do calculo total, nesse caso usei o assertEquals, pra validar se o tipo é o mesmo, além disso em um caso usei o assertEqualsCanonicalizing para comparar os adicionais esperados vs oq retornou, pois com ele não preciso me preocupar com a ordem que veio.
- Optei por usar o #[Test] ao invés de colocar o nome "test" na função
- Fiz os calculos esperados via Calculadora para validar o resultado, como eu já tinha validado os retornos antes de criar os teste unitarios ele passou bem de boa