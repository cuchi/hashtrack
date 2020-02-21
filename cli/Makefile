all:
	GOPATH=`pwd` go get hashtrack/main
	GOPATH=`pwd` go build -o hashtrack hashtrack/main

clean:
	rm hashtrack

clean-all:
	chmod +w -R bin src pkg
	git clean -Xdf
