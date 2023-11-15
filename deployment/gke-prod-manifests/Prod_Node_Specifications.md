# Specifications for GKE Nodes
The nodes used in GKE are of the machine type e2-standard-4

| Key | Value |
|-----|-------|
| vCPUs per node | 4     |
| Memory size | 16 GB |
| Boot disk size | 50 GB |
| Node image type | cos_containerd |

The GKE cluster is created in asia-southeast1 region across all 3 availability zones.
1 node is created per zone.
