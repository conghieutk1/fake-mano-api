# Fake MANO API

Backend Express đơn giản để giả lập các API của MANO.

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

5. **Lấy danh sách CNF Instance**
   - URL: `GET /cnflcm/v1/vnf_instances`

6. **Lấy danh sách Deployment Flavour (DF)**
   - URL: `GET /cnfd-runtime/v1/vnf_descriptors/{vnfdId}/deployment-flavours`

7. **Lấy danh sách Container (Env & ConfigMap)**
   - URL: `GET /cnfd-runtime/v1/vnf_descriptors/{vnfdId}/deployment-flavours/{dfId}/vdus/{vduId}/containers`

## Cách chỉnh sửa dữ liệu

Mọi dữ liệu mock nằm trong file `server.js`. Bạn có thể dễ dàng thêm hoặc sửa các đối tượng trong các biến:
- `vnfInstances`
- `deploymentFlavours`
- `vduContainers`
- `manoImages`
- `manoConfigmaps`
- `vnfDescriptors`
