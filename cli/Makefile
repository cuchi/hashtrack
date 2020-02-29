all:
	GOPATH=`pwd` go get hashtrack
	GOPATH=`pwd` go build -o hashtrack hashtrack

clean:
	chmod +w -R bin src
	rm -rf bin hashtrack src/github.com src/golang.org

MODULES := $(shell find src/hashtrack/* -type d | grep -oP "^src/\K.*")
test:
	GOPATH=`pwd` go test $(MODULES)
