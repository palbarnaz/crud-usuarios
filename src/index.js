import express from 'express';
import jwt from "jsonwebtoken";
const app = express();
app.use(express.json());



let verificaJWT = function (request, response, next){
  const body = request.body
 
  jwt.verify(body.accessToken, "growdev", (err, user) => {
    // O erro é gerado independente do motivo da invalidação
    if (err) {
      return response.status(403).json(err);
    }

    request.user = user;

    next();
  });

}





let users = [
  {
    name: 'paola',
    email: 'paola@silva',
    password: '123',
    skills: []
  },
  {
    name: 'joao',
    email: 'joao@silva',
    password: '123',
    skills: []
  },
  {
    name: 'maria',
    email: 'maria@silva',
    password: '123',
    skills: []
  }
]


// o usuario vai ter: 
// - name
// -email
// -password 
// - skills = array 


app.get('/users', (request, response) => {
  return response.json(users);

});


// método para criar usuario 
app.post('/users', (request, response) => {
  let infoRequest = request.body;

  if (infoRequest.name === undefined) {
    return response.status(400).json("nome não informado!")
  }

  if (infoRequest.email === undefined) {
    return response.status(400).json("e-mail não informado!")
  }

  if (infoRequest.password === undefined) {
    return response.status(400).json("senha não informada!")
  }


  // regra 
  // Não pode ter mais de um usuário com o mesmo e-mail
  // ()=>{
  //   logica
  // }

  // function(){
  //   logica
  // }
  const existeUsuario = users.find((usuarioAtual) => {
    return usuarioAtual.email === infoRequest.email
  })


  if (existeUsuario) {
    return response.status(400).json("e-mail já cadastrado!")
  }

  let newUser = {
    name: infoRequest.name,
    email: infoRequest.email,
    password: infoRequest.password,
    skills: []
  }

  users.push(newUser)

  return response.status(201).json(newUser);

});


// rota para cadastrar uma skill de um usuario 
// users[2].skills.push(novaSkill)
app.post('/users/skills/:email', verificaJWT , (request, response) => {
  let infoRequest = request.body;
  const parametroEmail = request.params.email

  const buscarIndice = users.findIndex((usuario) => usuario.email == parametroEmail)

  if(buscarIndice == -1){
    return response.json("usuario não encontrado")
  }

    const usuario = users[buscarIndice] 

    usuario.skills.push(infoRequest.skills)

    return response.status(201).json(usuario)

})

app.post('/users/login', (request, response)=>{
  const infoRequest = request.body

  const existeEmail = users.find((usuario)=> usuario.email === infoRequest.email)
  
  if(existeEmail == undefined){
    return response.status(400).json("verifique suas credenciais!")
  }


  const existeSenha = users.find((usuario)=> usuario.password === infoRequest.password)
  
  if(existeSenha == undefined){
    return response.status(400).json("verifique suas credenciais!")
  }

  const accessToken = jwt.sign(
    { username: existeEmail.name  },
    "growdev",
    {
      expiresIn: "1800s",
    }
  );

   return response.status(201).json({
    accessToken
   })

})





app.listen(8080, () => console.log("Servidor iniciado"));