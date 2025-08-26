# AutoCare Advisor - Kubernetes Deployment Guide

## Overview

This directory contains Kubernetes manifests for deploying the AutoCare Advisor platform with enterprise-grade infrastructure, monitoring, and auto-scaling capabilities.

## Architecture

### Namespaces

- `autocare-advisor`: Application tier (frontend, backend)
- `autocare-db`: Database tier (PostgreSQL, MongoDB, Redis)
- `monitoring`: Observability stack (Prometheus, Grafana)

### Components

#### Database Tier (`autocare-db` namespace)

- **PostgreSQL**: User data, subscriptions, analytics

  - StatefulSet with persistent storage (20Gi base, 100Gi production)
  - Resource limits: 500m CPU, 1Gi RAM (base) / 2CPU, 4Gi RAM (production)
  - Health checks and backup ready

- **MongoDB**: Product catalog, recommendations

  - StatefulSet with persistent storage (20Gi base, 100Gi production)
  - Resource limits: 500m CPU, 1Gi RAM (base) / 1CPU, 2Gi RAM (production)
  - Replica set configuration ready

- **Redis**: Caching, sessions
  - StatefulSet with persistent storage (8Gi base, 32Gi production)
  - Resource limits: 250m CPU, 512Mi RAM (base) / 500m CPU, 1Gi RAM (production)
  - Persistence enabled

#### Application Tier (`autocare-advisor` namespace)

- **Backend API**: Express.js REST API

  - Deployment with 2 replicas (3 in production)
  - HorizontalPodAutoscaler: 2-10 pods based on CPU/memory
  - Init containers wait for database availability
  - Health checks and rolling updates

- **Frontend**: Next.js React application
  - Deployment with 2 replicas (3 in production)
  - HorizontalPodAutoscaler: 2-8 pods based on CPU/memory
  - Init container waits for backend availability

#### Monitoring Stack (`monitoring` namespace)

- **Prometheus**: Metrics collection and alerting

  - Scrapes application and infrastructure metrics
  - Alert rules for CPU, memory, disk, and availability
  - 15-day data retention

- **Grafana**: Visualization and dashboards
  - Pre-configured AutoCare Advisor dashboard
  - Connected to Prometheus datasource
  - Admin access secured

## Prerequisites

1. **Kubernetes Cluster** (1.24+)

   - At least 3 nodes for production
   - StorageClass for persistent volumes
   - LoadBalancer support or Ingress controller

2. **Required Tools**

   ```bash
   kubectl --version
   kustomize --version  # Optional but recommended
   ```

3. **Ingress Controller** (recommended: NGINX)

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
   ```

4. **Cert-Manager** (for TLS certificates)
   ```bash
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml
   ```

## Deployment Instructions

### 1. Base Deployment

```bash
# Deploy namespaces and secrets
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/base/secrets.yaml
kubectl apply -f k8s/base/configmaps.yaml

# Deploy database tier
kubectl apply -f k8s/base/postgres.yaml
kubectl apply -f k8s/base/mongodb.yaml
kubectl apply -f k8s/base/redis.yaml

# Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n autocare-db --timeout=300s
kubectl wait --for=condition=ready pod -l app=mongodb -n autocare-db --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n autocare-db --timeout=300s

# Deploy application tier
kubectl apply -f k8s/base/backend.yaml
kubectl apply -f k8s/base/frontend.yaml

# Deploy ingress and network policies
kubectl apply -f k8s/base/ingress.yaml
```

### 2. Production Deployment with Kustomize

```bash
# Deploy with production overlays
kubectl apply -k k8s/overlays/production/

# Verify deployment
kubectl get pods -n autocare-advisor
kubectl get pods -n autocare-db
```

### 3. Monitoring Stack

```bash
# Deploy monitoring
kubectl apply -f k8s/monitoring/prometheus.yaml
kubectl apply -f k8s/monitoring/grafana.yaml

# Access Grafana (port-forward for testing)
kubectl port-forward -n monitoring svc/grafana-service 3000:3000
# Open http://localhost:3000 (admin/autocare_grafana_admin_2024)
```

## Configuration

### Environment Variables

Update secrets and configmaps before deployment:

```bash
# Generate base64 encoded values
echo -n "your-secret-value" | base64

# Update secrets.yaml with your values
kubectl edit secret autocare-backend-secret -n autocare-advisor
```

### DNS Configuration

Update ingress.yaml with your domain:

- `api.autocare-advisor.com` → `api.yourdomain.com`
- `app.autocare-advisor.com` → `app.yourdomain.com`
- `monitoring.autocare-advisor.com` → `monitoring.yourdomain.com`

### SSL Certificates

The ingress uses cert-manager for automatic SSL certificates. Ensure:

1. Cert-manager is installed
2. DNS records point to your ingress controller
3. ClusterIssuer `letsencrypt-prod` is configured

## Scaling and Performance

### Horizontal Pod Autoscaler

- **Backend**: Scales 2-10 pods based on 70% CPU / 80% memory
- **Frontend**: Scales 2-8 pods based on 70% CPU / 75% memory
- **Metrics Server** required: `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`

### Resource Requests

- **Base Environment**: ~2.5 CPU, 4Gi RAM total
- **Production Environment**: ~8 CPU, 16Gi RAM total
- **Storage**: 48Gi base, 232Gi production

### Performance Tuning

1. **Database Optimization**: ConfigMaps contain tuned settings
2. **Connection Pooling**: Backend configured for database connection reuse
3. **Caching Strategy**: Redis used for session and query caching
4. **CDN Ready**: Static assets can be served from CDN

## Monitoring and Alerts

### Prometheus Metrics

- Application performance metrics
- Database health and performance
- Kubernetes cluster metrics
- Custom business metrics

### Grafana Dashboards

- AutoCare Advisor Overview dashboard included
- Additional dashboards can be imported from Grafana Labs

### Alert Rules

- High CPU/Memory usage (>80%/85%)
- Pod crash looping
- Database connectivity issues
- High disk usage (>85%)

## Security

### Network Policies

- Application namespace: Only ingress and database access
- Database namespace: Only application access
- Monitoring: Isolated with specific access rules

### Pod Security

- Non-root containers where possible
- Resource limits enforced
- Security contexts configured

### Secrets Management

- All sensitive data in Kubernetes secrets
- Base64 encoding (consider external secret management for production)

## Backup and Disaster Recovery

### Database Backups

```bash
# PostgreSQL backup
kubectl exec -n autocare-db postgres-0 -- pg_dump -U autocare_user autocare_db > backup.sql

# MongoDB backup
kubectl exec -n autocare-db mongodb-0 -- mongodump --username autocare_mongo --password $MONGO_PASSWORD --db autocare_products --out /tmp/backup

# Redis backup (automatic with persistence enabled)
kubectl exec -n autocare-db redis-0 -- redis-cli BGSAVE
```

### Persistent Volume Snapshots

```bash
# Create volume snapshots (if supported by storage provider)
kubectl create -f - <<EOF
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: postgres-snapshot-$(date +%Y%m%d)
  namespace: autocare-db
spec:
  source:
    persistentVolumeClaimName: postgres-storage-postgres-0
EOF
```

## Troubleshooting

### Common Issues

1. **Pods not starting**: Check resource availability

   ```bash
   kubectl describe pod <pod-name> -n <namespace>
   kubectl get events -n <namespace>
   ```

2. **Database connection issues**: Verify secrets and network policies

   ```bash
   kubectl get secrets -n autocare-advisor
   kubectl describe networkpolicy -n autocare-advisor
   ```

3. **Ingress not working**: Check ingress controller and DNS
   ```bash
   kubectl get ingress -n autocare-advisor
   kubectl describe ingress autocare-ingress -n autocare-advisor
   ```

### Logging

```bash
# Application logs
kubectl logs -f deployment/autocare-backend -n autocare-advisor
kubectl logs -f deployment/autocare-frontend -n autocare-advisor

# Database logs
kubectl logs -f statefulset/postgres -n autocare-db
kubectl logs -f statefulset/mongodb -n autocare-db
kubectl logs -f statefulset/redis -n autocare-db
```

## Maintenance

### Updates

1. Update container images in kustomization.yaml
2. Apply rolling updates: `kubectl apply -k k8s/overlays/production/`
3. Monitor rollout: `kubectl rollout status deployment/autocare-backend -n autocare-advisor`

### Scaling

```bash
# Manual scaling
kubectl scale deployment autocare-backend --replicas=5 -n autocare-advisor

# Update HPA limits
kubectl patch hpa backend-hpa -n autocare-advisor -p '{"spec":{"maxReplicas":15}}'
```

### Health Checks

```bash
# Overall cluster health
kubectl get nodes
kubectl get pods --all-namespaces

# Application health
kubectl get svc,deployment,hpa -n autocare-advisor
kubectl get statefulset,pvc -n autocare-db
```

## Support and Documentation

- **Application Health**: `https://api.yourdomain.com/health`
- **Monitoring**: `https://monitoring.yourdomain.com`
- **Metrics**: `https://monitoring.yourdomain.com:9090` (Prometheus)
- **Logs**: Available through `kubectl logs` or log aggregation system

For production deployments, consider:

- External secret management (HashiCorp Vault, AWS Secrets Manager)
- Advanced monitoring (Datadog, New Relic)
- Log aggregation (ELK Stack, Fluentd)
- Service mesh (Istio, Linkerd) for advanced traffic management
