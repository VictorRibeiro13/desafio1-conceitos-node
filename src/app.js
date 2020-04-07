const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0}

  repositories.push(repositorie);

  return response.status(200).json(repositorie);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: "ID Not Valid" })
  }

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);
  
  if(repositoryIndex < 0) { 
    return response.status(400).json({ error: "Respository dont exists"})
  }
  
  const { title, url, techs } = request.body;

  const newRepository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories[repositoryIndex] = newRepository;

  return response.status(200).json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: "ID Not Valid" })
  }

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);
  
  if(repositoryIndex < 0) { 
    return response.status(400).json({ error: "Respository dont exists"})
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  if(!isUuid(id)){
    return response.status(400).json({error: "ID Not Valid"})
  }

  const repositoryIndex = repositories.findIndex(rep => rep.id == id);

  if(repositoryIndex < 0){
    return response.status(404).json({ error: "Repository not found"});
  }

  repositories[repositoryIndex].likes += 1; 

  return response.status(200).json({ likes: repositories[repositoryIndex].likes })

});

module.exports = app;
