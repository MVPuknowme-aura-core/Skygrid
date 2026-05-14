FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="SkyGrid"
LABEL org.opencontainers.image.description="SkyGrid reliability and deployment scaffold powered by Aura-Core"
LABEL org.opencontainers.image.source="https://github.com/MVPuknowme-aura-core/Skygrid"

COPY public/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
