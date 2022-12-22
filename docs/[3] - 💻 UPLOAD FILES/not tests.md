# 📔 Upload files

## Method
* DELETE

## Cases

### Success (200)
Headers

```bash
Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5c
```

Multipart form data

response
```json
{
  "file": "https://heroku.com.br/myfile.png"
}
```

curl
```bash
curl --location --request DELETE 'http://localhost:3333/post/${postId}/213/'  \
    --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5c" \
```

```tsx
import item from 'test'

type typeItem = {
  name: string
}

interface abc = {
  age: number;
}

export const abc () => {
  return <div>abc</div>
}
```
