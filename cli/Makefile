all:
	GOPATH=`pwd` go get hashtrack/main
	GOPATH=`pwd` go build -o hashtrack hashtrack/main

clean:
	chmod +w -R bin src
	rm -rf bin hashtrack src/github.com src/golang.org
