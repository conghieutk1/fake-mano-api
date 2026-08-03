# Fake MANO API

Backend Express đơn giản để giả lập các API của MANO.

Dữ liệu hiện tại được chỉnh theo mẫu lab CNF `data`:

- CNF instance mẫu: `hla-ocs01-data01`
- `vnfdId`: `9b9a9f9d-ede1-4928-97e0-6e03fb4b9a5c`
- `vnfdRawId`: `a701ea54-bfad-4027-861e-d2340c5d3a19`
- `vnfProvider`: `OCS`
- `vnfProductName`: `data`
- `vnfdVersion`: `1.0.2`
- Full VNFD có 25 VDU, 29 image, 32 configmap unique.

## Cài đặt

```bash
npm install
```

## Chạy Server

```bash
npm start
```
Server sẽ chạy tại: `http://localhost:3001` (đã đổi port theo yêu cầu của user)

## Các API hỗ trợ

1. **Authentication**
   - URL: `POST /users/auth`
   - Trả về token giả lập.

2. **Lấy danh sách Image (VIM)**
   - URL: `GET /vim/v1/images` hoặc `GET /plugins/v1/mano/images`

3. **Lấy danh sách Configmap**
   - URL: `GET /cm/v1/configInfos`

4. **Lấy danh sách VNF Descriptor (VNFD)**
   - URL: `GET /cnfd-runtime/v1/vnf_descriptors`

5. **Lấy full VNF Descriptor**
   - URL: `GET /cnfd-runtime/v1/full_vnf_descriptors`
   - URL: `GET /cnfd-runtime/v1/full_vnf_descriptors/`
   - URL: `GET /cnfd-runtime/v1/full_vnf_descriptors/{vnfdId}`
   - Query filter hỗ trợ: `vnfdId`, `vnfProductName`, `vnfdVersion`

6. **Lấy danh sách CNF Instance**
   - URL: `GET /cnflcm/v2/vnf_instances`
   - Query filter hỗ trợ: `vnfInstanceName`, `vnfdId`, `vnfProductName`, `vnfdVersion`, `instantiationState`

7. **Lấy chi tiết CNF Instance**
   - URL: `GET /cnflcm/v2/vnf_instances/{id}`
   - `{id}` có thể là `id`, `_id`, hoặc `vnfInstanceName`

8. **Lấy danh sách Deployment Flavour (DF)**
   - URL: `GET /cnfd-runtime/v1/vnf_descriptors/{vnfdId}/deployment-flavours`

9. **Lấy danh sách Container (Env & ConfigMap)**
   - URL: `GET /cnfd-runtime/v1/vnf_descriptors/{vnfdId}/deployment-flavours/{dfId}/vdus/{vduId}/containers`

10. **DelOps fake profile theo môi trường**
   - Dữ liệu chính: `data/delops_fixtures.json`
   - Base URL mẫu: `http://localhost:3001/fake/staging1`
   - Env hỗ trợ sẵn: `root`, `staging1`, `staging2`
   - Harbor:
     - `GET /fake/{env}/api/v2.0/projects/{projectName}/repositories`
     - `GET /fake/{env}/api/v2.0/projects/{projectName}/repositories/{repoName}/artifacts`
     - `GET /fake/{env}/plugins/v1/harbor/projects/{projectName}/root-repositories`
     - `GET /fake/{env}/plugins/v1/harbor/projects/{projectName}/all-repositories`
     - `GET /fake/{env}/plugins/v1/harbor/projects/{projectName}/repositories/root-artifacts?repositoryName=...`
     - `GET /fake/{env}/plugins/v1/harbor/projects/{projectName}/repositories/all-artifacts?repositoryName=...`
   - MANO:
     - `POST /fake/{env}/users/auth`
     - `GET /fake/{env}/vim/v1/images`
     - `GET /fake/{env}/cm/v1/configInfos`
     - `GET /fake/{env}/cnflcm/v2/vnf_instances`
     - `GET /fake/{env}/cnfd-runtime/v1/vnf_descriptors`
     - `GET /fake/{env}/cnfd-runtime/v1/vnf_descriptors/{vnfdId}/deployment-flavours`
     - `GET /fake/{env}/cnfd-runtime/v1/vnf_descriptors/{vnfdId}/deployment-flavours/{dfId}/vdus/{vduId}/containers`

## Cách chỉnh sửa dữ liệu

Mọi dữ liệu mock nằm trong thư mục `data/`:

- `vnfInstances`
- `deploymentFlavours`
- `vduContainers`
- `manoImages`
- `manoConfigmaps`
- `vnfDescriptors`
- `fullVnfDescriptors`
- `delops_fixtures.json` là fixture canonical cho manual DelOps fake và test fake end-to-end trong `devops-agent`.
