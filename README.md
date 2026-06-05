

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

# Controllers, Form request, Modal e Migration
- Iniciei criando o o model + migration via linha de comando, usei os dados que eu retorno hoje do service + destino, data_inicio e data_fim. Que já recebo antes do service e não preciso retornar
- Do front end pretendo receber apenas os dados imutaveis, que são destino, data_inicio, data_fim e as informações dos viajantes, qualquer logica vou manter dentro do backend 
- Criei o Cntroller do Quote dentro de Controllers/api por uma questão de crescimento, e acredito ser o correto a se fazer nas boas praticas, esse Controller especifico não retorna nenhum blade, apenas JSON, além disso em um futuro poderia ser usado por outros sistemas, então acho bom essa separação, mesmo que simples ali
- Apliquei um Request no Store para filtrar oq o front end pode enviar por segurança, também aprovei os ENUMs pra validar se o Destino e os Adicionais enviados estão dentro do esperado
- Após terminar tudo encapsulei o retorno da função index com uma api resource pra deixar o Controller mais limpo, também apliquei ele no store, mas o foco foi o index
- Foi uma decisão que tomei de última hora, mas decidi salvar o json do retorno pra rastreamento de bugs, apenas por segurança, mesmo que isso acabe adicionando um pouco mais de peso ou fique meio redundante
- Fiz os teste na rota usando POSTMAN, tanto para a rota GET quanto para a rota POST

[POST]api/quotes:
req
```
{
  "destino": "EUROPA",
  "data_inicio": "2026-07-10",
  "data_fim": "2026-07-30",
  "viajantes": [
    {
      "nome": "Victor Donizete",
      "data_nascimento": "1990-03-15",
      "adicionais": ["BAGAGEM", "ESPORTES_AVENTURA"]
    },
    {
      "nome": "Victor Pereira",
      "data_nascimento": "1948-11-02",
      "adicionais": ["ESPORTES_AVENTURA", "BAGAGEM"]
    }
  ]
}
```

res
```
{
    "data": {
        "id": 3,
        "destino": "EUROPA",
        "data_inicio": "2026-07-10",
        "data_fim": "2026-07-30",
        "dias_cobrados": 21,
        "viajantes": [
            {
                "nome": "Victor Donizete",
                "idade": 36,
                "subtotal": 640.5,
                "adicionais_aplicados": [
                    "ESPORTES_AVENTURA",
                    "BAGAGEM"
                ]
            },
            {
                "nome": "Victor Pereira",
                "idade": 77,
                "subtotal": 987,
                "adicionais_aplicados": [
                    "BAGAGEM"
                ]
            }
        ],
        "avisos": [
            "ESPORTES_AVENTURA não aplicado para Victor Pereira: fora da faixa etária permitida (18-64)."
        ],
        "desconto_grupo_percentual": 0,
        "total_final": 1627.5,
        "created_at": "2026-06-04T21:13:18+00:00"
    }
}
```

[GET]api/quotes:
res
```
{
    "data": [
        {
            "id": 3,
            "destino": "EUROPA",
            "data_inicio": "2026-07-10",
            "data_fim": "2026-07-30",
            "dias_cobrados": 21,
            "viajantes": [
                {
                    "nome": "Victor Donizete",
                    "idade": 36,
                    "subtotal": 640.5,
                    "adicionais_aplicados": [
                        "ESPORTES_AVENTURA",
                        "BAGAGEM"
                    ]
                },
                {
                    "nome": "Victor Pereira",
                    "idade": 77,
                    "subtotal": 987,
                    "adicionais_aplicados": [
                        "BAGAGEM"
                    ]
                }
            ],
            "avisos": [
                "ESPORTES_AVENTURA não aplicado para Victor Pereira: fora da faixa etária permitida (18-64)."
            ],
            "desconto_grupo_percentual": 0,
            "total_final": 1627.5,
            "created_at": "2026-06-04T21:13:18+00:00"
        },
        {
            "id": 2,
            "destino": "EUROPA",
            "data_inicio": "2026-07-10",
            "data_fim": "2026-07-30",
            "dias_cobrados": 21,
            "viajantes": [
                {
                    "nome": "Ana",
                    "idade": 36,
                    "subtotal": 640.5,
                    "adicionais_aplicados": [
                        "ESPORTES_AVENTURA",
                        "BAGAGEM"
                    ]
                },
                {
                    "nome": "João",
                    "idade": 77,
                    "subtotal": 987,
                    "adicionais_aplicados": [
                        "BAGAGEM"
                    ]
                }
            ],
            "avisos": [
                "ESPORTES_AVENTURA não aplicado para João: fora da faixa etária permitida (18-64)."
            ],
            "desconto_grupo_percentual": 0,
            "total_final": 1627.5,
            "created_at": "2026-06-04T20:28:30+00:00"
        },
        ...
```

# Views com React, typescript e tailwind

- Até agora eu não tinha mexido no react da aplicação, só tinha deixado ele previamente ambientado, o processo aqui é relativamente simples, provavelmente a parte que vai me demandar mais tempo vai ser criar o Store com zustand.
- Adicionei o Vite como um container único dentro do docker, pra ele ter acesso ao sistema, e também pra não ficar precisando rodar npm run dev toda hora.
- Comecei definindo a tipagem que usaria no front end, completamente baseado no que espero receber no backend, e pensando em um cenario onde eu vou ter o formulario principal para novos usuarios, que vai receber as informações da rota, e vai voltar um array de viajantes. Um campo que vai receber o retorno do controller com o preço total, desconto, avisos etc. Por fim um campo que vai receber todas as informações da viagem para ser exibido em uma lista
- Após criar a tipagem criei um arquivo pra ficar responsavel pelas chamadas a API, que nesse caso é só da quote, mas ele ficou responsavel tanto pelo GET quanto pelo POST
- Criei o contexto global com o zustand e pra jogar quase toda logica dentro dele pra evitar de manter o arquivo tsx com muita logica
- Comecei a criar os componentes, aqui eu usei IA pra criar boa parte da estrutura e estilo dos componentes que eram mais previsiveis.
- Joguei toda logica feita pra dentro do Zustand e comecei a passar ela via contexto para os componentes
- Com isso o projeto está 100% feito

