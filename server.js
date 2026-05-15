const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// --- Mock Data ---
const vnfInstances = require('./data/vnf_instances.json');
const deploymentFlavours = require('./data/deployment_flavours.json');
const vduContainers = require('./data/vdu_containers.json');
const manoImages = require('./data/mano_images.json');
const manoConfigmaps = require('./data/mano_configmaps.json');
const vnfDescriptors = require('./data/vnf_descriptors.json');
const harborRepositories = require('./data/harbor_repositories.json');
const harborArtifacts = require('./data/harbor_artifacts.json');

// --- Routes ---

/**
 * Harbor Fake API
 */

// Ping
app.get('/api/v2.0/ping', (req, res) => {
  res.send('Pong');
});

// Current User
app.get('/api/v2.0/users/current', (req, res) => {
  res.json({
    "user_id": 1,
    "username": "hieudang2002",
    "email": "hieudang@example.com",
    "realname": "Hieu Dang",
    "comment": "Fake User",
    "admin_role": true
  });
});

// List Repositories
app.get('/api/v2.0/projects/:projectName/repositories', (req, res) => {
  const { projectName } = req.params;
  const repos = harborRepositories.filter(r => r.name.startsWith(projectName + '/'));
  res.json(repos);
});

// List Artifacts
app.get('/api/v2.0/projects/:projectName/repositories/:repoName/artifacts', (req, res) => {
  const { projectName, repoName } = req.params;
  const decodedRepoName = decodeURIComponent(repoName);
  const fullName = projectName + '/' + decodedRepoName;
  const artifacts = harborArtifacts[fullName] || [];
  res.json(artifacts);
});

// Proxy / Plugin Endpoints
app.get('/plugins/v1/harbor/projects/:projectName/root-repositories', (req, res) => {
  const { projectName } = req.params;
  const repos = harborRepositories.filter(r => r.name.startsWith(projectName + '/'));
  res.json(repos);
});

app.get('/plugins/v1/harbor/projects/:projectName/all-repositories', (req, res) => {
  const { projectName } = req.params;
  const repos = harborRepositories.filter(r => r.name.startsWith(projectName + '/'));
  res.json(repos);
});

app.get('/plugins/v1/harbor/projects/:projectName/repositories/all-artifacts', (req, res) => {
  const { projectName } = req.params;
  const { repositoryName } = req.query;
  const artifacts = harborArtifacts[repositoryName] || [];
  res.json(artifacts);
});

/**
 * Authentication
 * POST /users/auth
 */
app.post('/users/auth', (req, res) => {
  res.json({
    "access_token": "fake-token-" + Math.random().toString(36).substring(7),
    "token_type": "Bearer"
  });
});

/**
 * MANO images list
 * GET /vim/v1/images
 * GET /plugins/v1/mano/images
 */
const getImages = (req, res) => {
  res.json(manoImages);
};
app.get('/vim/v1/images', getImages);
app.post('/vim/v1/images', (req, res) => {
  res.status(201).json({ message: "Image created (fake)" });
});
app.get('/plugins/v1/mano/images', getImages);

/**
 * MANO configmap list
 * GET /cm/v1/configInfos
 */
app.get('/cm/v1/configInfos', (req, res) => {
  res.json(manoConfigmaps);
});

/**
 * MANO VNF Descriptors list
 * GET /cnfd-runtime/v1/vnf_descriptors
 */
app.get('/cnfd-runtime/v1/vnf_descriptors', (req, res) => {
  res.json(vnfDescriptors);
});

/**
 * 7. Get Multi CNF Instance
 * GET /cnflcm/v1/vnf_instances
 */
app.get('/cnflcm/v1/vnf_instances', (req, res) => {
  res.json(vnfInstances);
});

/**
 * 4.1 Get danh sách DF
 * GET /cnfd-runtime/v1/vnf_descriptors/:vnfdId/deployment-flavours
 */
app.get('/cnfd-runtime/v1/vnf_descriptors/:vnfdId/deployment-flavours', (req, res) => {
  const { vnfdId } = req.params;
  const flavour = deploymentFlavours[vnfdId];

  if (flavour) {
    res.json(flavour);
  } else {
    res.status(404).json({
      message: `Not found any Vnfd with id = ${vnfdId}`
    });
  }
});

/**
 * 4.2 Get danh sách biến môi trường và configmap
 * GET /cnfd-runtime/v1/vnf_descriptors/:vnfdId/deployment-flavours/:deploymentFlavourId/vdus/:vduId/containers
 */
app.get('/cnfd-runtime/v1/vnf_descriptors/:vnfdId/deployment-flavours/:deploymentFlavourId/vdus/:vduId/containers', (req, res) => {
  const { vnfdId, deploymentFlavourId, vduId } = req.params;

  const vnfdContainers = vduContainers[vnfdId];
  if (!vnfdContainers) {
    return res.status(404).json({ message: `Not found any Vnfd with id = ${vnfdId}` });
  }

  const containers = vnfdContainers[vduId];
  if (!containers) {
    return res.status(404).json({ message: `Cannot find any vduId: ${vduId} in vnfdId: ${vnfdId}` });
  }

  res.json(containers);
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Fake MANO & Harbor API is running!');
});

app.listen(port, () => {
  console.log(`Fake API listening at http://localhost:${port}`);
});
