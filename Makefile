# VARIABLES
REGISTRY          := git.hisoft.com.vn:5050
GROUP             := hongky-1994
IMAGE_NAME        := web-future-lang-react
TAG               := $(shell git rev-parse --short HEAD)
REGISTRY_IMAGE    := $(REGISTRY)/$(GROUP)/$(IMAGE_NAME)

dev:
	@docker build -t $(REGISTRY_IMAGE):$(TAG) .
	@echo $(TAG)
	@docker tag $(REGISTRY_IMAGE):$(TAG) $(REGISTRY_IMAGE):latest
	@docker push $(REGISTRY_IMAGE):latest
	@docker image prune -f
