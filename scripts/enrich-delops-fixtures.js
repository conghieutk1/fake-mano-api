const fs = require('fs');
const path = require('path');

const fixturePath = path.resolve(__dirname, '..', 'data', 'delops_fixtures.json');
const fixtures = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

const commonCnfs = [
  'policy-ctrl',
  'notification-hub',
  'mediation-gw',
  'reconciliation',
  'rating-engine',
  'subscriber-profile',
  'quota-manager',
  'session-router',
  'cdr-processor',
  'balance-cache',
  'event-stream',
  'fraud-detector',
  'voucher-service',
  'catalog-sync',
  'payment-adapter',
  'sms-dispatcher',
  'email-dispatcher',
  'api-gateway',
  'usage-aggregator',
  'tax-engine',
  'partner-gateway',
  'inventory-bridge',
  'audit-exporter',
  'reporting-worker',
];

const roleCatalog = [
  { slug: 'api', deploymentType: 'Deployment' },
  { slug: 'worker', deploymentType: 'Deployment' },
  { slug: 'engine', deploymentType: 'StatefulSet' },
  { slug: 'scheduler', deploymentType: 'CronJob' },
  { slug: 'adapter', deploymentType: 'Deployment' },
  { slug: 'cache', deploymentType: 'StatefulSet' },
  { slug: 'consumer', deploymentType: 'Deployment' },
  { slug: 'exporter', deploymentType: 'Deployment' },
  { slug: 'admin', deploymentType: 'Deployment' },
  { slug: 'gateway', deploymentType: 'StatefulSet' },
];

function versionFor(index, env, roleIndex) {
  const major = 1 + (index % 4);
  const minor = 2 + (index % 7);
  const patch = env === 'staging2' && (index + roleIndex) % 3 === 0 ? 2 : 1;
  return `${major}.${minor}.${patch}`;
}

function configVersionFor(index, env, roleIndex) {
  const day = String(10 + ((index + roleIndex) % 18)).padStart(2, '0');
  const suffix = env === 'staging2' && (index + roleIndex) % 4 === 0 ? 'b' : 'a';
  return `2026.08.${day}-${suffix}`;
}

function image(name, version, env, id, cnf) {
  return {
    id: `mano-${env}-${id}`,
    name,
    provider: 'fake-mano',
    version,
    createdAt: `2026-08-${String(1 + (id % 6)).padStart(2, '0')}T${String(1 + (id % 18)).padStart(2, '0')}:00:00.000Z`,
    size: 180000000 + id * 321777,
    imageUsageStateType: 'IN_USE',
    description: `${name} ${version} fake MANO image`,
    cnfInstances: [{ vnfdId: cnf.vnfdId, cnfName: cnf.cnfId }],
  };
}

function configMap(name, version, env, id) {
  return {
    id: `cm-${env}-${id}`,
    name,
    version,
    provider: 'fake-mano',
    createTime: `2026-08-${String(1 + (id % 6)).padStart(2, '0')}T02:00:00.000Z`,
    updateTime: `2026-08-${String(1 + (id % 6)).padStart(2, '0')}T03:00:00.000Z`,
    usageState: 'IN_USE',
    size: 8192 + id * 512,
  };
}

function buildChargingCnf(env) {
  const cnf = {
    cnfId: 'charging-gw-staging1',
    vnfdId: 'vnfd-charging-gw',
    dfId: 'df-default',
  };
  const vdus = [
    { slug: 'main', imageName: 'ocs/charging-gw', version: '4.5.19', deploymentType: 'StatefulSet', configs: [
      { name: 'config/rating-config', version: '2026.07.01', mountPath: '/etc/charging/rating' },
      { name: 'config/charging-rules', version: '2026.08.01', mountPath: '/etc/charging/rules' },
    ] },
    { slug: 'worker', imageName: 'ocs/charging-worker', version: '4.5.19', deploymentType: 'Deployment', configs: [
      { name: 'config/rating-config', version: '2026.07.01', mountPath: '/etc/worker/rating' },
      { name: 'config/charging-worker', version: '2026.08.01', mountPath: '/etc/worker/runtime' },
    ] },
    { slug: 'api', imageName: 'ocs/charging-api', version: '4.5.19', deploymentType: 'Deployment', configs: [
      { name: 'config/charging-api', version: '2026.08.01', mountPath: '/etc/charging/api' },
    ] },
    { slug: 'event-adapter', imageName: 'ocs/charging-event-adapter', version: '4.5.19', deploymentType: 'Deployment', configs: [
      { name: 'config/charging-events', version: '2026.08.01', mountPath: '/etc/charging/events' },
    ] },
    { slug: 'rating-cache', imageName: 'ocs/charging-rating-cache', version: '4.5.19', deploymentType: 'StatefulSet', configs: [
      { name: 'config/rating-cache', version: '2026.08.01', mountPath: '/etc/charging/cache' },
    ] },
  ];
  return { ...cnf, vdus };
}

function buildHelmCnf(env) {
  const cnf = {
    cnfId: 'helm-addon-staging2',
    vnfdId: 'vnfd-helm-addon',
    dfId: 'df-default',
  };
  const vdus = [
    { slug: 'main', imageName: 'packages/helm-addon', version: '0.3.0', deploymentType: 'StatefulSet', configs: [] },
    { slug: 'renderer', imageName: 'packages/helm-renderer', version: '0.3.0', deploymentType: 'Deployment', configs: [
      { name: 'config/addon-renderer', version: '2026.08.01', mountPath: '/etc/addon/renderer' },
    ] },
    { slug: 'validator', imageName: 'packages/helm-validator', version: '0.3.0', deploymentType: 'Deployment', configs: [
      { name: 'config/addon-validator', version: '2026.08.01', mountPath: '/etc/addon/validator' },
    ] },
    { slug: 'publisher', imageName: 'packages/helm-publisher', version: '0.3.0', deploymentType: 'Deployment', configs: [
      { name: 'config/addon-publisher', version: '2026.08.01', mountPath: '/etc/addon/publisher' },
    ] },
    { slug: 'cleanup', imageName: 'packages/helm-cleanup', version: '0.3.0', deploymentType: 'CronJob', configs: [
      { name: 'config/addon-cleanup', version: '2026.08.01', mountPath: '/etc/addon/cleanup' },
    ] },
  ];
  return { ...cnf, vdus };
}

function buildCommonCnf(baseName, index, env) {
  const vduCount = 5 + (index % 6);
  const vdus = roleCatalog.slice(0, vduCount).map((role, roleIndex) => ({
    slug: role.slug,
    imageName: `ocs/${baseName}-${role.slug}`,
    version: versionFor(index, env, roleIndex),
    deploymentType: role.deploymentType,
    configs: [
      {
        name: `config/${baseName}-${role.slug}`,
        version: configVersionFor(index, env, roleIndex),
        mountPath: `/etc/${baseName}/${role.slug}`,
      },
      {
        name: `config/${baseName}-shared`,
        version: configVersionFor(index, env, 0),
        mountPath: `/etc/${baseName}/shared`,
      },
    ],
  }));
  return {
    cnfId: baseName,
    vnfdId: `vnfd-${baseName}`,
    dfId: index % 5 === 0 ? 'df-large' : index % 4 === 0 ? 'df-batch' : 'df-default',
    vdus,
  };
}

function enrichEnv(env) {
  const special = env === 'staging1' ? buildChargingCnf(env) : buildHelmCnf(env);
  const cnfs = [special, ...commonCnfs.map((name, index) => buildCommonCnf(name, index, env))];
  const manoImages = [];
  const configMapMap = new Map();
  const cnfInstances = [];
  const vnfdDescriptors = [];
  const deploymentFlavours = {};
  const containers = {};
  let imageId = env === 'staging1' ? 1000 : 2000;
  let configId = env === 'staging1' ? 1000 : 2000;

  for (const cnf of cnfs) {
    cnfInstances.push({ vnfInstanceName: cnf.cnfId, vnfdId: cnf.vnfdId });
    vnfdDescriptors.push({
      vnfdId: cnf.vnfdId,
      swImageDesc: cnf.vdus.map(vdu => ({ swImage: `${vdu.imageName}:${vdu.version}` })),
    });
    deploymentFlavours[cnf.vnfdId] = [
      {
        deploymentFlavourId: cnf.dfId,
        vduInfos: cnf.vdus.map((vdu, index) => ({
          vdu: {
            vduId: `vdu-${vdu.slug}`,
            name: `vdu-${vdu.slug}`,
            description: `${cnf.cnfId} ${vdu.slug} runtime`,
            priority: index + 1,
          },
          imageInfos: [
            {
              id: `image-${cnf.cnfId}-${vdu.slug}`,
              name: vdu.imageName,
              version: vdu.version,
            },
          ],
        })),
      },
    ];
    containers[cnf.vnfdId] = { [cnf.dfId]: {} };

    for (const vdu of cnf.vdus) {
      imageId += 1;
      manoImages.push(image(vdu.imageName, vdu.version, env, imageId, cnf));
      for (const cm of vdu.configs) {
        const key = `${cm.name}:${cm.version}`;
        if (!configMapMap.has(key)) {
          configId += 1;
          configMapMap.set(key, configMap(cm.name, cm.version, env, configId));
        }
      }
      containers[cnf.vnfdId][cnf.dfId][`vdu-${vdu.slug}`] = [
        {
          osContainerDescId: `container-${cnf.cnfId}-${vdu.slug}`,
          extendedResourceRequests: [
            {
              deploymentType: vdu.deploymentType,
              configMaps: vdu.configs.map(cm => ({
                name: cm.name,
                version: cm.version,
                mount_path: cm.mountPath,
              })),
            },
          ],
        },
      ];
    }
  }

  manoImages.push({
    id: `mano-${env}-unused-1`,
    name: env === 'staging1' ? 'ocs/legacy-balance-checker' : 'ocs/obsolete-cleaner',
    provider: 'fake-mano',
    version: env === 'staging1' ? '0.9.7' : '0.1.0',
    createdAt: '2026-07-12T10:00:00.000Z',
    size: 142991020,
    imageUsageStateType: 'NOT_IN_USE',
    description: 'Unused image for dashboard and status coverage',
    cnfInstances: [],
  });

  if (env === 'staging2') {
    manoImages.unshift({
      id: 'mano-stg2-charging-available',
      name: 'ocs/charging-gw',
      provider: 'fake-mano',
      version: '4.5.19',
      createdAt: '2026-07-30T09:00:00.000Z',
      size: 438829401,
      imageUsageStateType: 'NOT_IN_USE',
      description: 'Available but not attached to any CNF in staging2',
      cnfInstances: [],
    });
  }

  fixtures[env] = {
    ...fixtures[env],
    manoImages,
    configMaps: Array.from(configMapMap.values()),
    cnfInstances,
    vnfdDescriptors,
    deploymentFlavours,
    containers,
  };
}

enrichEnv('staging1');
enrichEnv('staging2');

fs.writeFileSync(fixturePath, `${JSON.stringify(fixtures, null, 2)}\n`);
