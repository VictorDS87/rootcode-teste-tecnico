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

