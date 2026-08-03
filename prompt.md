- Tài liệu API của MANO

7. Get Multi CNF Instance

API: GET /cnflcm/v2/vnf_instances
Mô tả:Lấy danh sách tất cả CNF Instance.

Request Header:
Authorization: Bearer xxx

Request Parameter: Không có
Request Body: Không có

Response:

200 OK:Trả về danh sách tất cả CNF Instance
Response body: List<VnfInstance>

4xx/5xx:Lỗi hệ thống hoặc dữ liệu không hợp lệ
Response body: ProblemDetails

Ví dụ Response Body:
[
  {
    "id": "xxx",
    "vnfInstanceName": "xxx",
    "vnfInstanceDescription": "xxx",
    "vnfdId": "xxx",
    "vnfProvider": "xxx",
    "vnfProductName": "xxx",
    "vnfSoftwareVersion": "xxx",
    "vnfdVersion": "xxx",
    "vnfPkgId": "xxx",
    "vnfConfigurableProperties": "xxx",
    "vimId": "xxx",
    "instantiationState": "NOT_INSTANTIATED",
    "instantiatedVnfInfo": {
      "flavourId": "xxx",
      "vnfState": "STOPPED",
      "scaleStatus": "",
      "extcpInfo": "",
      "extVirtualLinkInfo": null,
      "vnfcResourceInfo": [],
      "vnfcInfo": [
        {
          "id": "xxx",
          "vduId": "",
          "vnfcState": "STOPPED",
          "vnfcConfigurableProperty": ""
        },
        {
          "id": "xxx",
          "vduId": "",
          "vnfcState": "STOPPED",
          "vnfcConfigurableProperty": ""
        }
      ]
    },
    "metadata": "xxx",
    "extensions": "xxx",
    "operationalState": "STARTED",
    "computeId": "xxx"
  },
  {
    "id": "xxx2",
    "vnfInstanceName": "xxx2",
    "vnfInstanceDescription": "xxx",
    "vnfdId": "xxx2",
    "vnfProvider": "xxx",
    "vnfProductName": "xxx",
    "vnfSoftwareVersion": "xxx",
    "vnfdVersion": "xxx",
    "vnfPkgId": "xxx",
    "vnfConfigurableProperties": "xxx",
    "vimId": "xxx",
    "instantiationState": "NOT_INSTANTIATED",
    "instantiatedVnfInfo": {
      "flavourId": "xxx",
      "vnfState": "STOPPED",
      "scaleStatus": "",
      "extcpInfo": "",
      "extVirtualLinkInfo": null,
      "vnfcResourceInfo": [],
      "vnfcInfo": [
        {
          "id": "xxx",
          "vduId": "",
          "vnfcState": "STOPPED",
          "vnfcConfigurableProperty": ""
        },
        {
          "id": "xxx",
          "vduId": "",
          "vnfcState": "STOPPED",
          "vnfcConfigurableProperty": ""
        }
      ]
    },
    "metadata": "xxx",
    "extensions": "xxx",
    "operationalState": "STARTED",
    "computeId": "xxx"
  }


4. Quản lý CNFD runtime
4.1 Get danh sách DF
API: GET /cnfd-runtime/v1/vnf_descriptors/{vnfdId}/deployment-flavours

Mô tả:
Lấy danh sách Deployment Flavour của VNFD.

Request Header:

Authorization: Bearer xxx

Request Parameter:
vnfdId (String): ID của VNFD

Request Body:
Không có

Response:
200 OK: Trả về danh sách Deployment Flavour
Response body: GetDeploymentFlavourResponse

404 NOT FOUND: Không tìm thấy VNFD tương ứng với vnfdId
Message: Not found any Vnfd with id = $vnfdId

4xx/5xx: Lỗi hệ thống hoặc dữ liệu không hợp lệ

Response body: ProblemDetails

Ví dụ Response Body:
{
  "deploymentFlavourId": "standard",
  "vduInfos": [
    {
      "vdu": {
        "vduId": "id cua vdu",
        "name": "Ten cua vdu",
        "description": "Mo ta cho vdu",
        "priority": 1
      },
      "vduProfile": {
        "vduId": "id cua vdu",
        "minNumberOfInstance": 1,
        "maxNumberOfInstance": 3
      },
      "imageInfos": [
        {
          "id": "id cua image",
          "name": "Ten cua image",
          "version": "Version cua image"
        }
      ]
    }
  ]
}

4.2 Get danh sách biến môi trường và configmap
API: GET /cnfd-runtime/v1/vnf_descriptors/{vnfdId}/deployment-flavours/{deploymentFlavourId}/vdus/{vduId}/containers

Mô tả:
Lấy danh sách Container của VDU trong Deployment Flavour.

Request Header:
Authorization: Bearer xxx

Request Parameter:
vnfdId (String): ID của VNFD
deploymentFlavourId (String): ID của Deployment Flavour
vduId (String): ID của VDU

Request Body: Không có

Response:
200 OK: Trả về danh sách Container
Response body: List<OsContainer>

404 NOT FOUND: Không tìm thấy VNFD tương ứng với vnfdId
Message: Not found any Vnfd with id = $vnfdId/Không tìm thấy VDU tương ứng
Message: Cannot find any vduId: $vduId in vnfdId: $vnfdId

4xx/5xx:Lỗi hệ thống hoặc dữ liệu không hợp lệ

Response body: ProblemDetails

Ví dụ Response Body:
[
  {
    "osContainerDescId": "id cua container",
    "requestedCpuResource": 8,
    "extendedResourceRequests": [
      {
        "deploymentType": "DEPLOYMENT",
        "environments": {
          "HEAP": "4G",
          "MANO_ENABLE": "true"
        },
        "configMaps": [
          {
            "name": "gy-cgw",
            "mount_path": "/u01/app",
            "version": "v1",
            "_ready_only": false
          }
        ]
      }
    ]
  }
]
