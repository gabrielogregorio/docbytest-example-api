# [2]:🔓 Autenticação

Alguns endpoints precisam de autenticação, você pode conseguir uma chave de acesso informando um login e senha válidos.

## Exemplo para obter o token

Você pode obter um token de autorização fazendo uma autorização get ao seguinte endereço

```bash
curl -X POST \
  -H "Content-type: application/json" \
  -d '{"username":"your username","password":"your password"}' \
    'https://algo.com/auth'
```

Um token JWT será retornado, com o id do usuário, use-os para conseguir acesso a endpoints que privados
```json
{
  "token":"token jwt",
  "id":"1713478H2"
}
```
> red # 🚧 Atenção!
> Você precisa de entrar em contado com os [desenvolvedores](https://github.com/gabrielogregorio) informando que deseja ter **acesso blog**, e use com saberia esse acesso!


----

> Sem cor, uma linha!


-----

> sem cor, duas linhas
> Você precisa de entrar em contado com os [desenvolvedores](https://github.com/gabrielogregorio) informando que deseja ter **acesso blog**, e use com saberia esse acesso!

