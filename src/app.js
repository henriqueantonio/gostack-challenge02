const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response
      .status(400)
      .json({ error: 'You need to give title, url and techs' });
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  const { title, url, techs } = request.body;

  const data = repositories[repositoryIndex];

  const repository = {
    ...data,
    title: title || data.title,
    url: url || data.url,
    techs: url || data.techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json({ id: data.id, url, title, techs, likes: data.likes });
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  let repo = repositories[repositoryIndex];

  repo = {
    ...repo,
    likes: (repo.likes += 1),
  };

  return response.json(repo);
});

module.exports = app;
